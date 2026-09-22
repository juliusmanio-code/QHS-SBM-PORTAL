import React, { useState } from 'react';
import { X, Unlock, AlertTriangle } from 'lucide-react';
import { MovRecord } from '../../types';
import { useSbmData } from '../../contexts/SbmDataContext';

interface UnlockDialogProps {
  mov: MovRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UnlockDialog: React.FC<UnlockDialogProps> = ({ mov, isOpen, onClose }) => {
  const { unlockMov } = useSbmData();
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !mov) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Mandatory reason for unlocking approved record must be provided for the audit trail.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await unlockMov(mov.id, reason.trim());
      onClose();
    } catch (err: any) {
      setErrorMsg('Unlock failed: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="unlock-dialog-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="unlock-dialog-container"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 bg-amber-500 text-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Unlock className="w-5 h-5" />
            <h3 className="text-sm font-bold">Unlock Approved SBM Record</h3>
          </div>
          <button onClick={onClose} className="text-slate-800 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUnlock} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-xs text-slate-600 leading-relaxed">
            You are unlocking the approved record <strong>"{mov.title}"</strong> (Indicator {mov.indicatorNumber}). This will return it to review status and log a high-priority entry in the system audit trail.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Mandatory Administrative Reason: *
            </label>
            <textarea
              id="unlock-reason-textarea"
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Authorized by Principal to incorporate updated SDO QC validation ratings..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="confirm-unlock-action-btn"
              type="submit"
              disabled={submitting || !reason.trim()}
              className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow-xs"
            >
              {submitting ? 'Unlocking & Logging...' : 'Unlock for Editing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
