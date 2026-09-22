import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  Search,
  Filter,
  Upload,
  FileText,
  Download,
  Eye,
  History,
  Grid,
  List,
  Tag,
  CheckCircle2,
  Calendar,
  Lock,
  Layers,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidentialityBadge } from '../common/ConfidentialityBadge';
import { ConfidentialityLevel, MovRecord, SubmissionStatus } from '../../types';

interface MovRepositoryViewProps {
  onOpenUpload: () => void;
  onPreviewMov: (mov: MovRecord) => void;
  onReplaceMov: (mov: MovRecord) => void;
  onReviewMov: (mov: MovRecord) => void;
  onNavigateToIndicator: (indicatorNumber: number) => void;
}

export const MovRepositoryView: React.FC<MovRepositoryViewProps> = ({
  onOpenUpload,
  onPreviewMov,
  onReplaceMov,
  onReviewMov,
  onNavigateToIndicator
}) => {
  const { movRecords, dimensions, indicators, currentSchoolYear } = useSbmData();
  const { canAccessConfidential, canReviewMov } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<number | 'all'>('all');
  const [selectedIndicator, setSelectedIndicator] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus | 'all'>('all');
  const [selectedConfidentiality, setSelectedConfidentiality] = useState<
    ConfidentialityLevel | 'all'
  >('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredMovs = useMemo(() => {
    return movRecords.filter((m) => {
      if (m.schoolYearId !== currentSchoolYear.id) return false;
      if (m.isArchived) return false;

      if (selectedDimension !== 'all' && m.dimensionId !== selectedDimension) return false;
      if (selectedIndicator !== 'all' && m.indicatorNumber !== selectedIndicator) return false;
      if (selectedStatus !== 'all' && m.submissionStatus !== selectedStatus) return false;
      if (selectedConfidentiality !== 'all' && m.confidentialityLevel !== selectedConfidentiality)
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchFile = m.originalFilename.toLowerCase().includes(q);
        const matchUploader = m.uploaderName.toLowerCase().includes(q);
        const matchOffice = m.originatingOffice?.toLowerCase().includes(q);
        const matchTag = m.tags?.some((t) => t.toLowerCase().includes(q));
        const matchInd = `indicator ${m.indicatorNumber}`.includes(q) || m.indicatorNumber.toString() === q;
        if (!matchTitle && !matchFile && !matchUploader && !matchOffice && !matchTag && !matchInd)
          return false;
      }

      return true;
    });
  }, [
    movRecords,
    currentSchoolYear.id,
    selectedDimension,
    selectedIndicator,
    selectedStatus,
    selectedConfidentiality,
    searchQuery
  ]);

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(t)) {
      return <ImageIcon className="w-5 h-5 text-amber-500" />;
    }
    if (['xlsx', 'xls', 'csv'].includes(t)) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    }
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div id="mov-repository-view" className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
              Means of Verification Repository
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentSchoolYear.label}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            SBM Evidence & MOV Repository
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized, version-controlled evidence repository for all 42 indicators under DO 007, s. 2024.
          </p>
        </div>

        <button
          id="repository-upload-btn"
          onClick={onOpenUpload}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 flex-shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload MOV Evidence</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              id="repository-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, file, tag, office..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dimension */}
          <div>
            <select
              id="repo-filter-dimension"
              value={selectedDimension}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setSelectedDimension(val);
                setSelectedIndicator('all');
              }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="all">All Dimensions</option>
              {dimensions.map((d) => (
                <option key={d.id} value={d.id}>
                  Dim {d.id}: {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Indicator */}
          <div>
            <select
              id="repo-filter-indicator"
              value={selectedIndicator}
              onChange={(e) =>
                setSelectedIndicator(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="all">All Indicators (1–42)</option>
              {indicators
                .filter((ind) =>
                  selectedDimension === 'all' ? true : ind.dimensionId === selectedDimension
                )
                .map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    Indicator {ind.id}
                  </option>
                ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              id="repo-filter-status"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value === 'all' ? 'all' : (e.target.value as SubmissionStatus))
              }
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="needs_revision">Needs Revision</option>
              <option value="verified">Verified</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          {/* Confidentiality */}
          <div>
            <select
              id="repo-filter-confidentiality"
              value={selectedConfidentiality}
              onChange={(e) =>
                setSelectedConfidentiality(
                  e.target.value === 'all' ? 'all' : (e.target.value as ConfidentialityLevel)
                )
              }
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="all">All Confidentiality</option>
              <option value="public">Public</option>
              <option value="internal">DepEd Internal</option>
              <option value="restricted">Restricted</option>
              <option value="confidential">Strictly Confidential</option>
            </select>
          </div>
        </div>

        {/* View mode toggle & reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-3">
            <span>
              Showing <strong>{filteredMovs.length}</strong> evidence files
            </span>
            {(searchQuery ||
              selectedDimension !== 'all' ||
              selectedIndicator !== 'all' ||
              selectedStatus !== 'all' ||
              selectedConfidentiality !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDimension('all');
                  setSelectedIndicator('all');
                  setSelectedStatus('all');
                  setSelectedConfidentiality('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${
                viewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Files Display */}
      {filteredMovs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FolderArchive className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Means of Verification Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, or upload new evidence files to populate the repository.
          </p>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs"
          >
            Upload MOV Document
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Document Title & File</th>
                  <th className="py-3.5 px-4">Indicator</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Privacy Level</th>
                  <th className="py-3.5 px-4">Office & Uploader</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMovs.map((mov) => {
                  const hasAccess = canAccessConfidential(mov.confidentialityLevel);
                  return (
                    <tr
                      key={mov.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-start space-x-2.5 max-w-xs sm:max-w-sm">
                          <div className="mt-0.5 flex-shrink-0">{getFileIcon(mov.fileType)}</div>
                          <div className="truncate">
                            <button
                              onClick={() => onPreviewMov(mov)}
                              className="font-bold text-slate-900 hover:text-blue-700 text-left truncate block max-w-full"
                            >
                              {mov.title}
                            </button>
                            <div className="text-[11px] text-slate-500 truncate flex items-center space-x-1.5 mt-0.5">
                              <span>{mov.originalFilename}</span>
                              <span>•</span>
                              <span className="font-mono">v{mov.version}</span>
                              <span>•</span>
                              <span>{(mov.fileSize / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onNavigateToIndicator(mov.indicatorNumber)}
                          className="font-semibold text-blue-700 hover:underline inline-flex items-center"
                        >
                          Ind. {mov.indicatorNumber} (D{mov.dimensionId})
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={mov.submissionStatus} size="sm" />
                      </td>

                      <td className="py-3.5 px-4">
                        <ConfidentialityBadge level={mov.confidentialityLevel} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-medium">{mov.originatingOffice || 'Faculty'}</div>
                        <div className="text-[10px] text-slate-500">{mov.uploaderName}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {mov.documentDate || new Date(mov.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            id={`view-mov-table-${mov.id}`}
                            onClick={() => onPreviewMov(mov)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                            title="Preview File & Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!mov.isLocked && (
                            <button
                              id={`replace-mov-table-${mov.id}`}
                              onClick={() => onReplaceMov(mov)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                              title="Upload New Version"
                            >
                              <History className="w-4 h-4" />
                            </button>
                          )}

                          {canReviewMov(mov.dimensionId) && (
                            <button
                              id={`review-mov-table-${mov.id}`}
                              onClick={() => onReviewMov(mov)}
                              className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-md font-semibold text-[11px]"
                              title="Verify & Evaluate"
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMovs.map((mov) => (
            <div
              key={mov.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(mov.fileType)}
                    <span className="font-bold text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                      Ind. {mov.indicatorNumber}
                    </span>
                  </div>
                  <StatusBadge status={mov.submissionStatus} size="sm" />
                </div>

                <h3
                  onClick={() => onPreviewMov(mov)}
                  className="text-sm font-bold text-slate-900 hover:text-blue-700 cursor-pointer line-clamp-2 leading-snug"
                >
                  {mov.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {mov.description || mov.originalFilename}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  <ConfidentialityBadge level={mov.confidentialityLevel} size="sm" />
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                    v{mov.version} • {(mov.fileSize / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">{mov.uploaderName}</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onPreviewMov(mov)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                  >
                    View
                  </button>
                  {canReviewMov(mov.dimensionId) && (
                    <button
                      onClick={() => onReviewMov(mov)}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
