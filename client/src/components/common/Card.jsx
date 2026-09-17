import React from 'react';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-parchment-200/80 shadow-soft-sm transition-all duration-300 ${
        hover ? 'hover:shadow-soft-md hover:border-accent-400/40 hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
