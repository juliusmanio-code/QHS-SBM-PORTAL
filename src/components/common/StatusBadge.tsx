import React from 'react';
import { SubmissionStatus } from '../../types';

interface StatusBadgeProps {
  status: SubmissionStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'draft':
      return (
        <span
          id={`status-badge-${status}`}
          className={`inline-flex items-center font-medium rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mr-1.5"></span>
          Draft
        </span>
      );
    case 'submitted':
      return (
        <span
          id={`status-badge-${status}`}
          className={`inline-flex items-center font-medium rounded-full bg-blue-950/50 text-blue-300 border border-blue-800/60 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5"></span>
          Submitted
        </span>
      );
    case 'under_review':
      return (
        <span
          id={`status-badge-${status}`}
          className={`inline-flex items-center font-medium rounded-full bg-amber-950/50 text-amber-300 border border-amber-800/60 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mr-1.5 animate-pulse"></span>
          Under Review
        </span>
      );
    case 'needs_revision':
      return (
        <span
          id={`status-badge-${status}`}
          className={`inline-flex items-center font-medium rounded-full bg-rose-950/50 text-rose-300 border border-rose-800/60 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5"></span>
          Needs Revision
        </span>
      );
    case 'resubmitted':
      return (
        <span
          id={`status-badge-${status}`}
          className={`inline-flex items-center font-medium rounded-full bg-indigo-950/50 text-indigo-300 border border-indigo-800/60 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5"></span>
          Resubmitted
        </span>
      );
    case 'verified':
      return (
        <span
          id={`status-badge-${status}`}
          className={`inline-flex items-center font-medium rounded-full bg-teal-950/50 text-teal-300 border border-teal-800/60 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mr-1.5"></span>
          Verified
        </span>
      );
    case 'approved':
      return (
        <span
          id={`status-badge-${status}`}
          className={`inline-flex items-center font-medium rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
          Approved
        </span>
      );
    case 'archived':
      return (
        <span
          id={`status-badge-${status}`}
          className={`inline-flex items-center font-medium rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mr-1.5"></span>
          Archived
        </span>
      );
    default:
      return null;
  }
};
