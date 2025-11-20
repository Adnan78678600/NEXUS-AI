import React, { Suspense, useLayoutEffect } from 'react';
import DitherScene from './components/DitherScene';
import Navbar from './components/Navbar';
import StaticUI from './components/StaticUI';

function App() {
  useLayoutEffect(() => {
    // Prevent browser from restoring scroll position on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Force scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-[100dvh] overflow-hidden bg-black text-white selection:bg-green-500 selection:text-black relative">
      <Navbar />
      <StaticUI />
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black text-green-500 font-mono text-xs tracking-widest">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 border-2 border-t-transparent border-green-500 rounded-full animate-spin"></div>
            LOADING_ASSETS...
          </div>
        </div>
      }>
        <DitherScene />
      </Suspense>
    </div>
  );
}

export default App;