import React, { useState } from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';

export const PrivacyNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      id="privacy-compliance-banner"
      className="bg-[#171510] border-b border-[#C5A059]/30 px-4 py-2.5 text-xs text-[#E0D8C8] flex items-center justify-between transition-all"
    >
      <div className="flex items-center space-x-2.5 max-w-5xl">
        <ShieldAlert className="w-4 h-4 text-[#DFC07D] flex-shrink-0" />
        <div>
          <span className="font-semibold text-[#DFC07D]">Data Privacy & Child Protection Notice (RA 10173 & DO 40, s. 2012): </span>
          <span className="text-zinc-300">
            Means of Verification (MOVs) containing child protection, bullying case statistics, or individual IPCRF records must be redacted and uploaded only as certified statistical summaries. Confidential documents are restricted to authorized school officials.
          </span>
        </div>
      </div>
      <button
        id="dismiss-privacy-banner-btn"
        onClick={() => setDismissed(true)}
        className="text-[#DFC07D] hover:text-white p-1 rounded-md hover:bg-[#C5A059]/20 ml-4 flex-shrink-0 transition-colors"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
