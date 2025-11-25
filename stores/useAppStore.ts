import { create } from 'zustand';

interface AppState {
  scrollOffset: number;
  setScrollOffset: (offset: number) => void;
  
  currentSection: number;
  setCurrentSection: (section: number) => void;
  
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  scrollOffset: 0,
  setScrollOffset: (offset) => set({ scrollOffset: offset, currentSection: Math.floor(offset * 5) }),
  
  currentSection: 0,
  setCurrentSection: (section) => set({ currentSection: section }),
  
  isAudioEnabled: false,
  toggleAudio: () => set((state) => ({ isAudioEnabled: !state.isAudioEnabled })),
  
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const NAV_ITEMS = [
  { label: '00_ROOT', id: 'root', section: 0 },
  { label: '01_ID', id: 'identity', section: 1 },
  { label: '02_ARCH', id: 'grid', section: 2 },
  { label: '03_DATA', id: 'specs', section: 3 },
  { label: '04_TERM', id: 'terminal', section: 4 },
] as const;

export const SECTION_COUNT = 5;
