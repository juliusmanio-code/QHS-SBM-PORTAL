import React from 'react';
import { DegreeOfManifestation } from '../../types';

interface DegreeBadgeProps {
  degree?: DegreeOfManifestation;
  size?: 'sm' | 'md' | 'lg';
}

export const DegreeBadge: React.FC<DegreeBadgeProps> = ({ degree, size = 'md' }) => {
  if (!degree) {
    return (
      <span
        id="degree-badge-none"
        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700"
      >
        Not Evaluated
      </span>
    );
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : size === 'lg'
      ? 'px-3 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-medium';

  switch (degree) {
    case 'Not Yet Manifested':
      return (
        <span
          id="degree-badge-not-yet"
          className={`inline-flex items-center rounded-md bg-rose-950/40 text-rose-300 border border-rose-800/60 ${sizeClasses}`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span>
          Not Yet Manifested
        </span>
      );
    case 'Rarely Manifested':
      return (
        <span
          id="degree-badge-rarely"
          className={`inline-flex items-center rounded-md bg-amber-950/40 text-amber-300 border border-amber-800/60 ${sizeClasses}`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
          Rarely Manifested
        </span>
      );
    case 'Frequently Manifested':
      return (
        <span
          id="degree-badge-frequently"
          className={`inline-flex items-center rounded-md bg-blue-950/40 text-blue-300 border border-blue-800/60 ${sizeClasses}`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 mr-1.5"></span>
          Frequently Manifested
        </span>
      );
    case 'Always Manifested':
      return (
        <span
          id="degree-badge-always"
          className={`inline-flex items-center rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 ${sizeClasses}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
          Always Manifested
        </span>
      );
    default:
      return null;
  }
};
