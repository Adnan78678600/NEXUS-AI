import { useState, memo, useCallback } from 'react';
import { ScanLine, Search, RefreshCw } from 'lucide-react';
import { Section, FadeIn } from '../ui';
import { analyzeIdentity } from '../../services/gemini';

export const IdentitySection = memo(() => {
  const [identityInput, setIdentityInput] = useState('');
  const [identityResult, setIdentityResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);

  const handleIdentityScan = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityInput.trim()) return;
    
    // Rate limiting: 3 second cooldown
    const now = Date.now();
    if (now - lastScanTime < 3000) {
      setIdentityResult('RATE_LIMIT: Please wait before scanning again.');
      return;
    }
    
    setIsScanning(true);
    setIdentityResult(null);
    setLastScanTime(now);
    
    // Sanitize input
    const sanitizedInput = identityInput.trim().slice(0, 100).replace(/[<>]/g, '');
    const result = await analyzeIdentity(sanitizedInput);
    setIdentityResult(result);
    setIsScanning(false);
  }, [identityInput, lastScanTime]);

  return (
    <Section id="identity" ariaLabel="Identity analysis section" className="items-end text-right">
      <div className="w-full pointer-events-none relative z-10">
        <FadeIn className="inline-flex items-center gap-2 font-mono text-xs text-purple-400 mb-6 border border-purple-500/30 px-4 py-1 rounded-full bg-purple-500/5 backdrop-blur-md">
          <ScanLine size={14} aria-hidden="true" /> IDENTITY_SCANNER_V1
        </FadeIn>
        
        <FadeIn delay={200}>
          <h2 className="text-5xl md:text-8xl font-bold mb-8 text-white tracking-tighter leading-none">
            WHO ARE <br/> YOU IN <span className="text-purple-500">THE VOID?</span>
          </h2>
        </FadeIn>
        
        <FadeIn delay={400}>
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 ml-auto max-w-xl pointer-events-auto shadow-2xl shadow-purple-900/20 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            
            <p className="font-mono text-neutral-400 text-xs mb-6 text-left" id="identity-label">
              ENTER_IDENTITY_STRING_FOR_ANALYSIS
            </p>

            <form onSubmit={handleIdentityScan} className="flex gap-2 mb-6" role="search">
              <div className="relative flex-1">
                <label htmlFor="identity-input" className="sr-only">Enter name or alias for identity scan</label>
                <input 
                  id="identity-input"
                  type="text" 
                  value={identityInput}
                  onChange={(e) => setIdentityInput(e.target.value)}
                  placeholder="ENTER NAME / ALIAS..."
                  maxLength={100}
                  className="w-full bg-neutral-900/80 border border-white/20 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500 transition-colors"
                  aria-describedby="identity-label"
                />
                <Search className="absolute right-3 top-3 text-neutral-500 w-4 h-4" aria-hidden="true" />
              </div>
              <button 
                type="submit"
                disabled={isScanning || !identityInput.trim()}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 font-mono text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                aria-busy={isScanning}
              >
                {isScanning ? <RefreshCw className="animate-spin w-4 h-4" aria-label="Scanning" /> : 'SCAN'}
              </button>
            </form>

            <div 
              aria-live="polite" 
              aria-atomic="true"
              className="min-h-[60px]"
            >
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
          </div>
        </FadeIn>
      </div>
    </Section>
  );
});

IdentitySection.displayName = 'IdentitySection';
