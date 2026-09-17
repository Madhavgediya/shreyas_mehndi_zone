import React from 'react';
import { Sparkles } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'Try adjusting your filters or search keywords to explore more designs.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-parchment-200/80 text-henna-700 flex items-center justify-center mb-4 shadow-soft-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-serif font-medium text-espresso-900 mb-2">
        {title}
      </h3>
      <p className="text-espresso-700 text-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
