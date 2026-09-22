import React from 'react';
import {
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  Upload,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Users,
  Award,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DegreeBadge } from '../common/DegreeBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidentialityBadge } from '../common/ConfidentialityBadge';
import { DegreeOfManifestation } from '../../types';

interface SbmDashboardViewProps {
  onNavigateToDimension: (dimensionId: number) => void;
  onNavigateToIndicator: (indicatorNumber: number) => void;
  onNavigateToRepository: () => void;
  onNavigateToAssessment: () => void;
  onNavigateToReviews: () => void;
  onNavigateToReports: () => void;
  onOpenUpload: () => void;
}

export const SbmDashboardView: React.FC<SbmDashboardViewProps> = ({
  onNavigateToDimension,
  onNavigateToIndicator,
  onNavigateToRepository,
  onNavigateToAssessment,
  onNavigateToReviews,
  onNavigateToReports,
  onOpenUpload
}) => {
  const { currentSchoolYear, progressStats, movRecords, reviews, requiredMovItems } = useSbmData();
  const { userProfile, role } = useAuth();

  const recentMovs = movRecords
    .filter((m) => m.schoolYearId === currentSchoolYear.id)
    .slice(0, 5);

  const recentReviews = reviews
    .filter((r) => r.schoolYearId === currentSchoolYear.id)
    .slice(0, 4);

  const criticalMissingItems = requiredMovItems
    .filter((r) => r.schoolYearId === currentSchoolYear.id && r.status === 'missing' && r.isMandatory)
    .slice(0, 5);

  const degreesOrder: DegreeOfManifestation[] = [
    'Always Manifested',
    'Frequently Manifested',
    'Rarely Manifested',
    'Not Yet Manifested'
  ];

  return (
    <div id="sbm-dashboard-view" className="space-y-6">
      {/* Top Banner / Welcome Action */}
      <div className="bg-gradient-to-r from-[#0C301F] via-[#103D28] to-[#072015] rounded-2xl p-6 sm:p-8 text-[#FFFDF9] shadow-xl border border-[#D4AF37]/35 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#D4AF37]/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F0D283] text-xs font-semibold">
            <span>Official Policy DepEd Order No. 007, s. 2024</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#FFFDF9]">
            SBM Performance & Evidence Tracking — {currentSchoolYear.label}
          </h2>
          <p className="text-sm text-[#D1E7DD] leading-relaxed">
            Welcome, <strong className="text-[#FFFDF9]">{userProfile?.displayName}</strong> ({role === 'super_admin' ? 'System Administrator' : role.replace('_', ' ')}). Monitor all 6 SBM dimensions, verify Means of Verification (MOVs), and calibrate official degrees of manifestation.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              id="dashboard-quick-upload-btn"
              onClick={onOpenUpload}
              className="gold-btn px-4 py-2 text-xs rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload MOV Evidence</span>
            </button>
            <button
              id="dashboard-quick-assess-btn"
              onClick={onNavigateToAssessment}
              className="px-4 py-2 bg-[#061B12]/80 hover:bg-[#0E3322] text-[#F0D283] font-semibold text-xs rounded-xl border border-[#D4AF37]/40 transition-colors flex items-center space-x-1.5"
            >
              <span>Assessment Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="dashboard-quick-reports-btn"
              onClick={onNavigateToReports}
              className="px-4 py-2 bg-[#061B12]/80 hover:bg-[#0E3322] text-[#FFFDF9] font-semibold text-xs rounded-xl border border-[#D4AF37]/30 transition-colors flex items-center space-x-1.5"
            >
              <span>Generate SBM Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total & Applicable Indicators */}
        <div className="bg-[#0D2E1F]/90 p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#8FBCA7]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F0D283]">Official Indicators</span>
            <div className="p-2 bg-[#061A11] text-[#F0D283] rounded-lg border border-[#D4AF37]/25">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-[#FFFDF9]">{progressStats.totalIndicators}</span>
            <span className="text-xs text-[#8FBCA7] font-medium">total master list</span>
          </div>
          <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-[#E2F0EA]">
            <span>Applicable: <strong className="text-[#F0D283]">{progressStats.applicableIndicators}</strong></span>
            <span>Non-Applicable: <strong className="text-[#8FBCA7]">{progressStats.nonApplicableIndicators}</strong></span>
          </div>
        </div>

        {/* Overall Evidence Completion */}
        <div className="bg-[#0D2E1F]/90 p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#8FBCA7]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#34D399]">Evidence Completeness</span>
            <div className="p-2 bg-[#061A11] text-emerald-400 rounded-lg border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400">
              {progressStats.overallEvidenceCompletionPct}%
            </span>
            <span className="text-xs text-[#8FBCA7] font-medium">verified/approved</span>
          </div>
          <div className="w-full bg-[#061810] rounded-full h-2 overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-[#D4AF37] to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressStats.overallEvidenceCompletionPct}%` }}
            />
          </div>
        </div>

        {/* Missing Required MOVs */}
        <div className="bg-[#0D2E1F]/90 p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#8FBCA7]">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Missing Required MOVs</span>
            <div className="p-2 bg-[#061A11] text-amber-400 rounded-lg border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400">
              {progressStats.missingRequiredMovs}
            </span>
            <span className="text-xs text-[#8FBCA7] font-medium">of {progressStats.totalRequiredMovs} checklist items</span>
          </div>
          <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-[#E2F0EA]">
            <span>Uploaded: <strong className="text-[#F0D283]">{progressStats.uploadedRequiredMovs}</strong></span>
            <span>Approved: <strong className="text-emerald-400">{progressStats.approvedRequiredMovs}</strong></span>
          </div>
        </div>

        {/* Review Queue Status */}
        <div className="bg-[#0D2E1F]/90 p-5 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#8FBCA7]">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Review Queue</span>
            <div className="p-2 bg-[#061A11] text-purple-400 rounded-lg border border-purple-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-purple-300">
              {progressStats.statusCounts.submitted + progressStats.statusCounts.under_review}
            </span>
            <span className="text-xs text-[#8FBCA7] font-medium">pending verification</span>
          </div>
          <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-[#E2F0EA]">
            <span>Needs Revision: <strong className="text-rose-400">{progressStats.statusCounts.needs_revision}</strong></span>
            <span>Approved: <strong className="text-emerald-400">{progressStats.statusCounts.approved}</strong></span>
          </div>
        </div>
      </div>

      {/* Middle Section: 6 SBM Dimensions Progress & Manifestation Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 6 Dimensions Progress Bars (2 cols) */}
        <div className="lg:col-span-2 bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#FFFDF9]">
                Official Six SBM Dimensions Overview
              </h3>
              <p className="text-xs text-[#8FBCA7]">
                Compliance percentage and missing evidence by dimension for {currentSchoolYear.label}
              </p>
            </div>
            <button
              onClick={() => onNavigateToDimension(1)}
              className="text-xs font-semibold text-[#F0D283] hover:text-[#FFFDF9] flex items-center space-x-1"
            >
              <span>View All Dimensions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {progressStats.dimensionProgress.map((dim) => (
              <div
                key={dim.dimensionId}
                id={`dashboard-dim-progress-${dim.dimensionId}`}
                onClick={() => onNavigateToDimension(dim.dimensionId)}
                className="p-3.5 rounded-xl bg-[#092217]/90 hover:bg-[#123E2A] border border-[#D4AF37]/25 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-[#05160E] text-[#F0D283] font-black text-xs flex items-center justify-center border border-[#D4AF37]/35">
                      D{dim.dimensionId}
                    </span>
                    <span className="text-xs font-bold text-[#FFFDF9] group-hover:text-[#F0D283] transition-colors">
                      {dim.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-[#8FBCA7] font-medium">
                      {dim.completedIndicators}/{dim.totalIndicators} Approved
                    </span>
                    <span className="font-bold text-[#F0D283]">{dim.completionPercentage}%</span>
                  </div>
                </div>

                <div className="w-full bg-[#05160E] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#D4AF37] to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${dim.completionPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2 text-[11px] text-[#8FBCA7]">
                  <span>Applicable: {dim.applicableIndicators}</span>
                  {dim.missingMovsCount > 0 ? (
                    <span className="text-amber-400 font-medium">
                      ⚠️ {dim.missingMovsCount} missing required checklist items
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium">
                      ✓ All required MOVs accounted
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manifestation Distribution & Quick Health (1 col) */}
        <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#FFFDF9]">
              Degrees of Manifestation
            </h3>
            <p className="text-xs text-[#8FBCA7] mt-0.5">
              Official assessment matrix rating breakdown across 42 indicators
            </p>

            <div className="mt-4 space-y-3">
              {degreesOrder.map((degree) => {
                const count = progressStats.degreeDistribution[degree] || 0;
                const pct =
                  progressStats.applicableIndicators > 0
                    ? Math.round((count / progressStats.applicableIndicators) * 100)
                    : 0;

                return (
                  <div key={degree} className="p-3 rounded-xl bg-[#092217]/90 border border-[#D4AF37]/25">
                    <div className="flex items-center justify-between mb-1.5">
                      <DegreeBadge degree={degree} size="sm" />
                      <span className="text-xs font-bold text-[#FFFDF9]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#05160E] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          degree === 'Always Manifested'
                            ? 'bg-emerald-500'
                            : degree === 'Frequently Manifested'
                            ? 'bg-blue-400'
                            : degree === 'Rarely Manifested'
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 bg-[#061A11] rounded-xl border border-[#D4AF37]/30 text-xs text-[#E2F0EA] space-y-1">
            <span className="font-bold flex items-center text-[#F0D283]">
              <ShieldCheck className="w-4 h-4 mr-1 text-[#D4AF37]" />
              Evaluation Guidance
            </span>
            <p className="text-[11px] text-[#8FBCA7] leading-relaxed">
              Evidence completeness is distinct from the degree of manifestation. Reviewers must assign official levels based on authenticated documents.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Evidence Uploads & Critical Missing MOVs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent MOV Uploads */}
        <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#FFFDF9]">
                Recent MOV Evidence Submissions
              </h3>
              <p className="text-xs text-[#8FBCA7]">Latest files registered in SBM repository</p>
            </div>
            <button
              onClick={onNavigateToRepository}
              className="text-xs font-semibold text-[#F0D283] hover:text-[#FFFDF9]"
            >
              View Repository
            </button>
          </div>

          <div className="divide-y divide-[#D4AF37]/15">
            {recentMovs.length === 0 ? (
              <p className="text-xs text-[#8FBCA7] py-6 text-center">No MOVs uploaded yet for this school year.</p>
            ) : (
              recentMovs.map((mov) => (
                <div
                  key={mov.id}
                  onClick={() => onNavigateToIndicator(mov.indicatorNumber)}
                  className="py-3 flex items-start justify-between space-x-3 cursor-pointer hover:bg-[#123E2A] p-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1 truncate">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-3.5 h-3.5 text-[#F0D283] flex-shrink-0" />
                      <span className="text-xs font-bold text-[#FFFDF9] truncate">
                        {mov.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8FBCA7]">
                      Ind. {mov.indicatorNumber} • {mov.uploaderName} • {new Date(mov.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <StatusBadge status={mov.submissionStatus} size="sm" />
                    <ConfidentialityBadge level={mov.confidentialityLevel} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Priority Missing Required MOVs */}
        <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#FFFDF9]">
                Priority Missing Mandatory MOVs
              </h3>
              <p className="text-xs text-[#8FBCA7]">Required compliance items awaiting upload</p>
            </div>
            <button
              onClick={onNavigateToReports}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              Gap Analysis Report
            </button>
          </div>

          <div className="space-y-2.5">
            {criticalMissingItems.length === 0 ? (
              <div className="p-6 text-center bg-[#061A11] rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-emerald-300">All Mandatory Checklist Items Uploaded!</p>
                <p className="text-[11px] text-emerald-400/80">No missing mandatory MOVs detected.</p>
              </div>
            ) : (
              criticalMissingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateToIndicator(item.indicatorNumber)}
                  className="p-3 bg-[#092217]/90 hover:bg-[#123E2A] border border-[#D4AF37]/25 rounded-xl flex items-start justify-between cursor-pointer transition-all shadow-xs"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] border border-amber-500/30">
                        {item.code}
                      </span>
                      <span className="text-xs font-bold text-[#FFFDF9]">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-[#8FBCA7] line-clamp-1">
                      Dimension {item.dimensionId} • Indicator {item.indicatorNumber}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-rose-300 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full flex-shrink-0">
                    Missing
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
