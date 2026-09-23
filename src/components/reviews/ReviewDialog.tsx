import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  ShieldCheck,
  RotateCcw,
  Lock,
  Star,
  FileText,
  AlertCircle,
  Eye
} from 'lucide-react';
import { MovRecord } from '../../types';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewDialogProps {
  mov: MovRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onPreviewMov?: (mov: MovRecord) => void;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({ mov, isOpen, onClose, onPreviewMov }) => {
  const { verifyMov, requestMovRevision, approveMov } = useSbmData();
  const { canApproveMov, canReviewMov } = useAuth();

  const [checklist, setChecklist] = useState({
    relevance: true,
    completeness: true,
    authenticity: true,
    dates: true,
    signatures: true,
    readability: true
  });

  const [relevanceRating, setRelevanceRating] = useState<number>(5);
  const [completenessRating, setCompletenessRating] = useState<number>(5);
  const [authenticityRating, setAuthenticityRating] = useState<number>(5);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !mov) return null;

  const handleVerify = async () => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      await verifyMov(
        mov.id,
        checklist,
        { relevance: relevanceRating, completeness: completenessRating, authenticity: authenticityRating },
        comments
      );
      onClose();
    } catch (err: any) {
      setErrorMsg('Verification failed: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!comments.trim()) {
      setErrorMsg('Please specify the exact revision requirements or missing elements in the feedback notes.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      await requestMovRevision(mov.id, comments);
      onClose();
    } catch (err: any) {
      setErrorMsg('Revision request failed: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveAndLock = async () => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      await approveMov(mov.id, comments);
      onClose();
    } catch (err: any) {
      setErrorMsg('Approval failed: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="review-dialog-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="review-dialog-container"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                SBM MOV Evidence Review & Quality Verification
              </h3>
              <p className="text-xs text-slate-300">Indicator {mov.indicatorNumber} • {mov.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Document Summary Pill */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-start justify-between gap-3">
            <div className="space-y-0.5 flex-1">
              <span className="text-slate-500 font-medium">Uploader:</span>{' '}
              <strong className="text-slate-800">{mov.uploaderName}</strong> ({mov.uploaderEmail})
              <div className="text-[11px] text-slate-500">
                File: {mov.originalFilename} • v{mov.version} • {(mov.fileSize / 1024).toFixed(1)} KB
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {onPreviewMov && (
                <button
                  type="button"
                  onClick={() => onPreviewMov(mov)}
                  className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-blue-700 font-semibold rounded-lg text-xs flex items-center space-x-1 shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview File</span>
                </button>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {mov.submissionStatus.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* 6-Point Verification Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              6-Point DepEd SBM Evidence Quality Checklist:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: 'relevance', label: '1. Directly Relevant to Indicator Criteria' },
                { key: 'completeness', label: '2. Complete with all required annexes' },
                { key: 'authenticity', label: '3. Authentic & Verifiable Origin' },
                { key: 'dates', label: '4. Document dates match the active School Year' },
                { key: 'signatures', label: '5. Signed & certified by proper authority' },
                { key: 'readability', label: '6. Clear legibility & Child Privacy Redacted' }
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(checklist as any)[item.key]}
                    onChange={(e) =>
                      setChecklist({ ...checklist, [item.key]: e.target.checked })
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quality Rating Sliders */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Evaluation Scoring (1 - 5 Scale):
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Relevance</span>
                  <span className="text-blue-700">{relevanceRating}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={relevanceRating}
                  onChange={(e) => setRelevanceRating(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Completeness</span>
                  <span className="text-blue-700">{completenessRating}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={completenessRating}
                  onChange={(e) => setCompletenessRating(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Authenticity</span>
                  <span className="text-blue-700">{authenticityRating}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={authenticityRating}
                  onChange={(e) => setAuthenticityRating(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Reviewer Comments & Feedback */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Reviewer Notes / Revision Directives:
            </label>
            <textarea
              id="reviewer-feedback-textarea"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="State remarks, validation findings, or specific correction steps for the contributor..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
          >
            Cancel
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="return-for-revision-btn"
              type="button"
              onClick={handleRequestRevision}
              disabled={submitting}
              className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Return for Revision</span>
            </button>

            <button
              id="verify-mov-btn"
              type="button"
              onClick={handleVerify}
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-teal-900 bg-teal-100 hover:bg-teal-200 border border-teal-300 rounded-xl flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Mark as Verified</span>
            </button>

            {canApproveMov && (
              <button
                id="approve-and-lock-mov-btn"
                type="button"
                onClick={handleApproveAndLock}
                disabled={submitting}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm flex items-center space-x-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Approve & Lock Evidence</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
