import React, { useState, useRef } from 'react';
import {
  X,
  History,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { MovRecord } from '../../types';
import { useSbmData } from '../../contexts/SbmDataContext';
import { validateMovFile } from '../../lib/storage';

interface ReplaceMovModalProps {
  mov: MovRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReplaceMovModal: React.FC<ReplaceMovModalProps> = ({
  mov,
  isOpen,
  onClose
}) => {
  const { replaceMov } = useSbmData();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [changeReason, setChangeReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isReplacing, setIsReplacing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !mov) return null;

  const handleFileChange = (file: File) => {
    setErrorMsg('');
    const validation = validateMovFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileBase64(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a new version document.');
      return;
    }
    if (!changeReason.trim()) {
      setErrorMsg('Please specify the reason for replacing this document.');
      return;
    }

    setIsReplacing(true);
    setErrorMsg('');

    try {
      const ext = selectedFile.name.split('.').pop()?.toLowerCase() || 'pdf';

      await replaceMov(
        mov.id,
        {
          originalFilename: selectedFile.name,
          fileType: ext,
          mimeType: selectedFile.type || 'application/pdf',
          fileSize: selectedFile.size,
          fileData: fileBase64,
          storagePath: `sbm_movs/${mov.schoolYearId}/ind_${mov.indicatorNumber}/v${mov.version + 1}_${selectedFile.name}`
        },
        changeReason.trim()
      );

      onClose();
    } catch (err: any) {
      setErrorMsg('Replacement failed: ' + (err.message || err));
    } finally {
      setIsReplacing(false);
    }
  };

  return (
    <div
      id="replace-mov-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="replace-mov-modal-container"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Upload New Version (v{mov.version + 1})</h3>
              <p className="text-xs text-slate-300 truncate max-w-xs">{mov.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="text-slate-500 font-medium">Current Version Record:</div>
            <div className="font-bold text-slate-800">{mov.originalFilename} (v{mov.version})</div>
            <div className="text-[11px] text-slate-500">
              Uploaded on {new Date(mov.createdAt).toLocaleDateString()} by {mov.uploaderName}
            </div>
          </div>

          {/* File Picker */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50"
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
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB (Ready to upload)
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Choose revised document</p>
                <p className="text-[10px] text-slate-400">PDF, DOCX, XLSX, etc.</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Revision Reason / Changelog Summary: *
            </label>
            <textarea
              id="replace-reason-input"
              rows={3}
              required
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="e.g. Added signed certification page and updated financial figures..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
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
              id="confirm-replace-version-btn"
              type="submit"
              disabled={isReplacing || !selectedFile}
              className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl shadow-xs"
            >
              {isReplacing ? 'Archiving & Uploading...' : `Submit v${mov.version + 1}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
