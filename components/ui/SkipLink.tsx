import { memo } from 'react';

export const SkipLink = memo(() => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    Skip to main content
  </a>
));

SkipLink.displayName = 'SkipLink';
