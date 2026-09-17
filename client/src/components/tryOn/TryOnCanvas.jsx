import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Calendar, Sparkles, Move, ZoomIn, ZoomOut } from 'lucide-react';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const TryOnCanvas = ({
  handImageSrc,
  overlaySrc,
  selectedDesign,
  scale,
  setScale,
  rotation,
  setRotation,
  opacity,
  setOpacity,
  flipH,
  setFlipH,
  pushHistory,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 }); // Normalized coordinates (0 to 1)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 1000 });
  const navigate = useNavigate();

  // Load hand image
  const [handImg, setHandImg] = useState(null);
  const [overlayImg, setOverlayImg] = useState(null);

  useEffect(() => {
    if (!handImageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = handImageSrc;
    img.onload = () => {
      setHandImg(img);
    };
  }, [handImageSrc]);

  useEffect(() => {
    if (!overlaySrc) {
      setOverlayImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = overlaySrc;
    img.onload = () => {
      setOverlayImg(img);
    };
  }, [overlaySrc]);

  // Redraw canvas whenever parameters change
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !handImg) return;
    const ctx = canvas.getContext('2d');

    // Keep aspect ratio of hand image
    const maxWidth = 900;
    const scaleFactor = Math.min(1, maxWidth / handImg.width);
    const canvasW = Math.round(handImg.width * scaleFactor);
    const canvasH = Math.round(handImg.height * scaleFactor);

    if (canvas.width !== canvasW || canvas.height !== canvasH) {
      canvas.width = canvasW;
      canvas.height = canvasH;
      setCanvasDimensions({ width: canvasW, height: canvasH });
    }

    // Clear
    ctx.clearRect(0, 0, canvasW, canvasH);

    // 1. Draw hand image
    ctx.drawImage(handImg, 0, 0, canvasW, canvasH);

    // 2. Draw Mehndi overlay if present
    if (overlayImg) {
      ctx.save();

      const overlayCenterX = position.x * canvasW;
      const overlayCenterY = position.y * canvasH;

      ctx.translate(overlayCenterX, overlayCenterY);
      ctx.rotate((rotation * Math.PI) / 180);
      if (flipH) {
        ctx.scale(-1, 1);
      }
      ctx.globalAlpha = opacity;

      // Calculate overlay dimensions
      const baseOverlaySize = canvasW * 0.55;
      const overlayAspect = overlayImg.width / overlayImg.height || 1;
      const overlayW = baseOverlaySize * scale;
      const overlayH = (baseOverlaySize / overlayAspect) * scale;

      ctx.drawImage(
        overlayImg,
        -overlayW / 2,
        -overlayH / 2,
        overlayW,
        overlayH
      );

      ctx.restore();
    }
  }, [handImg, overlayImg, position, scale, rotation, opacity, flipH]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Pointer / Drag handling
  const handlePointerDown = (e) => {
    if (!overlayImg) return;
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    setDragStart({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !overlayImg) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    const deltaX = (currentX - dragStart.x) / rect.width;
    const deltaY = (currentY - dragStart.y) / rect.height;

    setPosition((prev) => ({
      x: Math.min(1, Math.max(0, prev.x + deltaX)),
      y: Math.min(1, Math.max(0, prev.y + deltaY)),
    }));

    setDragStart({
      x: currentX,
      y: currentY,
    });
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (pushHistory) {
        pushHistory({ position, scale, rotation, opacity, flipH });
      }
    }
  };

  // Download high-res preview image
  const handleDownloadPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `shreya-mehndi-tryon-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Try-On preview downloaded! You can share it with family.');
    } catch (err) {
      toast.error('Unable to download canvas preview: ' + err.message);
    }
  };

  const handleBookWithDesign = () => {
    const designParam = selectedDesign?.id
      ? `design=${selectedDesign.id}&title=${encodeURIComponent(selectedDesign.title)}`
      : '';
    navigate(`/book?${designParam}&tryon=true`);
  };

  return (
    <div className="space-y-4">
      {/* Canvas Frame */}
      <div
        ref={containerRef}
        className="relative bg-parchment-100 rounded-3xl border-2 border-parchment-200 overflow-hidden shadow-soft-md flex items-center justify-center min-h-[420px] max-h-[680px]"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className={`max-h-[650px] w-auto max-w-full object-contain ${
            overlayImg ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
        />

        {/* Drag Helper Overlay Tag */}
        {overlayImg && (
          <div className="absolute top-4 left-4 bg-espresso-900/75 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none shadow-soft-sm">
            <Move className="w-3.5 h-3.5" />
            <span>Click & Drag to reposition on hand</span>
          </div>
        )}
      </div>

      {/* Canvas Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale((s) => Math.min(2.5, s + 0.1))}
            icon={ZoomIn}
          >
            Zoom In
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale((s) => Math.max(0.3, s - 0.1))}
            icon={ZoomOut}
          >
            Zoom Out
          </Button>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadPreview}
            icon={Download}
          >
            Download Preview
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleBookWithDesign}
            icon={Calendar}
          >
            Book This Design
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TryOnCanvas;
