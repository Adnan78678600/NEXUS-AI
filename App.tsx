import { Suspense, useLayoutEffect, memo, useState, useCallback } from 'react';
import DitherScene from './components/DitherScene';
import Navbar from './components/Navbar';
import StaticUI from './components/StaticUI';
import ErrorBoundary from './components/ErrorBoundary';
import { SkipLink } from './components/ui';

const LoadingFallback = memo(() => (
  <div 
    className="absolute inset-0 flex items-center justify-center bg-black text-green-500 font-mono text-xs tracking-widest"
    role="status"
    aria-live="polite"
  >
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 border-2 border-t-transparent border-green-500 rounded-full animate-spin" aria-hidden="true" />
      <span>LOADING_ASSETS...</span>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

function App() {
  const [scrollToSection, setScrollToSection] = useState<((section: number) => void) | null>(null);

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleScrollReady = useCallback((fn: (section: number) => void) => {
    setScrollToSection(() => fn);
  }, []);

  return (
    <div className="w-full h-[100dvh] overflow-hidden bg-black text-white selection:bg-green-500 selection:text-black relative">
      <SkipLink />
      <Navbar scrollToSection={scrollToSection ?? undefined} />
      <StaticUI />
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <DitherScene onScrollReady={handleScrollReady} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
