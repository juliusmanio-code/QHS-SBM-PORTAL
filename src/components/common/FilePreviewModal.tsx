import React from 'react';
import { MovRecord } from '../../types';
import {
  X,
  Download,
  FileText,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Calendar,
  User,
  Building,
  Tag,
  Clock,
  History
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ConfidentialityBadge } from './ConfidentialityBadge';
import { useAuth } from '../../contexts/AuthContext';
import { recordAuditEvent } from '../../lib/audit';

interface FilePreviewModalProps {
  mov: MovRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onReplace?: (mov: MovRecord) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  mov,
  isOpen,
  onClose,
  onReplace
}) => {
  const { userProfile, canAccessConfidential } = useAuth();

  if (!isOpen || !mov) return null;

  const hasAccess = canAccessConfidential(mov.confidentialityLevel);

  const handleDownload = () => {
    if (!hasAccess) {
      alert('Access Denied: You do not have the required role to download this confidential record.');
      return;
    }

    recordAuditEvent(userProfile, 'DOWNLOAD_MOV_FILE', 'MovRecord', mov.id, {
      newValue: `${mov.originalFilename} (Confidentiality: ${mov.confidentialityLevel})`
    });

    if (mov.fileData) {
      const link = document.createElement('a');
      link.href = mov.fileData;
      link.download = mov.sanitizedFilename || mov.originalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Create a downloadable mock text report for demonstration
      const blob = new Blob(
        [
          `QUIRINO HIGH SCHOOL — SBM MEANS OF VERIFICATION\n` +
            `====================================================\n` +
            `Document Title: ${mov.title}\n` +
            `School Year: ${mov.schoolYearId}\n` +
            `Dimension: ${mov.dimensionId} | Indicator: ${mov.indicatorNumber}\n` +
            `File: ${mov.originalFilename} (v${mov.version})\n` +
            `Originating Office: ${mov.originatingOffice || 'N/A'}\n` +
            `Uploader: ${mov.uploaderName} (${mov.uploaderEmail})\n` +
            `Submission Status: ${mov.submissionStatus.toUpperCase()}\n` +
            `Confidentiality: ${mov.confidentialityLevel.toUpperCase()}\n` +
            `Verified By: ${mov.verifiedBy || 'N/A'}\n` +
            `Approved By: ${mov.approvedBy || 'N/A'}\n` +
            `Reviewer Remarks: ${mov.reviewerComments || 'None'}\n` +
            `\nOfficial DepEd SDO Quezon City SBM Repository Record\n`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${mov.sanitizedFilename || 'SBM_MOV_Document'}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(mov.fileType.toLowerCase());
  const isPdf = mov.fileType.toLowerCase() === 'pdf';

  return (
    <div
      id="file-preview-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="file-preview-modal-container"
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3 truncate">
            <div className="p-2 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/40">
              {isImage ? (
                <ImageIcon className="w-5 h-5" />
              ) : isPdf ? (
                <FileText className="w-5 h-5" />
              ) : (
                <FileSpreadsheet className="w-5 h-5" />
              )}
            </div>
            <div className="truncate">
              <h3 className="text-base font-semibold text-white truncate">{mov.title}</h3>
              <p className="text-xs text-slate-300">
                {mov.originalFilename} • v{mov.version} • {(mov.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            id="close-file-preview-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Confidentiality Warning if applicable */}
          {!hasAccess ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3">
              <Lock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">Restricted / Confidential Document</h4>
                <p className="text-xs text-rose-700 mt-1">
                  This document has been categorized as <strong>{mov.confidentialityLevel.toUpperCase()}</strong> under DepEd Data Privacy and Child Protection guidelines. Your current role does not grant download access to raw case files.
                </p>
              </div>
            </div>
          ) : null}

          {/* Badges & Status bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={mov.submissionStatus} />
              <ConfidentialityBadge level={mov.confidentialityLevel} />
              {mov.isLocked && (
                <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300">
                  <Lock className="w-3 h-3 mr-1" /> Approved & Locked
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Doc Date: {mov.documentDate || 'Not specified'}</span>
            </div>
          </div>

          {/* Document Preview Stage */}
          <div className="bg-slate-100 rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[220px] text-center">
            {isImage && mov.fileData && hasAccess ? (
              <img
                src={mov.fileData}
                alt={mov.title}
                className="max-h-72 object-contain rounded-lg shadow-sm border border-slate-300"
              />
            ) : isPdf ? (
              <div className="space-y-3">
                <FileText className="w-16 h-16 text-rose-500 mx-auto" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Adobe PDF Document</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Certified Means of Verification Document for SBM Indicator {mov.indicatorNumber}
                  </p>
                </div>
                <div className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> DepEd SDO QC SBM Formats Validated
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <FileSpreadsheet className="w-16 h-16 text-blue-600 mx-auto" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">SBM Evidence File</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Format: {mov.fileType.toUpperCase()} ({mov.mimeType})
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description & Reviewer Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Document Overview</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {mov.description || 'No supplementary narrative provided with this submission.'}
              </p>
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                {mov.tags?.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Review & Validation Notes</h4>
              {mov.reviewerComments ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                  <p className="font-semibold text-slate-900 mb-1">
                    Reviewer Feedback ({mov.verifiedBy || mov.approvedBy || 'Assigned Reviewer'}):
                  </p>
                  <p>{mov.reviewerComments}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No reviewer comments logged yet.</p>
              )}

              {mov.relevanceRating && (
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-slate-500 block">Relevance</span>
                    <span className="font-bold text-slate-800">{mov.relevanceRating}/5</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-slate-500 block">Completeness</span>
                    <span className="font-bold text-slate-800">{mov.completenessRating}/5</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-slate-500 block">Authenticity</span>
                    <span className="font-bold text-slate-800">{mov.authenticityRating}/5</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submission Metadata */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Uploader</span>
              <span className="font-semibold text-slate-800">{mov.uploaderName}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Originating Office</span>
              <span className="font-semibold text-slate-800">{mov.originatingOffice || 'Academic Dept'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Uploaded Date</span>
              <span className="font-semibold text-slate-800">
                {new Date(mov.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Storage Path</span>
              <span className="font-mono text-[10px] text-slate-600 truncate block" title={mov.storagePath}>
                {mov.storagePath}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            {!mov.isLocked && onReplace && (
              <button
                id="replace-version-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onReplace(mov);
                }}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
              >
                <History className="w-3.5 h-3.5 inline mr-1.5" />
                Upload New Version
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="preview-close-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Close
            </button>
            <button
              id="download-evidence-file-btn"
              type="button"
              onClick={handleDownload}
              disabled={!hasAccess}
              className={`px-4 py-2 text-xs font-medium rounded-lg shadow-sm flex items-center ${
                hasAccess
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download MOV Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
