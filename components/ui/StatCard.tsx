import { memo } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down';
}

export const StatCard = memo<StatCardProps>(({ label, value, trend }) => (
  <div className="flex flex-col border-l border-white/10 pl-4 backdrop-blur-sm">
    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
      {label}
    </span>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold font-mono text-white">{value}</span>
      {trend && (
        <span 
          className={`text-[10px] ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
          aria-label={trend === 'up' ? 'Trending up' : 'Trending down'}
        >
          {trend === 'up' ? '▲' : '▼'}
        </span>
      )}
    </div>
  </div>
));

StatCard.displayName = 'StatCard';
