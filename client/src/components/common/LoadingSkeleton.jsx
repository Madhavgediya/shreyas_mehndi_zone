import React from 'react';

export const LoadingSkeleton = ({ count = 6, type = 'card' }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-parchment-200 overflow-hidden shadow-soft-sm animate-pulse"
        >
          <div className="w-full h-64 bg-parchment-200/80" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-parchment-200 rounded w-1/3" />
            <div className="h-6 bg-parchment-200 rounded w-3/4" />
            <div className="h-4 bg-parchment-200 rounded w-full" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 bg-parchment-200 rounded w-1/4" />
              <div className="h-8 bg-parchment-200 rounded-xl w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
