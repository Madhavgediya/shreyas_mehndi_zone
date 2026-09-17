import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Link2, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { uploadApi } from '../../api';
import { toast } from 'react-toastify';

/**
 * Reusable Image Upload Component
 * Allows both direct device upload (Cloudinary/storage) and external URL input
 */
const ImageUpload = ({
  label = 'Image',
  value = '',
  onChange,
  folder = 'designs',
  placeholder = 'https://images.unsplash.com/... or upload a file',
  helpText = 'Supports PNG, JPG, WebP, or SVG up to 10MB',
  isOverlay = false,
  required = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP, SVG)');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    try {
      setUploading(true);
      const res = await uploadApi.uploadImage(file, folder);
      const url = res.data?.url || res.url;
      if (url) {
        onChange(url);
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-espresso-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              mode === 'upload'
                ? 'bg-henna-600 text-white shadow-xs'
                : 'text-espresso-600 hover:text-espresso-900 bg-parchment-100'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              mode === 'url'
                ? 'bg-henna-600 text-white shadow-xs'
                : 'text-espresso-600 hover:text-espresso-900 bg-parchment-100'
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Current Preview or Upload Dropzone */}
      {value ? (
        <div className="relative flex items-center gap-3 p-2.5 rounded-xl border border-parchment-200 bg-parchment-50">
          <div
            className={`relative w-16 h-16 rounded-lg overflow-hidden border border-parchment-200 flex-shrink-0 flex items-center justify-center ${
              isOverlay ? 'bg-radial from-slate-200 to-slate-300' : 'bg-parchment-100'
            }`}
          >
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-espresso-900 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">Image Attached</span>
            </div>
            <p className="text-[11px] text-espresso-600 truncate font-mono">{value}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-[11px] font-semibold text-henna-700 hover:text-henna-900 transition-colors"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="text-[11px] font-medium text-red-600 hover:text-red-800 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : mode === 'upload' ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-henna-500 bg-henna-50/50 scale-[1.01]'
              : 'border-parchment-300 hover:border-henna-400 bg-parchment-50/50 hover:bg-parchment-50'
          } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-2 text-henna-700">
              <Loader2 className="w-6 h-6 animate-spin mb-1.5" />
              <span className="text-xs font-semibold">Uploading image to cloud...</span>
              <span className="text-[10px] text-espresso-600">Please wait a moment</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-1">
              <div className="w-9 h-9 rounded-full bg-henna-100 text-henna-700 flex items-center justify-center mb-1.5 shadow-xs">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-espresso-900">
                Click to browse <span className="font-normal text-espresso-600">or drag & drop</span>
              </p>
              <p className="text-[10px] text-espresso-600 mt-0.5">{helpText}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-espresso-500">
            <Link2 className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-parchment-200 bg-parchment-50 text-espresso-900 focus:outline-hidden focus:ring-1 focus:ring-henna-500"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
