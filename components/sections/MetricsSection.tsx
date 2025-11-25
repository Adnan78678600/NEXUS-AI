import { memo } from 'react';
import { Section, FadeIn } from '../ui';

const METRICS = [
  { label: 'RENDER_THREAD_LOAD', value: 88, color: 'bg-orange-500' },
  { label: 'MEMORY_INTEGRITY', value: 99, color: 'bg-orange-400' },
  { label: 'NETWORK_THROUGHPUT', value: 65, color: 'bg-orange-600' },
] as const;

export const MetricsSection = memo(() => (
  <Section id="specs" ariaLabel="System metrics section">
    <div className="w-full relative z-10 pointer-events-auto">
      <div className="absolute -left-4 md:-left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/0 via-orange-500 to-orange-500/0" aria-hidden="true" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <div>
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 flex items-center gap-4 tracking-tighter">
              SYSTEM <br/> METRICS
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="font-mono text-neutral-400 text-sm leading-relaxed mb-8 border-l-2 border-orange-500 pl-4">
              Real-time monitoring of the Dither-X engine performance. 
              Tracking particle collision, ray-casting efficiency, and memory entropy.
            </p>
          </FadeIn>
          
          <div className="space-y-6 font-mono text-xs" role="list" aria-label="Performance metrics">
            {METRICS.map((item, i) => (
              <FadeIn key={item.label} delay={300 + (i * 100)}>
                <div role="listitem">
                  <div className="flex justify-between text-neutral-500 mb-1">
                    <span id={`metric-${i}`}>{item.label}</span>
                    <span className="text-white" aria-hidden="true">{item.value}%</span>
                  </div>
                  <div 
                    className="w-full h-2 bg-white/10"
                    role="progressbar"
                    aria-valuenow={item.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-labelledby={`metric-${i}`}
                  >
                    <div 
                      className={`h-full ${item.color} transition-all duration-1000 ease-out`} 
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* HUD Circle */}
        <FadeIn delay={400}>
          <div className="relative flex items-center justify-center py-10 md:py-0" aria-hidden="true">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-white/10 flex items-center justify-center relative animate-[spin_10s_linear_infinite]">
              <div className="absolute inset-0 border-t-2 border-orange-500 rounded-full opacity-50" />
            </div>
            <div className="w-48 h-48 md:w-60 md:h-60 rounded-full border border-white/5 absolute flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
              <div className="absolute inset-0 border-b-2 border-white/30 rounded-full" />
            </div>
            
            <div className="absolute text-center">
              <div className="text-[10px] font-mono text-neutral-500 mb-2">CORE CLOCK</div>
              <div className="text-5xl font-bold text-white tracking-tighter">
                4.2<span className="text-lg text-orange-500">GHz</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </Section>
));

MetricsSection.displayName = 'MetricsSection';
