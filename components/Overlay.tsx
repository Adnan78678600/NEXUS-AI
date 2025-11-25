import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Hexagon, Database, Globe, Shield, RefreshCw, ScanLine, Search, ArrowDown } from 'lucide-react';
import { analyzeIdentity, generateTrendForecast } from '../services/gemini';

interface SectionProps {
  children?: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = "" }) => (
  // Changed from min-h-screen to h-screen to force exact page sizing
  // Added w-screen to ensure full width
  <section className={`h-screen w-screen flex flex-col justify-center items-center p-6 md:p-20 relative ${className}`}>
    <div className="w-full max-w-7xl">
      {children}
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// ANIMATION WRAPPER
// -----------------------------------------------------------------------------

interface FadeInProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  className = "", 
  delay = 0, 
  threshold = 0.1 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
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
};

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

const StatCard = ({ label, value, trend }: { label: string, value: string | number, trend?: 'up' | 'down' }) => (
  <div className="flex flex-col border-l border-white/10 pl-4 backdrop-blur-sm">
    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">{label}</span>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold font-mono text-white">{value}</span>
      {trend && (
        <span className={`text-[10px] ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? '▲' : '▼'}
        </span>
      )}
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// MAIN OVERLAY
// -----------------------------------------------------------------------------

const Overlay = () => {
  // -- STATE --
  const [identityInput, setIdentityInput] = useState("");
  const [identityResult, setIdentityResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLog, setTerminalLog] = useState<string[]>([
    "> INITIALIZE_SESSION_V4.0", 
    "> CONNECTED_TO_NEXUS_CORE", 
    "> TYPE 'help' FOR COMMANDS"
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // -- EFFECTS --
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLog]);

  // -- HANDLERS --

  const handleIdentityScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityInput) return;
    setIsScanning(true);
    setIdentityResult(null);
    const result = await analyzeIdentity(identityInput);
    setIdentityResult(result);
    setIsScanning(false);
  };

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!terminalInput.trim()) return;
    
    const cmd = terminalInput.trim().toLowerCase();
    const newLog = [...terminalLog, `> ${terminalInput}`];
    setTerminalInput("");

    // Command Parser
    if (cmd === 'help') {
      newLog.push("AVAILABLE COMMANDS: help, status, clear, scan, contact");
    } else if (cmd === 'status') {
      newLog.push("SYSTEM_STATUS: OPTIMAL // CORE_TEMP: 42C // NODES_ACTIVE: 1024");
    } else if (cmd === 'clear') {
      setTerminalLog(["> CONSOLE_CLEARED"]);
      return;
    } else if (cmd === 'contact') {
      newLog.push("CONTACT_PROTOCOL_INITIATED... EMAIL_SENT_TO_ADMIN");
    } else if (cmd === 'scan') {
      newLog.push("INITIATING_DEEP_SCAN...");
      const trend = await generateTrendForecast();
      newLog.push(`RESULT: ${trend}`);
    } else {
      newLog.push(`ERROR: COMMAND_NOT_FOUND '${cmd}'`);
    }
    setTerminalLog(newLog);
  };

  return (
    <div className="w-full text-neutral-200 selection:bg-white selection:text-black">
      
      {/* PAGE 1: HERO - Added pt-24 for Navbar clearance */}
      <Section className="pt-24 md:pt-32">
        <FadeIn delay={1000} className="absolute top-1/2 left-10 md:left-20 -translate-y-1/2 w-[1px] h-64 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden md:block" />
        
        <div className="w-full relative z-10 pointer-events-none">
          {/* Removed SYSTEM_ONLINE text from here */}
          
          <FadeIn delay={400}>
            {/* Reduced font size to prevent clipping */}
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
                   <button className="px-6 py-2 bg-white text-black font-mono text-xs font-bold hover:bg-green-400 transition-colors">
                     INITIATE_PROTOCOL
                   </button>
                   <button className="px-6 py-2 border border-white/20 text-white font-mono text-xs font-bold hover:bg-white/10 transition-colors">
                     READ_DOCS
                   </button>
                </div>
              </div>

              <div className="font-mono text-[10px] text-neutral-500 space-y-2 border-l border-white/10 pl-6 hidden md:block">
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
        
        <div className="absolute bottom-10 left-0 w-full flex justify-center animate-bounce pointer-events-none opacity-50">
          <ArrowDown className="text-white" size={20} />
        </div>
      </Section>

      {/* PAGE 2: IDENTITY ANALYSIS */}
      <Section className="items-end text-right">
        <div className="w-full pointer-events-none relative z-10">
           <FadeIn className="inline-flex items-center gap-2 font-mono text-xs text-purple-400 mb-6 border border-purple-500/30 px-4 py-1 rounded-full bg-purple-500/5 backdrop-blur-md">
             <ScanLine size={14} /> IDENTITY_SCANNER_V1
           </FadeIn>
           
           <FadeIn delay={200}>
             <h2 className="text-5xl md:text-8xl font-bold mb-8 text-white tracking-tighter leading-none">
               WHO ARE <br/> YOU IN <span className="text-purple-500">THE VOID?</span>
             </h2>
           </FadeIn>
           
           <FadeIn delay={400}>
             <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 ml-auto max-w-xl pointer-events-auto shadow-2xl shadow-purple-900/20 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
               
               <p className="font-mono text-neutral-400 text-xs mb-6 text-left">
                 ENTER_IDENTITY_STRING_FOR_ANALYSIS
               </p>

               <form onSubmit={handleIdentityScan} className="flex gap-2 mb-6">
                 <div className="relative flex-1">
                   <input 
                     type="text" 
                     value={identityInput}
                     onChange={(e) => setIdentityInput(e.target.value)}
                     placeholder="ENTER NAME / ALIAS..."
                     className="w-full bg-neutral-900/80 border border-white/20 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
                   />
                   <Search className="absolute right-3 top-3 text-neutral-500 w-4 h-4" />
                 </div>
                 <button 
                   type="submit"
                   disabled={isScanning}
                   className="bg-purple-600 hover:bg-purple-500 text-white px-6 font-mono text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                 >
                   {isScanning ? <RefreshCw className="animate-spin w-4 h-4" /> : 'SCAN'}
                 </button>
               </form>

               {identityResult && (
                 <div className="text-left border border-purple-500/30 bg-purple-500/5 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <p className="font-mono text-purple-300 text-xs leading-relaxed whitespace-pre-wrap">
                     {identityResult}
                   </p>
                 </div>
               )}
               
               {!identityResult && !isScanning && (
                 <div className="text-left text-neutral-600 font-mono text-[10px]">
                   waiting_for_input...
                 </div>
               )}
             </div>
           </FadeIn>
        </div>
      </Section>

      {/* PAGE 3: BENTO GRID ARCHITECTURE */}
      <Section>
        <div className="w-full z-10">
          <FadeIn>
            <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
               <div>
                  <h3 className="font-mono text-xs text-blue-400 mb-2 tracking-[0.3em]">INFRASTRUCTURE</h3>
                  <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter">NEURAL GRID</h2>
               </div>
               <div className="hidden md:block text-right font-mono text-[10px] text-neutral-500">
                 <div className="mb-1">STATUS: OPERATIONAL</div>
                 <div>LOAD: 42%</div>
               </div>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto pointer-events-auto">
            {/* Large Feature Card */}
            <div className="md:col-span-2 md:row-span-2">
              <FadeIn delay={200} className="h-full">
                <div className="bg-neutral-900/40 border border-white/10 p-8 flex flex-col justify-between group hover:bg-blue-900/10 hover:border-blue-500/30 transition-all duration-500 backdrop-blur-md relative overflow-hidden h-full min-h-[300px]">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Cpu size={48} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center mb-6 text-blue-400">
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
                </div>
              </FadeIn>
            </div>

            {/* Small Interactive Card */}
            <div className="md:col-span-1">
              <FadeIn delay={300} className="h-full">
                <div className="bg-neutral-900/40 border border-white/10 p-6 flex flex-col gap-4 group hover:bg-white/5 transition-all backdrop-blur-md h-full">
                   <div className="flex justify-between items-start">
                     <Globe className="w-6 h-6 text-neutral-400 group-hover:text-blue-400 transition-colors" />
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   </div>
                   <div>
                     <h4 className="text-white font-bold text-sm">Global Mesh</h4>
                     <p className="text-[10px] font-mono text-neutral-500 mt-1">12 Regions</p>
                   </div>
                </div>
              </FadeIn>
            </div>
            
            {/* Small Static Card */}
            <div className="md:col-span-1">
               <FadeIn delay={400} className="h-full">
                <div className="bg-neutral-900/40 border border-white/10 p-6 flex flex-col gap-4 group hover:bg-white/5 transition-all backdrop-blur-md h-full">
                   <Shield className="w-6 h-6 text-neutral-400 group-hover:text-blue-400 transition-colors" />
                   <div>
                     <h4 className="text-white font-bold text-sm">Encryption</h4>
                     <p className="text-[10px] font-mono text-neutral-500 mt-1">AES-4096</p>
                   </div>
                </div>
              </FadeIn>
            </div>

             {/* Wide Data Card */}
            <div className="md:col-span-2">
              <FadeIn delay={500} className="h-full">
                <div className="bg-neutral-900/40 border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between group hover:bg-white/5 transition-all backdrop-blur-md gap-6 h-full">
                   <div className="flex gap-4 items-center w-full">
                     <div className="p-3 bg-white/5 rounded-lg">
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
                       <span>84%</span>
                     </div>
                     <div className="w-full h-1 bg-white/10 overflow-hidden">
                       <div className="h-full w-[84%] bg-blue-500"></div>
                     </div>
                   </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </Section>

      {/* PAGE 4: DATA SPECS DASHBOARD */}
      <Section>
         <div className="w-full relative z-10 pointer-events-auto">
            <div className="absolute -left-4 md:-left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/0 via-orange-500 to-orange-500/0"></div>
            
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
                 
                 <div className="space-y-6 font-mono text-xs">
                    {[
                      { l: 'RENDER_THREAD_LOAD', v: 88, c: 'bg-orange-500' },
                      { l: 'MEMORY_INTEGRITY', v: 99, c: 'bg-orange-400' },
                      { l: 'NETWORK_THROUGHPUT', v: 65, c: 'bg-orange-600' },
                    ].map((item, i) => (
                      <FadeIn key={i} delay={300 + (i * 100)}>
                        <div className="flex justify-between text-neutral-500 mb-1">
                          <span>{item.l}</span>
                          <span className="text-white">{item.v}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10">
                          <div 
                            className={`h-full ${item.c} transition-all duration-1000 ease-out`} 
                            style={{ width: `${item.v}%` }}
                          />
                        </div>
                      </FadeIn>
                    ))}
                 </div>
               </div>

               {/* HUD Circle */}
               <FadeIn delay={400}>
                 <div className="relative flex items-center justify-center py-10 md:py-0">
                   <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-white/10 flex items-center justify-center relative animate-[spin_10s_linear_infinite]">
                      <div className="absolute inset-0 border-t-2 border-orange-500 rounded-full opacity-50"></div>
                   </div>
                   <div className="w-48 h-48 md:w-60 md:h-60 rounded-full border border-white/5 absolute flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                      <div className="absolute inset-0 border-b-2 border-white/30 rounded-full"></div>
                   </div>
                   
                   <div className="absolute text-center">
                     <div className="text-[10px] font-mono text-neutral-500 mb-2">CORE CLOCK</div>
                     <div className="text-5xl font-bold text-white tracking-tighter">4.2<span className="text-lg text-orange-500">GHz</span></div>
                   </div>
                 </div>
               </FadeIn>
            </div>
         </div>
      </Section>

      {/* PAGE 5: TERMINAL / FOOTER */}
      <Section className="justify-end">
        <div className="w-full mb-10 z-10 pointer-events-auto">
           <FadeIn>
             <div className="flex items-center gap-2 mb-4 opacity-50">
                <Terminal size={16} className="text-neutral-400" />
                <span className="font-mono text-xs text-neutral-400">SECURE_SHELL_V2</span>
             </div>
           </FadeIn>

           <FadeIn delay={200}>
             <div className="bg-black/80 border border-neutral-800 rounded-lg overflow-hidden shadow-2xl shadow-green-900/10 backdrop-blur-md">
               <div className="bg-neutral-900/80 px-4 py-2 flex justify-between items-center border-b border-neutral-800">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                 </div>
                 <span className="text-[10px] font-mono text-neutral-600">admin@nexus-core:~</span>
               </div>
               
               <div className="p-6 font-mono text-xs md:text-sm h-60 md:h-80 overflow-y-auto flex flex-col text-neutral-300 scrollbar-hide" onClick={() => document.getElementById('term-input')?.focus()}>
                 {terminalLog.map((line, i) => (
                   <div key={i} className="mb-1 opacity-90 break-words">
                     {line}
                   </div>
                 ))}
                 <div ref={terminalEndRef} />
                 
                 <form onSubmit={handleTerminalSubmit} className="flex gap-2 mt-2 opacity-100 items-center group">
                   <span className="text-green-500 animate-pulse">{'>'}</span>
                   <input 
                     id="term-input"
                     type="text" 
                     value={terminalInput}
                     onChange={(e) => setTerminalInput(e.target.value)}
                     className="bg-transparent border-none outline-none flex-1 text-white focus:ring-0 p-0 w-full"
                     autoComplete="off"
                     autoFocus
                   />
                   <div className="w-2 h-4 bg-green-500/50 animate-pulse hidden group-focus-within:block"></div>
                 </form>
               </div>
             </div>
           </FadeIn>
           
           <FadeIn delay={400}>
             <footer className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8">
               <div className="col-span-2">
                 <div className="flex items-center gap-2 mb-4">
                   <Hexagon className="w-6 h-6 text-white" />
                   <span className="font-bold text-white tracking-widest">NEXUS</span>
                 </div>
                 <p className="font-mono text-[10px] text-neutral-500 max-w-xs">
                   Advancing the frontier of digital interaction.
                 </p>
               </div>
               
               <div>
                 <h4 className="font-mono text-[10px] text-white mb-4">LOCATIONS</h4>
                 <ul className="space-y-2 font-mono text-[10px] text-neutral-500">
                   <li className="hover:text-white cursor-pointer">SAN_FRANCISCO</li>
                   <li className="hover:text-white cursor-pointer">TOKYO</li>
                 </ul>
               </div>

               <div>
                 <h4 className="font-mono text-[10px] text-white mb-4">LEGAL</h4>
                 <ul className="space-y-2 font-mono text-[10px] text-neutral-500">
                   <li className="hover:text-white cursor-pointer">PRIVACY</li>
                   <li className="hover:text-white cursor-pointer">TERMS</li>
                 </ul>
               </div>
             </footer>
           </FadeIn>
           
           <FadeIn delay={600}>
             <div className="mt-8 text-center font-mono text-[9px] text-neutral-700">
               NEXUS_INDUSTRIES © 2025
             </div>
           </FadeIn>
        </div>
      </Section>

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
};

export default Overlay;