import React from 'react';
import { ConfidentialityLevel } from '../../types';
import { ShieldCheck, ShieldAlert, Lock, Globe } from 'lucide-react';

interface ConfidentialityBadgeProps {
  level: ConfidentialityLevel;
  size?: 'sm' | 'md';
}

export const ConfidentialityBadge: React.FC<ConfidentialityBadgeProps> = ({
  level,
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (level) {
    case 'public':
      return (
        <span
          id={`confidentiality-badge-${level}`}
          className={`inline-flex items-center font-medium rounded-full bg-blue-950/50 text-blue-300 border border-blue-800/60 ${sizeClasses}`}
        >
          <Globe className="w-3 h-3 mr-1 text-blue-400" />
          Public
        </span>
      );
    case 'internal':
      return (
        <span
          id={`confidentiality-badge-${level}`}
          className={`inline-flex items-center font-medium rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 ${sizeClasses}`}
        >
          <ShieldCheck className="w-3 h-3 mr-1 text-[#DFC07D]" />
          DepEd Internal
        </span>
      );
    case 'restricted':
      return (
        <span
          id={`confidentiality-badge-${level}`}
          className={`inline-flex items-center font-medium rounded-full bg-purple-950/50 text-purple-300 border border-purple-800/60 ${sizeClasses}`}
        >
          <Lock className="w-3 h-3 mr-1 text-purple-400" />
          Restricted Personnel
        </span>
      );
    case 'confidential':
      return (
        <span
          id={`confidentiality-badge-${level}`}
          className={`inline-flex items-center font-medium rounded-full bg-rose-950/50 text-rose-300 border border-rose-800/60 ${sizeClasses}`}
        >
          <ShieldAlert className="w-3 h-3 mr-1 text-rose-400" />
          Strictly Confidential
        </span>
      );
    default:
      return null;
  }
};
