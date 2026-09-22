import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  Clock,
  RotateCcw,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  Filter,
  Search,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidentialityBadge } from '../common/ConfidentialityBadge';
import { MovRecord, SubmissionStatus } from '../../types';

interface ReviewApprovalQueueViewProps {
  onReviewMov: (mov: MovRecord) => void;
  onPreviewMov: (mov: MovRecord) => void;
  onUnlockMov: (mov: MovRecord) => void;
  onNavigateToIndicator: (indicatorNumber: number) => void;
}

export const ReviewApprovalQueueView: React.FC<ReviewApprovalQueueViewProps> = ({
  onReviewMov,
  onPreviewMov,
  onUnlockMov,
  onNavigateToIndicator
}) => {
  const { movRecords, dimensions, currentSchoolYear } = useSbmData();
  const { canReviewMov, canApproveMov, isSuperAdmin, isCoordinator, isSchoolHead } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'all_pending' | 'submitted' | 'under_review' | 'needs_revision' | 'verified' | 'approved'
  >('all_pending');

  const [selectedDimension, setSelectedDimension] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const queueItems = useMemo(() => {
    return movRecords.filter((m) => {
      if (m.schoolYearId !== currentSchoolYear.id) return false;
      if (m.isArchived) return false;

      if (selectedDimension !== 'all' && m.dimensionId !== selectedDimension) return false;

      if (activeTab === 'all_pending') {
        if (!['submitted', 'under_review', 'resubmitted', 'needs_revision', 'verified'].includes(m.submissionStatus)) {
          return false;
        }
      } else if (activeTab === 'submitted') {
        if (!['submitted', 'resubmitted'].includes(m.submissionStatus)) return false;
      } else if (m.submissionStatus !== activeTab) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchUploader = m.uploaderName.toLowerCase().includes(q);
        const matchInd = `indicator ${m.indicatorNumber}`.includes(q) || m.indicatorNumber.toString() === q;
        if (!matchTitle && !matchUploader && !matchInd) return false;
      }

      return true;
    });
  }, [movRecords, currentSchoolYear.id, activeTab, selectedDimension, searchQuery]);

  const counts = useMemo(() => {
    const active = movRecords.filter((m) => m.schoolYearId === currentSchoolYear.id && !m.isArchived);
    return {
      all_pending: active.filter((m) =>
        ['submitted', 'under_review', 'resubmitted', 'needs_revision', 'verified'].includes(m.submissionStatus)
      ).length,
      submitted: active.filter((m) => ['submitted', 'resubmitted'].includes(m.submissionStatus)).length,
      under_review: active.filter((m) => m.submissionStatus === 'under_review').length,
      needs_revision: active.filter((m) => m.submissionStatus === 'needs_revision').length,
      verified: active.filter((m) => m.submissionStatus === 'verified').length,
      approved: active.filter((m) => m.submissionStatus === 'approved').length
    };
  }, [movRecords, currentSchoolYear.id]);

  return (
    <div id="review-approval-queue-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-xs">
              Quality Assurance & Workflow
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentSchoolYear.label}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Review & Approval Workflow Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Conduct 6-point verification, assign evaluation ratings, request revisions, and finalize approval.
          </p>
        </div>
      </div>

      {/* Queue Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'all_pending', label: 'All In Review', count: counts.all_pending },
          { id: 'submitted', label: 'Submitted / Resubmitted', count: counts.submitted },
          { id: 'under_review', label: 'Under Review', count: counts.under_review },
          { id: 'needs_revision', label: 'Needs Revision', count: counts.needs_revision },
          { id: 'verified', label: 'Verified (Ready for Head)', count: counts.verified },
          { id: 'approved', label: 'Approved & Locked', count: counts.approved }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="review-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search document title, uploader, or indicator..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            id="review-dimension-filter"
            value={selectedDimension}
            onChange={(e) =>
              setSelectedDimension(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
          >
            <option value="all">All 6 Dimensions</option>
            {dimensions.map((d) => (
              <option key={d.id} value={d.id}>
                Dim {d.id}: {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {queueItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <CheckCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold">No items in this queue category.</p>
            <p className="text-xs text-slate-400">All submissions in this tab are processed.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {queueItems.map((mov) => {
              const canReview = canReviewMov(mov.dimensionId);
              const canApprove = canApproveMov;
              const isSuper = isSuperAdmin || isCoordinator || isSchoolHead;

              return (
                <div
                  key={mov.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onNavigateToIndicator(mov.indicatorNumber)}
                        className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-xs hover:underline"
                      >
                        Indicator {mov.indicatorNumber} (D{mov.dimensionId})
                      </button>
                      <StatusBadge status={mov.submissionStatus} size="sm" />
                      <ConfidentialityBadge level={mov.confidentialityLevel} size="sm" />
                      {mov.isLocked && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium inline-flex items-center">
                          <Lock className="w-3 h-3 mr-1" /> Locked
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {mov.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>File: <strong>{mov.originalFilename} (v{mov.version})</strong></span>
                      <span>•</span>
                      <span>Uploader: <strong>{mov.uploaderName}</strong> ({mov.originatingOffice || 'Faculty'})</span>
                      <span>•</span>
                      <span>Submitted: {new Date(mov.createdAt).toLocaleDateString()}</span>
                    </div>

                    {mov.reviewerComments && (
                      <div className="p-2.5 bg-slate-100 rounded-lg text-xs text-slate-700">
                        <span className="font-semibold text-slate-900">Latest Review Feedback: </span>
                        {mov.reviewerComments}
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => onPreviewMov(mov)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 shadow-2xs"
                    >
                      Preview File
                    </button>

                    {/* Review Button */}
                    {canReview && !mov.isLocked && (
                      <button
                        id={`queue-review-btn-${mov.id}`}
                        onClick={() => onReviewMov(mov)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs flex items-center space-x-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify & Review</span>
                      </button>
                    )}

                    {/* Unlock button for approved records */}
                    {mov.isLocked && isSuper && (
                      <button
                        id={`queue-unlock-btn-${mov.id}`}
                        onClick={() => onUnlockMov(mov)}
                        className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl flex items-center space-x-1"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unlock</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
