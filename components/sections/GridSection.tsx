import { memo } from 'react';
import { Cpu, Globe, Shield, Database } from 'lucide-react';
import { Section, FadeIn, StatCard } from '../ui';

export const GridSection = memo(() => (
  <Section id="grid" ariaLabel="Neural grid architecture section">
    <div className="w-full z-10">
      <FadeIn>
        <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
          <div>
            <h3 className="font-mono text-xs text-blue-400 mb-2 tracking-[0.3em]">INFRASTRUCTURE</h3>
            <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter">NEURAL GRID</h2>
          </div>
          <div className="hidden md:block text-right font-mono text-[10px] text-neutral-500" aria-hidden="true">
            <div className="mb-1">STATUS: OPERATIONAL</div>
            <div>LOAD: 42%</div>
          </div>
        </div>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto pointer-events-auto" role="list" aria-label="Infrastructure components">
        {/* Large Feature Card */}
        <div className="md:col-span-2 md:row-span-2" role="listitem">
          <FadeIn delay={200} className="h-full">
            <article className="bg-neutral-900/40 border border-white/10 p-8 flex flex-col justify-between group hover:bg-blue-900/10 hover:border-blue-500/30 transition-all duration-500 backdrop-blur-md relative overflow-hidden h-full min-h-[300px] focus-within:ring-2 focus-within:ring-blue-500">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                <Cpu size={48} className="text-blue-500" />
              </div>
              <div>
                <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center mb-6 text-blue-400" aria-hidden="true">
                  <Cpu size={18} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Quantum Core</h3>
                <p className="font-mono text-xs text-neutral-400 leading-relaxed max-w-sm">
                  Utilizing sub-atomic rendering states to calculate lighting probability fields. 
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8 border-t border-white/5 pt-6">
                <StatCard label="Q-BITS" value="4096" />
                <StatCard label="COH" value="99%" />
              </div>
            </article>
          </FadeIn>
        </div>

        {/* Small Interactive Card */}
        <div className="md:col-span-1" role="listitem">
          <FadeIn delay={300} className="h-full">
            <article className="bg-neutral-900/40 border border-white/10 p-6 flex flex-col gap-4 group hover:bg-white/5 transition-all backdrop-blur-md h-full">
              <div className="flex justify-between items-start">
                <Globe className="w-6 h-6 text-neutral-400 group-hover:text-blue-400 transition-colors" aria-hidden="true" />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-label="Active status" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Global Mesh</h4>
                <p className="text-[10px] font-mono text-neutral-500 mt-1">12 Regions</p>
              </div>
            </article>
          </FadeIn>
        </div>
        
        {/* Small Static Card */}
        <div className="md:col-span-1" role="listitem">
          <FadeIn delay={400} className="h-full">
            <article className="bg-neutral-900/40 border border-white/10 p-6 flex flex-col gap-4 group hover:bg-white/5 transition-all backdrop-blur-md h-full">
              <Shield className="w-6 h-6 text-neutral-400 group-hover:text-blue-400 transition-colors" aria-hidden="true" />
              <div>
                <h4 className="text-white font-bold text-sm">Encryption</h4>
                <p className="text-[10px] font-mono text-neutral-500 mt-1">AES-4096</p>
              </div>
            </article>
          </FadeIn>
        </div>

        {/* Wide Data Card */}
        <div className="md:col-span-2" role="listitem">
          <FadeIn delay={500} className="h-full">
            <article className="bg-neutral-900/40 border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between group hover:bg-white/5 transition-all backdrop-blur-md gap-6 h-full">
              <div className="flex gap-4 items-center w-full">
                <div className="p-3 bg-white/5 rounded-lg" aria-hidden="true">
                  <Database className="w-6 h-6 text-neutral-300" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Zero-Latency DB</h4>
                  <p className="text-[10px] font-mono text-neutral-400">Direct Memory Access</p>
                </div>
              </div>
              <div className="w-full md:w-48 flex flex-col gap-1">
                <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                  <span>BUFFER</span>
                  <span aria-label="84 percent">84%</span>
                </div>
                <div className="w-full h-1 bg-white/10 overflow-hidden" role="progressbar" aria-valuenow={84} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full w-[84%] bg-blue-500" />
                </div>
              </div>
            </article>
          </FadeIn>
        </div>
      </div>
    </div>
  </Section>
));

GridSection.displayName = 'GridSection';
