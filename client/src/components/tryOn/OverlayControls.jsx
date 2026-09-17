import React from 'react';
import {
  RotateCw,
  Maximize2,
  Sliders,
  FlipHorizontal,
  RotateCcw,
  Undo2,
  Redo2,
  Trash2,
} from 'lucide-react';

export const OverlayControls = ({
  scale,
  setScale,
  rotation,
  setRotation,
  opacity,
  setOpacity,
  flipH,
  setFlipH,
  onReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onRemove,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-parchment-200 p-4 space-y-4 shadow-soft-sm">
      <div className="flex items-center justify-between border-b border-parchment-200 pb-2">
        <h4 className="font-serif text-sm font-semibold text-espresso-900 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-accent-500" />
          <span>Overlay Adjustment</span>
        </h4>

        {/* Undo / Redo / Reset */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-espresso-700 hover:text-espresso-900 hover:bg-parchment-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-espresso-700 hover:text-espresso-900 hover:bg-parchment-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-espresso-700 hover:text-espresso-900 hover:bg-parchment-100"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
              title="Remove overlay"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scale Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-espresso-800">
          <span className="flex items-center gap-1 font-medium">
            <Maximize2 className="w-3.5 h-3.5 text-henna-600" /> Size / Scale
          </span>
          <span className="text-[11px] font-semibold text-henna-700">
            {Math.round(scale * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.3"
          max="2.5"
          step="0.05"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-parchment-200 rounded-lg appearance-none cursor-pointer accent-henna-700"
        />
      </div>

      {/* Rotation Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-espresso-800">
          <span className="flex items-center gap-1 font-medium">
            <RotateCw className="w-3.5 h-3.5 text-henna-600" /> Rotate Angle
          </span>
          <span className="text-[11px] font-semibold text-henna-700">
            {Math.round(rotation)}°
          </span>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          step="2"
          value={rotation}
          onChange={(e) => setRotation(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-parchment-200 rounded-lg appearance-none cursor-pointer accent-henna-700"
        />
      </div>

      {/* Opacity Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-espresso-800">
          <span className="font-medium">Stain Density / Opacity</span>
          <span className="text-[11px] font-semibold text-henna-700">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.25"
          max="1.0"
          step="0.05"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-parchment-200 rounded-lg appearance-none cursor-pointer accent-henna-700"
        />
      </div>

      {/* Flip Horizontal Toggle */}
      <div className="pt-1 flex justify-between items-center">
        <button
          onClick={() => setFlipH(!flipH)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
            flipH
              ? 'bg-henna-100 border-henna-700 text-henna-800 font-semibold'
              : 'border-parchment-200 hover:bg-parchment-100 text-espresso-800'
          }`}
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
          <span>Flip Horizontally</span>
        </button>
      </div>
    </div>
  );
};

export default OverlayControls;
