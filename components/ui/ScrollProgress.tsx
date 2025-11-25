import { memo } from 'react';
import { useAppStore } from '../../stores/useAppStore';

export const ScrollProgress = memo(() => {
  const scrollOffset = useAppStore((state) => state.scrollOffset);
  
  return (
    <div 
      className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-green-500 via-cyber-green to-green-400 z-[200] transition-all duration-150"
      style={{ width: `${scrollOffset * 100}%` }}
      role="progressbar"
      aria-valuenow={Math.round(scrollOffset * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
});

ScrollProgress.displayName = 'ScrollProgress';
