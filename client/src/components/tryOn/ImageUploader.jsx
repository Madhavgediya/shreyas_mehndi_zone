import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import Button from '../common/Button';

const SAMPLE_HANDS = [
  {
    id: 'palm-open',
    name: 'Open Palm',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'back-hand',
    name: 'Back of Hand',
    url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bridal-hands',
    name: 'Both Hands',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageUploader = ({ onImageSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageSelect(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageSelect(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-accent-400/80 hover:border-henna-700 bg-parchment-100/60 hover:bg-parchment-100 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-16 h-16 rounded-full bg-white shadow-soft-sm text-henna-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-serif font-medium text-espresso-900 mb-1">
          Upload a Photo of Your Hand or Arm
        </h3>
        <p className="text-xs text-espresso-700 max-w-sm mb-4">
          Take a clear, well-lit photo of your palm, back of hand, or arm from above. Supports JPG, PNG, WebP.
        </p>
        <Button variant="primary" size="sm" icon={ImageIcon}>
          Browse from Device
        </Button>
      </div>

      {/* Or Select Sample Hand */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent-500" />
          <span className="text-xs font-semibold text-espresso-900 uppercase tracking-wider">
            Or try with a sample model hand:
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {SAMPLE_HANDS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onImageSelect(sample.url)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] border-2 border-transparent hover:border-henna-700 shadow-soft-sm transition-all text-left"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/80 via-transparent to-transparent flex items-end p-2 sm:p-2.5">
                <span className="text-[11px] sm:text-xs font-medium text-white">
                  {sample.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
