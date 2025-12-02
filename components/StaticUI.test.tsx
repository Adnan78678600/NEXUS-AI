import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import StaticUI from './StaticUI';

vi.mock('../stores/useAppStore', () => ({
  useAppStore: (selector: (state: Record<string, unknown>) => unknown) => {
    const state = {
      currentSection: 0,
    };
    return typeof selector === 'function' ? selector(state) : state;
  },
  SECTION_COUNT: 5,
}));

describe('StaticUI', () => {
  it('renders corner decorations', () => {
    const { container } = render(<StaticUI />);
    const cornerElements = container.querySelectorAll('.fixed');
    expect(cornerElements.length).toBe(4);
  });

  it('renders without crashing', () => {
    const { container } = render(<StaticUI />);
    expect(container.firstChild).toBeTruthy();
  });
});
