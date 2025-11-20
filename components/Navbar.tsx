import React, { useState, useEffect } from 'react';
import { Hexagon, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [time, setTime] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: '00_ROOT', id: 'root' },
    { label: '01_ID', id: 'identity' },
    { label: '02_ARCH', id: 'grid' },
    { label: '03_DATA', id: 'specs' },
    { label: '04_TERM', id: 'terminal' }
  ];

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-8 z-[100] flex justify-between items-start text-white mix-blend-difference pointer-events-none">
        
        {/* Logo - Pointer Events Auto to make it clickable */}
        <div className="flex items-center gap-4 pointer-events-auto cursor-pointer group">
           <div className="relative">
             <Hexagon className="w-10 h-10 stroke-1 group-hover:rotate-180 transition-transform duration-1000 ease-in-out text-white" />
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-1 h-1 bg-white rounded-full"></div>
             </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-[0.2em] text-lg leading-none font-mono">NEXUS</span>
            <span className="text-[9px] tracking-[0.6em] opacity-70 mt-1">INDUSTRIES</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex flex-col items-end gap-2 font-mono text-[10px] tracking-widest pointer-events-auto">
           <div className="flex gap-8 border-b border-white/20 pb-2 mb-2">
             {navItems.map((item) => (
               <button 
                 key={item.label} 
                 className="opacity-50 hover:opacity-100 hover:text-green-400 transition-all uppercase relative group"
                 onClick={() => setIsOpen(false)}
               >
                 {item.label}
                 <span className="absolute -bottom-2.5 left-0 w-0 h-[1px] bg-green-400 group-hover:w-full transition-all duration-300"></span>
               </button>
             ))}
           </div>
           <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-2 opacity-60">
               <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
               SERVER_TIME: {time} UTC
             </div>
             <div className="flex items-center gap-2 text-green-400">
               <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
               </span>
               SYSTEM_ONLINE // V.4.0.2
             </div>
           </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden pointer-events-auto text-white opacity-80 hover:opacity-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Fullscreen Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 text-white font-mono tracking-widest md:hidden animate-in fade-in duration-300">
           {navItems.map((item) => (
             <button 
               key={item.label} 
               className="text-2xl opacity-70 hover:opacity-100 hover:text-green-400 transition-colors"
               onClick={() => setIsOpen(false)}
             >
               {item.label}
             </button>
           ))}
           <div className="absolute bottom-10 text-[10px] opacity-50">
             SYSTEM_READY
           </div>
        </div>
      )}
    </>
  );
};

export default Navbar;