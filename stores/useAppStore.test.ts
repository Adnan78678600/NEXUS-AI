import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, NAV_ITEMS, SECTION_COUNT } from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      scrollOffset: 0,
      currentSection: 0,
      isAudioEnabled: false,
      isMobileMenuOpen: false,
      isLoading: true,
    });
  });

  describe('scrollOffset', () => {
    it('should initialize with 0', () => {
      const { scrollOffset } = useAppStore.getState();
      expect(scrollOffset).toBe(0);
    });

    it('should update scrollOffset and currentSection', () => {
      const { setScrollOffset } = useAppStore.getState();
      setScrollOffset(0.5);
      
      const state = useAppStore.getState();
      expect(state.scrollOffset).toBe(0.5);
      expect(state.currentSection).toBe(2); // Math.floor(0.5 * 5)
    });

    it('should calculate section correctly for different offsets', () => {
      const { setScrollOffset } = useAppStore.getState();
      
      setScrollOffset(0);
      expect(useAppStore.getState().currentSection).toBe(0);
      
      setScrollOffset(0.2);
      expect(useAppStore.getState().currentSection).toBe(1);
      
      setScrollOffset(0.8);
      expect(useAppStore.getState().currentSection).toBe(4);
    });
  });

  describe('currentSection', () => {
    it('should initialize with 0', () => {
      const { currentSection } = useAppStore.getState();
      expect(currentSection).toBe(0);
    });

    it('should set section directly', () => {
      const { setCurrentSection } = useAppStore.getState();
      setCurrentSection(3);
      expect(useAppStore.getState().currentSection).toBe(3);
    });
  });

  describe('audio', () => {
    it('should start with audio disabled', () => {
      const { isAudioEnabled } = useAppStore.getState();
      expect(isAudioEnabled).toBe(false);
    });

    it('should toggle audio state', () => {
      const { toggleAudio } = useAppStore.getState();
      
      toggleAudio();
      expect(useAppStore.getState().isAudioEnabled).toBe(true);
      
      toggleAudio();
      expect(useAppStore.getState().isAudioEnabled).toBe(false);
    });
  });

  describe('mobileMenu', () => {
    it('should start closed', () => {
      const { isMobileMenuOpen } = useAppStore.getState();
      expect(isMobileMenuOpen).toBe(false);
    });

    it('should open and close', () => {
      const { setMobileMenuOpen } = useAppStore.getState();
      
      setMobileMenuOpen(true);
      expect(useAppStore.getState().isMobileMenuOpen).toBe(true);
      
      setMobileMenuOpen(false);
      expect(useAppStore.getState().isMobileMenuOpen).toBe(false);
    });
  });

  describe('loading', () => {
    it('should start loading', () => {
      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(true);
    });

    it('should update loading state', () => {
      const { setLoading } = useAppStore.getState();
      
      setLoading(false);
      expect(useAppStore.getState().isLoading).toBe(false);
    });
  });
});

describe('NAV_ITEMS', () => {
  it('should have 5 navigation items', () => {
    expect(NAV_ITEMS).toHaveLength(5);
  });

  it('should have correct structure', () => {
    NAV_ITEMS.forEach((item, index) => {
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('section');
      expect(item.section).toBe(index);
    });
  });
});

describe('SECTION_COUNT', () => {
  it('should equal 5', () => {
    expect(SECTION_COUNT).toBe(5);
  });

  it('should match NAV_ITEMS length', () => {
    expect(SECTION_COUNT).toBe(NAV_ITEMS.length);
  });
});
