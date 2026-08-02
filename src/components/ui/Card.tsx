import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  /** Enable a hover lift effect (default: true). */
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-white shadow-md transition-all duration-300 ${
        hover ? 'hover:-translate-y-1 hover:shadow-xl' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
