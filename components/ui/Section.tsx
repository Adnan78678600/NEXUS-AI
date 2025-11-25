import { forwardRef } from 'react';

interface SectionProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className = '', id, ariaLabel }, ref) => (
    <section
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      className={`h-screen w-screen flex flex-col justify-center items-center p-6 md:p-20 relative ${className}`}
    >
      <div className="w-full max-w-7xl">{children}</div>
    </section>
  )
);

Section.displayName = 'Section';
