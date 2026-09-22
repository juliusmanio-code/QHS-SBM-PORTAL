import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  ShieldAlert,
  Tag,
  CheckCircle2,
  Calendar,
  Building,
  Lock
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { ConfidentialityLevel } from '../../types';
import { validateMovFile } from '../../lib/storage';

interface UploadMovModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIndicatorNumber?: number;
}

export const UploadMovModal: React.FC<UploadMovModalProps> = ({
  isOpen,
  onClose,
  defaultIndicatorNumber
}) => {
  const { indicators, dimensions, requiredMovItems, currentSchoolYear, uploadMov } = useSbmData();
  const { userProfile } = useAuth();

  const [selectedIndicatorNumber, setSelectedIndicatorNumber] = useState<number>(
    defaultIndicatorNumber || 1
  );
  const [selectedReqItemId, setSelectedReqItemId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [originatingOffice, setOriginatingOffice] = useState('Academic Department');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [confidentialityLevel, setConfidentialityLevel] = useState<ConfidentialityLevel>('internal');
  const [tagsInput, setTagsInput] = useState('SBM, Evidence, 2024-2025');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultIndicatorNumber) {
      setSelectedIndicatorNumber(defaultIndicatorNumber);
    }
  }, [defaultIndicatorNumber]);

  const currentIndicator = indicators.find((i) => i.id === selectedIndicatorNumber);
  const indicatorReqItems = requiredMovItems.filter(
    (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === selectedIndicatorNumber
  );

  const handleFileChange = (file: File) => {
    setErrorMsg('');
    const validation = validateMovFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileBase64(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a Means of Verification (MOV) document to upload.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please provide a document title.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const ext = selectedFile.name.split('.').pop()?.toLowerCase() || 'pdf';
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await uploadMov({
        schoolYearId: currentSchoolYear.id,
        dimensionId: currentIndicator?.dimensionId || 1,
        indicatorNumber: selectedIndicatorNumber,
        requiredMovItemId: selectedReqItemId || undefined,
        title: title.trim(),
        description: description.trim(),
        originalFilename: selectedFile.name,
        fileType: ext,
        mimeType: selectedFile.type || 'application/pdf',
        fileSize: selectedFile.size,
        fileData: fileBase64,
        storagePath: `sbm_movs/${currentSchoolYear.id}/ind_${selectedIndicatorNumber}/${selectedFile.name}`,
        confidentialityLevel,
        originatingOffice: originatingOffice.trim(),
        documentDate,
        tags
      });

      onClose();
    } catch (err: any) {
      setErrorMsg('Upload failed: ' + (err.message || err));
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="upload-mov-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="upload-mov-modal-container"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Upload Means of Verification (MOV)
              </h3>
              <p className="text-xs text-slate-300">
                Register evidence file for {currentSchoolYear.label}
              </p>
            </div>
          </div>
          <button
            id="close-upload-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Target Indicator & Required Checklist Match */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Indicator (1–42):
              </label>
              <select
                id="upload-indicator-select"
                value={selectedIndicatorNumber}
                onChange={(e) => setSelectedIndicatorNumber(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 bg-slate-50 focus:bg-white"
              >
                {indicators.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    Ind. {ind.id}: {ind.officialWording.substring(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Matched Checklist Requirement:
              </label>
              <select
                id="upload-req-item-select"
                value={selectedReqItemId}
                onChange={(e) => setSelectedReqItemId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 bg-slate-50 focus:bg-white"
              >
                <option value="">General Indicator Evidence (Unlinked)</option>
                {indicatorReqItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    [{item.code}] {item.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50/80'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/40'
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png"
              className="hidden"
            />
            {selectedFile ? (
              <div className="space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Click or drop to replace file
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  Click to browse or drag and drop MOV file here
                </p>
                <p className="text-[11px] text-slate-400">
                  Supported formats: PDF, DOCX, XLSX, PPTX, JPG, PNG (Max 25MB)
                </p>
              </div>
            )}
          </div>

          {/* Title & Originating Office */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Document Title: *
              </label>
              <input
                id="upload-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Certified SGC Resolution No. 04-2024"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Originating Office / Committee:
              </label>
              <input
                id="upload-office-input"
                type="text"
                value={originatingOffice}
                onChange={(e) => setOriginatingOffice(e.target.value)}
                placeholder="e.g. School Governance Council / Math Dept"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Document Date & Confidentiality Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Document Date:
              </label>
              <input
                id="upload-date-input"
                type="date"
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Data Privacy & Confidentiality Level:
              </label>
              <select
                id="upload-confidentiality-select"
                value={confidentialityLevel}
                onChange={(e) => setConfidentialityLevel(e.target.value as ConfidentialityLevel)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 bg-slate-50 focus:bg-white"
              >
                <option value="public">Public (Open for Community / Stakeholders)</option>
                <option value="internal">DepEd Internal (Standard Faculty / Staff)</option>
                <option value="restricted">Restricted Personnel (SBM Leads / Admins)</option>
                <option value="confidential">Strictly Confidential (Child Protection / IPCRF)</option>
              </select>
            </div>
          </div>

          {/* Description & Tags */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Evidence Description / Executive Summary:
              </label>
              <textarea
                id="upload-description-input"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly state how this document verifies the indicator criteria..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Search Tags (comma-separated):
              </label>
              <input
                id="upload-tags-input"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. SGC, Minutes, Resolution, 2024"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>DepEd Compliance Check:</strong> Do not upload raw personal learner identifiers. Upload certified sanitized summaries in compliance with RA 10173 and DepEd Child Protection Policy.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              id="cancel-upload-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="confirm-upload-submit-btn"
              type="submit"
              disabled={isUploading || !selectedFile}
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading & Encrypting...' : 'Upload to SBM Repository'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
