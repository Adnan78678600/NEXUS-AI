import { useState, useEffect, useCallback, memo } from 'react';
import { Hexagon, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { useAppStore, NAV_ITEMS } from '../stores/useAppStore';

interface NavbarProps {
  scrollToSection?: (section: number) => void;
}

const Navbar = memo<NavbarProps>(({ scrollToSection }) => {
  const [time, setTime] = useState('');
  const { 
    isMobileMenuOpen, 
    setMobileMenuOpen, 
    currentSection,
    isAudioEnabled,
    toggleAudio 
  } = useAppStore();

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, setMobileMenuOpen]);

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen, setMobileMenuOpen]);

  const handleNavClick = useCallback((section: number) => {
    setMobileMenuOpen(false);
    scrollToSection?.(section);
  }, [scrollToSection, setMobileMenuOpen]);

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav 
        className="fixed top-0 left-0 w-full p-6 md:p-8 z-[100] flex justify-between items-start text-white mix-blend-difference pointer-events-none"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-4 pointer-events-auto cursor-pointer group">
          <div className="relative">
            <Hexagon className="w-10 h-10 stroke-1 group-hover:rotate-180 transition-transform duration-1000 ease-in-out text-white" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" />
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
            {NAV_ITEMS.map((item) => (
              <button 
                key={item.label}
                onClick={() => handleNavClick(item.section)}
                className={`uppercase relative group transition-all focus-visible:outline-none focus-visible:text-green-400 ${
                  currentSection === item.section ? 'opacity-100 text-green-400' : 'opacity-50 hover:opacity-100 hover:text-green-400'
                }`}
                aria-current={currentSection === item.section ? 'page' : undefined}
              >
                {item.label}
                <span className={`absolute -bottom-2.5 left-0 h-[1px] bg-green-400 transition-all duration-300 ${
                  currentSection === item.section ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden="true" />
              <time dateTime={time}>SERVER_TIME: {time} UTC</time>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAudio}
                className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:text-green-400"
                aria-label={isAudioEnabled ? 'Mute audio' : 'Enable audio'}
              >
                {isAudioEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
              </button>
              <div className="flex items-center gap-2 text-green-400">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                SYSTEM_ONLINE // V.4.0.2
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden pointer-events-auto text-white opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded p-1"
          onClick={toggleMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile Fullscreen Menu */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 text-white font-mono tracking-widest md:hidden animate-in fade-in duration-300"
        >
          <nav aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <button 
                key={item.label}
                onClick={() => handleNavClick(item.section)}
                className={`block text-2xl py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded ${
                  currentSection === item.section 
                    ? 'text-green-400 opacity-100' 
                    : 'opacity-70 hover:opacity-100 hover:text-green-400'
                }`}
                aria-current={currentSection === item.section ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded p-2"
            aria-label={isAudioEnabled ? 'Mute audio' : 'Enable audio'}
          >
            {isAudioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isAudioEnabled ? 'AUDIO_ON' : 'AUDIO_OFF'}</span>
          </button>
          
          <div className="absolute bottom-10 text-[10px] opacity-50" aria-hidden="true">
            SYSTEM_READY
          </div>
        </div>
      )}
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
