import { useRef, useState, useEffect, memo } from 'react';

interface FadeInProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export const FadeIn = memo<FadeInProps>(({ 
  children, 
  className = '', 
  delay = 0, 
  threshold = 0.1 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    
    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
        visible 
          ? 'opacity-100 translate-y-0 scale-100 blur-0' 
          : 'opacity-0 translate-y-12 scale-95 blur-sm'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
});

FadeIn.displayName = 'FadeIn';
