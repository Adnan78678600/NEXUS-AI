import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Terminal, Hexagon } from 'lucide-react';
import { Section, FadeIn } from '../ui';
import { generateTrendForecast } from '../../services/gemini';

const INITIAL_LOG = [
  '> INITIALIZE_SESSION_V4.0', 
  '> CONNECTED_TO_NEXUS_CORE', 
  "> TYPE 'help' FOR COMMANDS"
];

export const TerminalSection = memo(() => {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLog, setTerminalLog] = useState<string[]>(INITIAL_LOG);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastCommandTime, setLastCommandTime] = useState(0);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalLog]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setTerminalInput('');
      }
    }
  }, [historyIndex, commandHistory]);

  const handleTerminalSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = terminalInput.trim();
    if (!trimmedInput) return;
    
    // Rate limiting: 1 second cooldown
    const now = Date.now();
    if (now - lastCommandTime < 1000) {
      setTerminalLog(prev => [...prev, '> ERROR: RATE_LIMIT_EXCEEDED']);
      return;
    }
    setLastCommandTime(now);
    
    // Sanitize and limit input
    const sanitizedInput = trimmedInput.slice(0, 200).replace(/[<>]/g, '');
    const cmd = sanitizedInput.toLowerCase();
    
    setCommandHistory(prev => [...prev, sanitizedInput]);
    setHistoryIndex(-1);
    setTerminalInput('');
    
    const newLog = [...terminalLog, `> ${sanitizedInput}`];

    if (cmd === 'help') {
      newLog.push('AVAILABLE COMMANDS: help, status, clear, scan, contact, version, uptime');
    } else if (cmd === 'status') {
      newLog.push('SYSTEM_STATUS: OPTIMAL // CORE_TEMP: 42C // NODES_ACTIVE: 1024');
    } else if (cmd === 'clear') {
      setTerminalLog(['> CONSOLE_CLEARED']);
      return;
    } else if (cmd === 'contact') {
      newLog.push('CONTACT_PROTOCOL_INITIATED... EMAIL_SENT_TO_ADMIN');
    } else if (cmd === 'version') {
      newLog.push('NEXUS_CORE v4.0.2 // BUILD: 2025.11.25 // ENV: PRODUCTION');
    } else if (cmd === 'uptime') {
      newLog.push(`SYSTEM_UPTIME: ${Math.floor(performance.now() / 1000)}s // SESSIONS: 1`);
    } else if (cmd === 'scan') {
      newLog.push('INITIATING_DEEP_SCAN...');
      setTerminalLog(newLog);
      const trend = await generateTrendForecast();
      setTerminalLog(prev => [...prev, `RESULT: ${trend}`]);
      return;
    } else {
      newLog.push(`ERROR: COMMAND_NOT_FOUND '${cmd}'`);
    }
    
    setTerminalLog(newLog);
  }, [terminalInput, terminalLog, lastCommandTime]);

  return (
    <Section id="terminal" ariaLabel="Terminal and footer section" className="justify-end">
      <div className="w-full mb-10 z-10 pointer-events-auto">
        <FadeIn>
          <div className="flex items-center gap-2 mb-4 opacity-50">
            <Terminal size={16} className="text-neutral-400" aria-hidden="true" />
            <span className="font-mono text-xs text-neutral-400">SECURE_SHELL_V2</span>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div 
            className="bg-black/80 border border-neutral-800 rounded-lg overflow-hidden shadow-2xl shadow-green-900/10 backdrop-blur-md"
            role="region"
            aria-label="Interactive terminal"
          >
            <div className="bg-neutral-900/80 px-4 py-2 flex justify-between items-center border-b border-neutral-800">
              <div className="flex gap-2" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <span className="text-[10px] font-mono text-neutral-600">admin@nexus-core:~</span>
            </div>
            
            <div 
              ref={terminalContainerRef}
              className="p-6 font-mono text-xs md:text-sm h-60 md:h-80 overflow-y-auto flex flex-col text-neutral-300 scrollbar-hide cursor-text" 
              onClick={() => inputRef.current?.focus()}
              role="log"
              aria-live="polite"
              aria-atomic="false"
            >
              {terminalLog.map((line, i) => (
                <div key={i} className="mb-1 opacity-90 break-words">
                  {line}
                </div>
              ))}
              
              <form onSubmit={handleTerminalSubmit} className="flex gap-2 mt-2 opacity-100 items-center group">
                <span className="text-green-500 animate-pulse" aria-hidden="true">{'>'}</span>
                <label htmlFor="terminal-input" className="sr-only">Enter terminal command</label>
                <input 
                  ref={inputRef}
                  id="terminal-input"
                  type="text" 
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none flex-1 text-white focus:ring-0 p-0 w-full"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={200}
                  aria-label="Terminal command input"
                />
                <div className="w-2 h-4 bg-green-500/50 animate-pulse" aria-hidden="true" />
              </form>
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={400}>
          <footer className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8" role="contentinfo">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Hexagon className="w-6 h-6 text-white" aria-hidden="true" />
                <span className="font-bold text-white tracking-widest">NEXUS</span>
              </div>
              <p className="font-mono text-[10px] text-neutral-500 max-w-xs">
                Advancing the frontier of digital interaction.
              </p>
            </div>
            
            <nav aria-label="Office locations">
              <h4 className="font-mono text-[10px] text-white mb-4">LOCATIONS</h4>
              <ul className="space-y-2 font-mono text-[10px] text-neutral-500">
                <li><button className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-green-400">SAN_FRANCISCO</button></li>
                <li><button className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-green-400">TOKYO</button></li>
              </ul>
            </nav>

            <nav aria-label="Legal links">
              <h4 className="font-mono text-[10px] text-white mb-4">LEGAL</h4>
              <ul className="space-y-2 font-mono text-[10px] text-neutral-500">
                <li><button className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-green-400">PRIVACY</button></li>
                <li><button className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-green-400">TERMS</button></li>
              </ul>
            </nav>
          </footer>
        </FadeIn>
        
        <FadeIn delay={600}>
          <div className="mt-8 text-center font-mono text-[9px] text-neutral-700">
            NEXUS_INDUSTRIES &copy; {new Date().getFullYear()}
          </div>
        </FadeIn>
      </div>
    </Section>
  );
});

TerminalSection.displayName = 'TerminalSection';
