import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
  children
}) => {
  if (!isOpen) return null;

  const btnBg =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white'
      : variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white'
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white';

  return (
    <div
      id="confirm-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="confirm-modal-container"
        className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            {variant === 'danger' || variant === 'warning' ? (
              <AlertTriangle className={`w-5 h-5 ${variant === 'danger' ? 'text-rose-600' : 'text-amber-600'}`} />
            ) : null}
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          </div>
          <button
            id="confirm-modal-close-btn"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          {children && <div className="mt-4">{children}</div>}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            id="confirm-modal-cancel-btn"
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            {cancelLabel}
          </button>
          <button
            id="confirm-modal-action-btn"
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 ${btnBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
