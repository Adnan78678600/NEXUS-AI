import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FadeIn } from './FadeIn';

describe('FadeIn', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let intersectionCallback: IntersectionObserverCallback | null = null;
  let OriginalIntersectionObserver: typeof IntersectionObserver;

  beforeAll(() => {
    mockObserve = vi.fn();
    mockUnobserve = vi.fn();
    mockDisconnect = vi.fn();
    
    OriginalIntersectionObserver = globalThis.IntersectionObserver;

    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: readonly number[] = [];
      
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }
      
      observe = mockObserve;
      unobserve = mockUnobserve;
      disconnect = mockDisconnect;
      takeRecords = (): IntersectionObserverEntry[] => [];
    }

    globalThis.IntersectionObserver = MockIntersectionObserver;
  });

  afterAll(() => {
    globalThis.IntersectionObserver = OriginalIntersectionObserver;
  });

  it('renders children', () => {
    render(
      <FadeIn>
        <div>Test content</div>
      </FadeIn>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('starts with invisible state', () => {
    render(
      <FadeIn>
        <div>Test content</div>
      </FadeIn>
    );
    const container = screen.getByText('Test content').parentElement;
    expect(container).toHaveClass('opacity-0');
  });

  it('becomes visible when intersecting', async () => {
    render(
      <FadeIn>
        <div>Test content</div>
      </FadeIn>
    );

    const container = screen.getByText('Test content').parentElement;
    
    // Simulate intersection
    if (intersectionCallback) {
      const mockEntry: Partial<IntersectionObserverEntry> = {
        isIntersecting: true,
        target: container!,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      };
      
      intersectionCallback(
        [mockEntry as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    }

    await waitFor(() => {
      expect(container).toHaveClass('opacity-100');
    });
  });

  it('applies custom className', () => {
    render(
      <FadeIn className="custom-class">
        <div>Test content</div>
      </FadeIn>
    );
    const container = screen.getByText('Test content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('applies transition delay', () => {
    render(
      <FadeIn delay={500}>
        <div>Test content</div>
      </FadeIn>
    );
    const container = screen.getByText('Test content').parentElement;
    expect(container).toHaveStyle({ transitionDelay: '500ms' });
  });

  it('observes element on mount', () => {
    render(
      <FadeIn>
        <div>Test content</div>
      </FadeIn>
    );
    expect(mockObserve).toHaveBeenCalled();
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = render(
      <FadeIn>
        <div>Test content</div>
      </FadeIn>
    );
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
