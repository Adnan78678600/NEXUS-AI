import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';

const mockToggleAudio = vi.fn();
const mockSetMobileMenuOpen = vi.fn();

vi.mock('../stores/useAppStore', () => ({
  useAppStore: (selector: (state: Record<string, unknown>) => unknown) => {
    const state = {
      currentSection: 0,
      isMobileMenuOpen: false,
      isAudioEnabled: false,
      toggleAudio: mockToggleAudio,
      setMobileMenuOpen: mockSetMobileMenuOpen,
    };
    return typeof selector === 'function' ? selector(state) : state;
  },
  NAV_ITEMS: [
    { label: '00_ROOT', id: 'root', section: 0 },
    { label: '01_ID', id: 'identity', section: 1 },
  ],
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the logo', () => {
    render(<Navbar />);
    expect(screen.getByText('NEXUS')).toBeInTheDocument();
  });

  it('renders navigation items on desktop', () => {
    render(<Navbar />);
    const navItems = screen.getAllByText('00_ROOT');
    expect(navItems.length).toBeGreaterThan(0);
  });

  it('calls scrollToSection when nav item is clicked', () => {
    const mockScrollToSection = vi.fn();
    render(<Navbar scrollToSection={mockScrollToSection} />);
    
    const navItems = screen.getAllByText('00_ROOT');
    fireEvent.click(navItems[0]);
    
    expect(mockScrollToSection).toHaveBeenCalledWith(0);
  });

  it('renders audio toggle button', () => {
    render(<Navbar />);
    const audioButtons = screen.getAllByRole('button');
    expect(audioButtons.length).toBeGreaterThan(0);
  });
});
