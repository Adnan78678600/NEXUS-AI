import { useEffect, memo } from 'react';
import { HeroSection, IdentitySection, GridSection, MetricsSection, TerminalSection } from './sections';

const Overlay = memo(() => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full text-neutral-200 selection:bg-white selection:text-black" id="main-content">
      <HeroSection />
      <IdentitySection />
      <GridSection />
      <MetricsSection />
      <TerminalSection />

      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.5);
          color: transparent;
        }
        .stroke-text:hover {
          -webkit-text-stroke: 1px #fff;
        }
        @media (min-width: 768px) {
          .stroke-text {
            -webkit-text-stroke: 2px rgba(255,255,255,0.5);
          }
          .stroke-text:hover {
            -webkit-text-stroke: 2px #fff;
          }
        }
      `}</style>
    </div>
  );
});

Overlay.displayName = 'Overlay';

export default Overlay;
