import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Camera, Image as ImageIcon, Sliders, ArrowLeft, RefreshCw } from 'lucide-react';
import { designsApi } from '../api';
import TryOnCanvas from '../components/tryOn/TryOnCanvas';
import DesignSelector from '../components/tryOn/DesignSelector';
import ImageUploader from '../components/tryOn/ImageUploader';
import OverlayControls from '../components/tryOn/OverlayControls';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';

const DEFAULT_HAND_IMAGE =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80';

const DEFAULT_OVERLAY = {
  id: 'mandala-royal',
  title: 'Royal Sunburst Mandala',
  category: 'Mandala',
  overlayUrl: '/overlays/mandala-royal.svg',
  price: 1800,
};

export const TryOn = () => {
  const [searchParams] = useSearchParams();
  const requestedDesignId = searchParams.get('design');

  const [handImage, setHandImage] = useState(DEFAULT_HAND_IMAGE);
  const [selectedDesign, setSelectedDesign] = useState(DEFAULT_OVERLAY);
  const [activeTab, setActiveTab] = useState('design'); // 'design' | 'upload' | 'controls'

  // Canvas Transform State
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.85);
  const [flipH, setFlipH] = useState(false);

  // Undo / Redo history
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = (state) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(state);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setScale(prev.scale);
      setRotation(prev.rotation);
      setOpacity(prev.opacity);
      setFlipH(prev.flipH);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setScale(next.scale);
      setRotation(next.rotation);
      setOpacity(next.opacity);
      setFlipH(next.flipH);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleReset = () => {
    setScale(1.0);
    setRotation(0);
    setOpacity(0.85);
    setFlipH(false);
  };

  // If design ID is passed in URL, load it
  useEffect(() => {
    if (requestedDesignId) {
      const fetchDesign = async () => {
        try {
          const res = await designsApi.getDesigns({ limit: 50 });
          if (res.success && res.data.designs) {
            const match = res.data.designs.find((d) => d._id === requestedDesignId);
            if (match) {
              setSelectedDesign({
                id: match._id,
                title: match.title,
                category: match.category?.name || 'Bridal',
                overlayUrl: match.overlayImage || '/overlays/mandala-royal.svg',
                price: match.price,
                rawDesign: match,
              });
            }
          }
        } catch (err) {
          // Keep default
        }
      };
      fetchDesign();
    }
  }, [requestedDesignId]);

  return (
    <>
      <SEO
        title="Virtual Mehndi Try-On | Preview Henna on Your Hand"
        description="Upload a photo of your hand and preview transparent Mehndi designs with drag, rotate, and scale controls before booking."
      />

      <div className="min-h-screen bg-parchment-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-parchment-200/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/15 border border-accent-400/40 text-henna-800 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-accent-600" />
                <span>Virtual Try-On Studio</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900">
                Preview Mehndi on Your Own Hand
              </h1>
              <p className="text-espresso-700 text-xs sm:text-sm mt-1">
                Upload your hand photo, select any transparent pattern, drag and resize to fit your wrist or palm.
              </p>
            </div>

            <Link to="/gallery">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back to Gallery
              </Button>
            </Link>
          </div>

          {/* Main 2-Column Workstation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Interactive Canvas (Col 7) */}
            <div className="lg:col-span-7 space-y-4">
              <TryOnCanvas
                handImageSrc={handImage}
                overlaySrc={selectedDesign?.overlayUrl}
                selectedDesign={selectedDesign}
                scale={scale}
                setScale={setScale}
                rotation={rotation}
                setRotation={setRotation}
                opacity={opacity}
                setOpacity={setOpacity}
                flipH={flipH}
                setFlipH={setFlipH}
                pushHistory={pushHistory}
              />
            </div>

            {/* Right: Controls & Selector Panels (Col 5) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1 bg-parchment-200/70 p-1 rounded-2xl">
                <button
                  onClick={() => setActiveTab('design')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'design'
                      ? 'bg-white text-espresso-900 shadow-soft-sm'
                      : 'text-espresso-700 hover:text-espresso-900'
                  }`}
                >
                  1. Patterns
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'upload'
                      ? 'bg-white text-espresso-900 shadow-soft-sm'
                      : 'text-espresso-700 hover:text-espresso-900'
                  }`}
                >
                  2. Upload Hand
                </button>
                <button
                  onClick={() => setActiveTab('controls')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'controls'
                      ? 'bg-white text-espresso-900 shadow-soft-sm'
                      : 'text-espresso-700 hover:text-espresso-900'
                  }`}
                >
                  3. Adjust
                </button>
              </div>

              {/* Panel Content based on Active Tab */}
              <div className="bg-white rounded-3xl border border-parchment-200 p-5 shadow-soft-sm">
                {activeTab === 'design' && (
                  <DesignSelector
                    selectedDesign={selectedDesign}
                    onSelectDesign={(d) => {
                      setSelectedDesign(d);
                      setActiveTab('controls');
                    }}
                  />
                )}

                {activeTab === 'upload' && (
                  <ImageUploader
                    onImageSelect={(newImg) => {
                      setHandImage(newImg);
                      setActiveTab('controls');
                    }}
                  />
                )}

                {activeTab === 'controls' && (
                  <OverlayControls
                    scale={scale}
                    setScale={setScale}
                    rotation={rotation}
                    setRotation={setRotation}
                    opacity={opacity}
                    setOpacity={setOpacity}
                    flipH={flipH}
                    setFlipH={setFlipH}
                    onReset={handleReset}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={historyIndex > 0}
                    canRedo={historyIndex < history.length - 1}
                    onRemove={() => setSelectedDesign(null)}
                  />
                )}
              </div>

              {/* Tips & Instructions Box */}
              <div className="p-4 rounded-2xl bg-parchment-100/80 border border-parchment-200 text-xs text-espresso-800 space-y-1.5">
                <p className="font-semibold text-espresso-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent-600" />
                  Stylist Pro-Tip:
                </p>
                <p className="leading-relaxed">
                  For full hands, reduce opacity to ~80% to blend naturally into skin tone highlights. Click and drag the canvas directly to position your pattern!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TryOn;
