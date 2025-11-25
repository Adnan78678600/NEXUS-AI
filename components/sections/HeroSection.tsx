import { memo } from 'react';
import { ArrowDown } from 'lucide-react';
import { Section, FadeIn } from '../ui';

export const HeroSection = memo(() => (
  <Section id="hero" ariaLabel="Hero section" className="pt-24 md:pt-32">
    <FadeIn delay={1000} className="absolute top-1/2 left-10 md:left-20 -translate-y-1/2 w-[1px] h-64 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden md:block" />
    
    <div className="w-full relative z-10 pointer-events-none">
      <FadeIn delay={400}>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.85] tracking-tighter mb-12 mix-blend-exclusion text-white">
          DIGITAL <br/>
          <span className="text-transparent stroke-text hover:text-white transition-colors duration-700 cursor-default">ENTROPY</span>
        </h1>
      </FadeIn>
      
      <FadeIn delay={600}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/20 pt-8 backdrop-blur-sm bg-black/10 p-8 rounded-br-3xl">
          <div className="space-y-6">
            <p className="font-mono text-sm md:text-base text-neutral-300 max-w-md leading-loose">
              We architect the invisible layer between human intent and machine execution. 
              Where advanced shading languages meet neural probability fields to generate
              <span className="text-white font-bold"> new realities.</span>
            </p>
            <div className="flex gap-4 pointer-events-auto">
              <button 
                className="px-6 py-2 bg-white text-black font-mono text-xs font-bold hover:bg-green-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Initiate protocol - Start exploring"
              >
                INITIATE_PROTOCOL
              </button>
              <button 
                className="px-6 py-2 border border-white/20 text-white font-mono text-xs font-bold hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Read documentation"
              >
                READ_DOCS
              </button>
            </div>
          </div>

          <div className="font-mono text-[10px] text-neutral-500 space-y-2 border-l border-white/10 pl-6 hidden md:block" aria-hidden="true">
            <div className="flex justify-between"><span>&gt; KERNEL_VERSION</span> <span className="text-white">5.19.0-42-generic</span></div>
            <div className="flex justify-between"><span>&gt; RENDER_BACKEND</span> <span className="text-white">WEBGL2_COMPUTE</span></div>
            <div className="flex justify-between"><span>&gt; NEURAL_LINKS</span> <span className="text-green-500">ESTABLISHED</span></div>
            <div className="mt-4 p-2 bg-black/50 border border-white/5 text-green-400/70 h-20 overflow-hidden">
              // BOOT_SEQ<br/>
              loading_modules... OK<br/>
              mounting_vfs... OK<br/>
              starting_display_mgr... OK<br/>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
    
    <div className="absolute bottom-10 left-0 w-full flex justify-center animate-bounce pointer-events-none opacity-50" aria-hidden="true">
      <ArrowDown className="text-white" size={20} />
    </div>
  </Section>
));

HeroSection.displayName = 'HeroSection';
