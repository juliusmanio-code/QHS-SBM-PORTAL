import React, { useState, useEffect, useMemo } from 'react';
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
  History,
  ExternalLink,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Eye,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Table,
  FileCode,
  Layers,
  Award
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

type PreviewTab = 'document' | 'metadata' | 'review_trail';

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  mov,
  isOpen,
  onClose,
  onReplace
}) => {
  const { userProfile, canAccessConfidential } = useAuth();
  const [activeTab, setActiveTab] = useState<PreviewTab>('document');
  const [isMaximized, setIsMaximized] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Image controls state
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [imageBgDark, setImageBgDark] = useState(false);

  const hasAccess = mov ? canAccessConfidential(mov.confidentialityLevel) : false;

  // File type detection
  const fileExt = mov?.fileType?.toLowerCase() || '';
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(fileExt);
  const isPdf = fileExt === 'pdf' || mov?.mimeType?.toLowerCase().includes('pdf');
  const isCsvOrSpreadsheet = ['csv', 'tsv', 'xlsx', 'xls'].includes(fileExt);
  const isTextOrCode = ['txt', 'csv', 'tsv', 'json', 'log', 'xml', 'md'].includes(fileExt);

  // Convert base64 data to Blob URL for fast native rendering in browser iframe/img
  useEffect(() => {
    if (!mov || !isOpen) {
      setBlobUrl(null);
      setTextContent(null);
      setImageZoom(1);
      setImageRotation(0);
      setActiveTab('document');
      return;
    }

    if (!hasAccess) {
      setBlobUrl(null);
      setTextContent(null);
      return;
    }

    let currentUrl: string | null = null;

    if (mov.fileData) {
      try {
        if (mov.fileData.startsWith('data:')) {
          const parts = mov.fileData.split(';base64,');
          const mimeType = parts[0].replace('data:', '') || mov.mimeType || 'application/octet-stream';
          const base64Data = parts[1];

          // For text or CSV, decode directly
          if (isTextOrCode) {
            try {
              const decoded = atob(base64Data);
              setTextContent(decoded);
            } catch (err) {
              console.warn('Text decoding error:', err);
            }
          }

          // Create binary blob
          const binaryString = atob(base64Data);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: mimeType });
          currentUrl = URL.createObjectURL(blob);
          setBlobUrl(currentUrl);
        } else if (mov.fileData.startsWith('blob:') || mov.fileData.startsWith('http')) {
          setBlobUrl(mov.fileData);
        }
      } catch (err) {
        console.error('Error generating blob URL for preview:', err);
      }
    } else if (mov.fileUrl && (mov.fileUrl.startsWith('http') || mov.fileUrl.startsWith('blob:'))) {
      setBlobUrl(mov.fileUrl);
    }

    return () => {
      if (currentUrl && currentUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [mov?.id, mov?.fileData, isOpen, hasAccess, isTextOrCode]);

  // Parse CSV if available
  const parsedCsv = useMemo(() => {
    if (!textContent || (!fileExt.includes('csv') && !fileExt.includes('tsv'))) return null;
    const delimiter = fileExt.includes('tsv') ? '\t' : ',';
    const lines = textContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return null;
    const headers = lines[0].split(delimiter).map((h) => h.replace(/^["']|["']$/g, '').trim());
    const rows = lines.slice(1, 101).map((line) =>
      line.split(delimiter).map((c) => c.replace(/^["']|["']$/g, '').trim())
    );
    return { headers, rows, totalRows: lines.length - 1 };
  }, [textContent, fileExt]);

  if (!isOpen || !mov) return null;

  const handleDownload = () => {
    if (!hasAccess) {
      alert('Access Denied: You do not have the required role to download this confidential record.');
      return;
    }

    recordAuditEvent(userProfile, 'DOWNLOAD_MOV_FILE', 'MovRecord', mov.id, {
      newValue: `${mov.originalFilename} (Confidentiality: ${mov.confidentialityLevel})`
    });

    if (blobUrl) {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = mov.sanitizedFilename || mov.originalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (mov.fileData) {
      const link = document.createElement('a');
      link.href = mov.fileData;
      link.download = mov.sanitizedFilename || mov.originalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Create a downloadable certified transcript
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

  const handleOpenInNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
    } else if (mov.fileData) {
      const newWin = window.open();
      if (newWin) {
        newWin.document.write(
          `<iframe src="${mov.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      }
    }
  };

  const handleCopyText = () => {
    if (textContent) {
      navigator.clipboard.writeText(textContent);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div
      id="file-preview-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
    >
      <div
        id="file-preview-modal-container"
        className={`bg-[#0A2016] text-[#E2F0EA] rounded-2xl shadow-2xl border border-[#D4AF37]/35 overflow-hidden flex flex-col transition-all duration-300 ${
          isMaximized ? 'w-[98vw] h-[96vh]' : 'max-w-5xl w-full max-h-[92vh] h-[85vh]'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#05160E] border-b border-[#D4AF37]/25 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3 truncate">
            <div className="p-2 rounded-xl bg-[#0D2E1F] text-[#F0D283] border border-[#D4AF37]/35 flex-shrink-0">
              {isImage ? (
                <ImageIcon className="w-5 h-5" />
              ) : isPdf ? (
                <FileText className="w-5 h-5 text-rose-400" />
              ) : isCsvOrSpreadsheet ? (
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              ) : (
                <FileCode className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-[#FFFDF9] truncate">
                  {mov.title}
                </h3>
                <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#123E2A] text-[#F0D283] border border-[#D4AF37]/30">
                  v{mov.version}
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  D{mov.dimensionId} • Ind. {mov.indicatorNumber}
                </span>
              </div>
              <p className="text-[11px] text-[#8FBCA7] truncate mt-0.5">
                {mov.originalFilename} • {(mov.fileSize / 1024).toFixed(1)} KB • Uploaded by {mov.uploaderName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {blobUrl && (
              <button
                type="button"
                onClick={handleOpenInNewTab}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#123E2A] rounded-lg transition-colors flex items-center space-x-1"
                title="Open in new window / tab"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">New Tab</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 text-[#8FBCA7] hover:text-[#FFFDF9] hover:bg-[#123E2A] rounded-lg transition-colors"
              title={isMaximized ? 'Restore normal size' : 'Expand full screen'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              id="close-file-preview-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#8FBCA7] hover:text-white hover:bg-rose-900/40 rounded-lg transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Subheader */}
        <div className="px-5 py-2 bg-[#081F15] border-b border-[#D4AF37]/20 flex items-center justify-between flex-shrink-0 flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              id="preview-tab-document-btn"
              onClick={() => setActiveTab('document')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all font-semibold ${
                activeTab === 'document'
                  ? 'bg-[#123E2A] text-[#F0D283] border border-[#D4AF37]/40 shadow-xs'
                  : 'text-[#8FBCA7] hover:text-[#FFFDF9]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Actual File Preview</span>
            </button>
            <button
              type="button"
              id="preview-tab-metadata-btn"
              onClick={() => setActiveTab('metadata')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all font-semibold ${
                activeTab === 'metadata'
                  ? 'bg-[#123E2A] text-[#F0D283] border border-[#D4AF37]/40 shadow-xs'
                  : 'text-[#8FBCA7] hover:text-[#FFFDF9]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Metadata & Details</span>
            </button>
            <button
              type="button"
              id="preview-tab-review-btn"
              onClick={() => setActiveTab('review_trail')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all font-semibold ${
                activeTab === 'review_trail'
                  ? 'bg-[#123E2A] text-[#F0D283] border border-[#D4AF37]/40 shadow-xs'
                  : 'text-[#8FBCA7] hover:text-[#FFFDF9]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Review & Validation</span>
              {mov.reviewerComments && (
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <StatusBadge status={mov.submissionStatus} size="sm" />
            <ConfidentialityBadge level={mov.confidentialityLevel} size="sm" />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-[#071910] p-3 sm:p-5 flex flex-col">
          {/* Access Warning if user lacks permission for confidential file */}
          {!hasAccess ? (
            <div className="my-auto p-6 bg-rose-950/60 border border-rose-500/40 rounded-2xl max-w-xl mx-auto text-center space-y-3">
              <Lock className="w-12 h-12 text-rose-400 mx-auto" />
              <h4 className="text-base font-bold text-rose-200">
                Confidential Document Access Restricted
              </h4>
              <p className="text-xs text-rose-300 leading-relaxed">
                This document is classified as{' '}
                <strong className="uppercase underline">{mov.confidentialityLevel}</strong> under
                DepEd Child Protection Policy and Data Privacy Act. Your current role does not grant
                clearance to view or download raw incident or personnel files.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-rose-500/30">
                Contact the SBM Coordinator or School Principal for authenticated clearance.
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: ACTUAL FILE PREVIEW */}
              {activeTab === 'document' && (
                <div className="flex-1 flex flex-col min-h-0 space-y-2">
                  {/* File Controls Toolbar (For images / text) */}
                  {(isImage || isTextOrCode) && (
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#0D2E1F] border border-[#D4AF37]/20 rounded-xl text-xs flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        {isImage && (
                          <>
                            <button
                              type="button"
                              onClick={() => setImageZoom((z) => Math.min(z + 0.25, 3))}
                              className="p-1 rounded bg-[#061810] text-[#F0D283] hover:bg-[#123E2A] border border-[#D4AF37]/25"
                              title="Zoom In"
                            >
                              <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono text-[11px] text-[#8FBCA7]">
                              {Math.round(imageZoom * 100)}%
                            </span>
                            <button
                              type="button"
                              onClick={() => setImageZoom((z) => Math.max(z - 0.25, 0.5))}
                              className="p-1 rounded bg-[#061810] text-[#F0D283] hover:bg-[#123E2A] border border-[#D4AF37]/25"
                              title="Zoom Out"
                            >
                              <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setImageZoom(1);
                                setImageRotation(0);
                              }}
                              className="px-2 py-0.5 rounded bg-[#061810] text-[#8FBCA7] hover:text-white text-[11px] border border-[#D4AF37]/25"
                              title="Reset view"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => setImageRotation((r) => (r + 90) % 360)}
                              className="p-1 rounded bg-[#061810] text-[#F0D283] hover:bg-[#123E2A] border border-[#D4AF37]/25 flex items-center space-x-1"
                              title="Rotate 90 degrees"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                              <span className="text-[10px] hidden sm:inline">{imageRotation}°</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setImageBgDark(!imageBgDark)}
                              className="px-2 py-0.5 rounded bg-[#061810] text-[#8FBCA7] hover:text-white text-[11px] border border-[#D4AF37]/25"
                              title="Toggle background tone"
                            >
                              {imageBgDark ? 'Light Backdrop' : 'Dark Backdrop'}
                            </button>
                          </>
                        )}

                        {isTextOrCode && textContent && (
                          <button
                            type="button"
                            onClick={handleCopyText}
                            className="px-2 py-0.5 rounded bg-[#061810] text-[#F0D283] hover:bg-[#123E2A] border border-[#D4AF37]/25 flex items-center space-x-1"
                          >
                            {copiedText ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="text-[11px] text-[#8FBCA7]">
                        Format: <strong className="text-[#FFFDF9] uppercase">{fileExt}</strong> (
                        {mov.mimeType || 'Standard SBM Attachment'})
                      </div>
                    </div>
                  )}

                  {/* Stage Rendering Container */}
                  <div className="flex-1 min-h-[420px] bg-[#05160E] rounded-2xl border border-[#D4AF37]/30 overflow-hidden relative flex flex-col">
                    {/* PDF Rendering */}
                    {isPdf ? (
                      blobUrl ? (
                        <iframe
                          src={`${blobUrl}#toolbar=1&navpanes=1`}
                          title={mov.title}
                          className="w-full flex-1 min-h-[480px] rounded-2xl border-0 bg-slate-800"
                        />
                      ) : (
                        <div className="m-auto p-8 text-center max-w-md space-y-4">
                          <FileText className="w-16 h-16 text-rose-400 mx-auto" />
                          <div>
                            <h4 className="text-base font-bold text-[#FFFDF9]">
                              Official DepEd PDF Document
                            </h4>
                            <p className="text-xs text-[#8FBCA7] mt-1">
                              {mov.title} • {mov.originalFilename}
                            </p>
                          </div>
                          <div className="p-3 bg-[#0D2E1F] rounded-xl border border-[#D4AF37]/20 text-xs text-[#E2F0EA] space-y-1">
                            <span className="font-semibold text-[#F0D283] flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" /> SBM Repository Record Validated
                            </span>
                            <p className="text-[11px] text-[#8FBCA7]">
                              Ready for SDO Quality Audit and Division Field Validation.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleDownload}
                            className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 font-bold text-xs rounded-xl shadow-md inline-flex items-center space-x-1.5"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Full PDF</span>
                          </button>
                        </div>
                      )
                    ) : null}

                    {/* Image Rendering */}
                    {isImage ? (
                      blobUrl || mov.fileData ? (
                        <div
                          className={`flex-1 flex items-center justify-center p-4 overflow-auto ${
                            imageBgDark ? 'bg-black/90' : 'bg-slate-900/60'
                          }`}
                        >
                          <img
                            src={blobUrl || mov.fileData}
                            alt={mov.title}
                            style={{
                              transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                              transition: 'transform 0.2s ease-out'
                            }}
                            className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-xl border border-white/10"
                          />
                        </div>
                      ) : (
                        <div className="m-auto p-6 text-center space-y-2">
                          <ImageIcon className="w-16 h-16 text-[#F0D283] mx-auto" />
                          <h4 className="text-sm font-bold text-white">Image Evidence File</h4>
                          <p className="text-xs text-[#8FBCA7]">{mov.originalFilename}</p>
                        </div>
                      )
                    ) : null}

                    {/* CSV / Tabular Rendering */}
                    {parsedCsv ? (
                      <div className="flex-1 flex flex-col p-4 overflow-hidden">
                        <div className="flex items-center justify-between pb-2 text-xs text-[#8FBCA7]">
                          <span className="flex items-center space-x-1.5">
                            <Table className="w-4 h-4 text-emerald-400" />
                            <strong className="text-white">Structured Spreadsheet Preview</strong>
                            <span>({parsedCsv.totalRows} data rows)</span>
                          </span>
                          <span className="text-[11px]">Displaying first 100 rows</span>
                        </div>
                        <div className="flex-1 overflow-auto border border-[#D4AF37]/25 rounded-xl bg-[#092217]">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-[#0D2E1F] border-b border-[#D4AF37]/30 sticky top-0">
                                <th className="p-2 text-center text-[#8FBCA7] font-mono w-12 border-r border-[#D4AF37]/20">
                                  #
                                </th>
                                {parsedCsv.headers.map((h, i) => (
                                  <th
                                    key={i}
                                    className="p-2.5 font-bold text-[#F0D283] border-r border-[#D4AF37]/20 whitespace-nowrap"
                                  >
                                    {h || `Column ${i + 1}`}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#D4AF37]/15">
                              {parsedCsv.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-[#123E2A]/70">
                                  <td className="p-2 text-center text-[#8FBCA7] font-mono border-r border-[#D4AF37]/15 text-[11px]">
                                    {rIdx + 1}
                                  </td>
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className="p-2.5 text-[#E2F0EA] border-r border-[#D4AF37]/15 whitespace-nowrap"
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}

                    {/* Text / Code Rendering (when not CSV) */}
                    {isTextOrCode && !parsedCsv ? (
                      textContent ? (
                        <div className="flex-1 flex flex-col p-4 overflow-hidden">
                          <div className="flex-1 overflow-auto p-4 bg-[#061810] border border-[#D4AF37]/20 rounded-xl font-mono text-xs text-[#E2F0EA] leading-relaxed whitespace-pre-wrap select-text">
                            {textContent}
                          </div>
                        </div>
                      ) : (
                        <div className="m-auto p-8 text-center max-w-md space-y-3">
                          <FileCode className="w-16 h-16 text-cyan-400 mx-auto" />
                          <h4 className="text-base font-bold text-white">Text / Code Document</h4>
                          <p className="text-xs text-[#8FBCA7]">{mov.originalFilename}</p>
                          <button
                            type="button"
                            onClick={handleDownload}
                            className="px-4 py-2 bg-[#123E2A] text-[#F0D283] border border-[#D4AF37]/40 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Full Text</span>
                          </button>
                        </div>
                      )
                    ) : null}

                    {/* Microsoft Word / Excel / PowerPoint / Other Office formats */}
                    {!isPdf && !isImage && !isTextOrCode && !parsedCsv ? (
                      <div className="m-auto p-8 text-center max-w-lg space-y-4">
                        <div className="w-20 h-20 rounded-2xl bg-[#0D2E1F] border border-[#D4AF37]/35 flex items-center justify-center mx-auto text-[#F0D283] shadow-lg">
                          {isCsvOrSpreadsheet ? (
                            <FileSpreadsheet className="w-10 h-10 text-emerald-400" />
                          ) : (
                            <FileText className="w-10 h-10 text-blue-400" />
                          )}
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white">
                            {mov.title}
                          </h4>
                          <p className="text-xs text-[#8FBCA7] mt-1 font-mono">
                            {mov.originalFilename} • {(mov.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>

                        <div className="p-4 bg-[#092217] rounded-xl border border-[#D4AF37]/20 text-xs text-left space-y-2">
                          <div className="flex items-center justify-between text-[#8FBCA7]">
                            <span>File Type:</span>
                            <strong className="text-[#FFFDF9] uppercase">.{fileExt} Office Document</strong>
                          </div>
                          <div className="flex items-center justify-between text-[#8FBCA7]">
                            <span>Indicator:</span>
                            <span className="text-[#F0D283] font-semibold">
                              Dimension {mov.dimensionId} • Indicator {mov.indicatorNumber}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[#8FBCA7]">
                            <span>Office of Origin:</span>
                            <span className="text-[#FFFDF9]">{mov.originatingOffice || 'Faculty'}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-center space-x-3">
                          <button
                            type="button"
                            onClick={handleDownload}
                            className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 font-bold text-xs rounded-xl shadow-md inline-flex items-center space-x-2 hover:opacity-90"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Document to View</span>
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* TAB 2: METADATA & COMPLIANCE DETAILS */}
              {activeTab === 'metadata' && (
                <div className="space-y-4 max-w-4xl mx-auto w-full">
                  {/* Overview Card */}
                  <div className="p-5 bg-[#0D2E1F] rounded-2xl border border-[#D4AF37]/30 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#F0D283] flex items-center space-x-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Document Description & Narrative</span>
                    </h4>
                    <p className="text-sm text-[#E2F0EA] leading-relaxed">
                      {mov.description || 'No supplementary narrative provided with this submission.'}
                    </p>

                    {mov.tags && mov.tags.length > 0 && (
                      <div className="pt-2 border-t border-[#D4AF37]/20 flex flex-wrap gap-1.5">
                        {mov.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center text-xs bg-[#061810] text-[#F0D283] px-2.5 py-1 rounded-lg border border-[#D4AF37]/30"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div className="p-3.5 bg-[#0D2E1F] rounded-xl border border-[#D4AF37]/25 space-y-1">
                      <span className="text-[11px] text-[#8FBCA7] block font-medium">Uploader Name & Email</span>
                      <strong className="text-xs text-white block">{mov.uploaderName}</strong>
                      <span className="text-[11px] text-[#8FBCA7]">{mov.uploaderEmail}</span>
                    </div>

                    <div className="p-3.5 bg-[#0D2E1F] rounded-xl border border-[#D4AF37]/25 space-y-1">
                      <span className="text-[11px] text-[#8FBCA7] block font-medium">Originating Department / Office</span>
                      <strong className="text-xs text-white block">
                        {mov.originatingOffice || 'Faculty / Academic Department'}
                      </strong>
                      <span className="text-[11px] text-[#8FBCA7]">
                        School Year: {mov.schoolYearId}
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#0D2E1F] rounded-xl border border-[#D4AF37]/25 space-y-1">
                      <span className="text-[11px] text-[#8FBCA7] block font-medium">Document Date & Timeline</span>
                      <strong className="text-xs text-white block">
                        {mov.documentDate || 'Official Academic Calendar'}
                      </strong>
                      <span className="text-[11px] text-[#8FBCA7]">
                        Uploaded: {new Date(mov.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#0D2E1F] rounded-xl border border-[#D4AF37]/25 space-y-1">
                      <span className="text-[11px] text-[#8FBCA7] block font-medium">Version & Integrity</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-[#F0D283] bg-[#061810] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                          Version {mov.version}
                        </span>
                        <span className="text-xs text-[#8FBCA7]">
                          {(mov.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#8FBCA7] truncate block" title={mov.sanitizedFilename}>
                        {mov.sanitizedFilename}
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#0D2E1F] rounded-xl border border-[#D4AF37]/25 space-y-1 sm:col-span-2">
                      <span className="text-[11px] text-[#8FBCA7] block font-medium">SBM Storage Path & Repository URI</span>
                      <span className="font-mono text-[11px] text-[#F0D283] block truncate" title={mov.storagePath}>
                        {mov.storagePath}
                      </span>
                      <span className="text-[10px] text-emerald-400 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified against DepEd SDO QC SBM Matrix
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REVIEW & AUDIT TRAIL */}
              {activeTab === 'review_trail' && (
                <div className="space-y-4 max-w-4xl mx-auto w-full">
                  {/* Quality Verification Feedback */}
                  <div className="p-5 bg-[#0D2E1F] rounded-2xl border border-[#D4AF37]/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#F0D283] flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>SBM Quality Assurance Assessment</span>
                      </h4>
                      <StatusBadge status={mov.submissionStatus} size="sm" />
                    </div>

                    {mov.reviewerComments ? (
                      <div className="p-4 bg-[#092217] rounded-xl border border-[#D4AF37]/25 space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#8FBCA7]">
                          <span className="font-semibold text-white">
                            Reviewer Remarks ({mov.verifiedBy || mov.approvedBy || 'Assigned Dimension Evaluator'}):
                          </span>
                          <span>
                            {mov.verifiedAt ? new Date(mov.verifiedAt).toLocaleDateString() : 'Active Review'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#E2F0EA] leading-relaxed">
                          {mov.reviewerComments}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#8FBCA7] italic p-3 bg-[#061810] rounded-xl border border-[#D4AF37]/20">
                        No reviewer evaluation remarks logged yet. The document is currently in{' '}
                        <strong className="text-white">{mov.submissionStatus.replace('_', ' ')}</strong> status.
                      </p>
                    )}

                    {/* Ratings */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="bg-[#061810] p-3 rounded-xl border border-[#D4AF37]/25 text-center">
                        <span className="text-[11px] text-[#8FBCA7] block">Relevance</span>
                        <span className="text-base font-black text-[#F0D283]">
                          {mov.relevanceRating ? `${mov.relevanceRating} / 5` : '—'}
                        </span>
                      </div>
                      <div className="bg-[#061810] p-3 rounded-xl border border-[#D4AF37]/25 text-center">
                        <span className="text-[11px] text-[#8FBCA7] block">Completeness</span>
                        <span className="text-base font-black text-[#F0D283]">
                          {mov.completenessRating ? `${mov.completenessRating} / 5` : '—'}
                        </span>
                      </div>
                      <div className="bg-[#061810] p-3 rounded-xl border border-[#D4AF37]/25 text-center">
                        <span className="text-[11px] text-[#8FBCA7] block">Authenticity</span>
                        <span className="text-base font-black text-[#F0D283]">
                          {mov.authenticityRating ? `${mov.authenticityRating} / 5` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Governance & DepEd Verification Seal */}
                  <div className="p-4 bg-[#092217] rounded-xl border border-[#D4AF37]/25 flex items-start space-x-3 text-xs text-[#E2F0EA]">
                    <Award className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#F0D283] block">
                        Official SBM Record Governance
                      </span>
                      <p className="text-[11px] text-[#8FBCA7] mt-0.5">
                        This document is officially registered under Quirino High School School-Based Management
                        compliance system for {mov.schoolYearId}. All accesses, version changes, and downloads are
                        logged for SDO Quezon City validation and ISO audit compliance.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#05160E] border-t border-[#D4AF37]/25 flex items-center justify-between flex-shrink-0 flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            {!mov.isLocked && onReplace && hasAccess && (
              <button
                id="replace-version-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onReplace(mov);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-[#F0D283] bg-[#0E3824] border border-[#D4AF37]/40 rounded-xl hover:bg-[#123E2A] transition-colors shadow-xs flex items-center space-x-1.5"
              >
                <History className="w-3.5 h-3.5" />
                <span>Upload New Version</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              id="preview-close-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8FBCA7] bg-[#0D2E1F] border border-[#D4AF37]/30 rounded-xl hover:text-white hover:bg-[#123E2A] transition-colors"
            >
              Close
            </button>
            <button
              id="download-evidence-file-btn"
              type="button"
              onClick={handleDownload}
              disabled={!hasAccess}
              className={`px-4 py-2 text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 transition-all ${
                hasAccess
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 hover:brightness-110 active:scale-95'
                  : 'bg-[#123E2A] text-slate-500 cursor-not-allowed border border-[#D4AF37]/20'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File ({(mov.fileSize / 1024).toFixed(1)} KB)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
