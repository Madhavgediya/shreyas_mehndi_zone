import React from 'react';
import Card from '../common/Card';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  color = 'henna',
}) => {
  return (
    <Card className="p-5 flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-espresso-700">
          {title}
        </span>
        <div className="text-2xl sm:text-3xl font-serif font-bold text-espresso-900">
          {value}
        </div>
        {subtitle && (
          <p className="text-[11px] text-espresso-700">{subtitle}</p>
        )}
      </div>

      <div className="w-12 h-12 rounded-2xl bg-parchment-100 flex items-center justify-center text-henna-700 shadow-soft-sm">
        <Icon className="w-6 h-6" />
      </div>
    </Card>
  );
};

export default StatCard;
