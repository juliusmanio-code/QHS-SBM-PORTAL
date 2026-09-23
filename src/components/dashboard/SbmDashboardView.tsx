import React, { useState } from 'react';
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
  AlertCircle,
  Edit3,
  Megaphone,
  Compass,
  Columns,
  BarChart2,
  Eye
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DegreeBadge } from '../common/DegreeBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidentialityBadge } from '../common/ConfidentialityBadge';
import { DegreeOfManifestation, DashboardBannerConfig, MovRecord } from '../../types';
import { BannerEditorModal } from './BannerEditorModal';
import { DimensionRadarChart } from './DimensionRadarChart';

interface SbmDashboardViewProps {
  onNavigateToDimension: (dimensionId: number) => void;
  onNavigateToIndicator: (indicatorNumber: number) => void;
  onNavigateToRepository: () => void;
  onNavigateToAssessment: () => void;
  onNavigateToReviews: () => void;
  onNavigateToReports: () => void;
  onOpenUpload: () => void;
  onPreviewMov?: (mov: MovRecord) => void;
}

export const SbmDashboardView: React.FC<SbmDashboardViewProps> = ({
  onNavigateToDimension,
  onNavigateToIndicator,
  onNavigateToRepository,
  onNavigateToAssessment,
  onNavigateToReviews,
  onNavigateToReports,
  onOpenUpload,
  onPreviewMov
}) => {
  const { currentSchoolYear, progressStats, movRecords, reviews, requiredMovItems, schoolProfile, updateSchoolProfile } = useSbmData();
  const { userProfile, role } = useAuth();
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [dimensionDisplayMode, setDimensionDisplayMode] = useState<'split' | 'radar' | 'bars'>('split');

  // Check if role is authorized to edit dashboard banner
  const canEditBanner = role === 'super_admin' || role === 'school_head' || role === 'sbm_coordinator';

  // Resolved banner config with sensible fallbacks
  const bannerConfig: DashboardBannerConfig = schoolProfile?.dashboardBanner || {
    badgeText: 'Official Policy DepEd Order No. 007, s. 2024',
    title: 'SBM Performance & Evidence Tracking — {SY}',
    description: 'Monitor all 6 SBM dimensions, verify Means of Verification (MOVs), and calibrate official degrees of manifestation.',
    showAnnouncement: false,
    theme: 'emerald_gold',
    quickUploadVisible: true,
    quickAssessVisible: true,
    quickReportsVisible: true
  };

  const bannerTitle = (bannerConfig.title || 'SBM Performance & Evidence Tracking — {SY}').replace(
    '{SY}',
    currentSchoolYear.label
  );

  const getThemeClasses = (theme?: string) => {
    switch (theme) {
      case 'forest_classic':
        return 'bg-gradient-to-r from-[#072316] via-[#0D3823] to-[#05180F] border-emerald-500/40';
      case 'midnight_jade':
        return 'bg-gradient-to-r from-[#041B1B] via-[#0A2E2C] to-[#031313] border-teal-500/40';
      case 'royal_pine':
        return 'bg-gradient-to-r from-[#092217] via-[#133F2C] to-[#061910] border-amber-500/45';
      case 'emerald_gold':
      default:
        return 'bg-gradient-to-r from-[#0C301F] via-[#103D28] to-[#072015] border-[#D4AF37]/35';
    }
  };

  const handleSaveBanner = async (newConfig: DashboardBannerConfig) => {
    await updateSchoolProfile({
      dashboardBanner: newConfig
    });
  };

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
      <div className={`rounded-2xl p-6 sm:p-8 text-[#FFFDF9] shadow-xl border relative overflow-hidden transition-all ${getThemeClasses(bannerConfig.theme)}`}>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#D4AF37]/5 transform skew-x-12 pointer-events-none" />
        
        {/* Edit Banner Button (for Super Admin, School Head, SBM Coordinator) */}
        {canEditBanner && (
          <button
            id="edit-dashboard-banner-btn"
            type="button"
            onClick={() => setIsEditingBanner(true)}
            className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-[#061810]/80 hover:bg-[#0E3322] border border-[#D4AF37]/40 text-[#F0D283] hover:text-[#FFFDF9] text-xs font-semibold flex items-center space-x-1.5 backdrop-blur-xs transition-all shadow-md hover:scale-105"
            title="Customize Dashboard Banner"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Banner</span>
          </button>
        )}

        <div className="relative z-10 max-w-3xl space-y-3">
          {bannerConfig.badgeText && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F0D283] text-xs font-semibold">
              <span>{bannerConfig.badgeText}</span>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#FFFDF9]">
            {bannerTitle}
          </h2>

          <p className="text-sm text-[#D1E7DD] leading-relaxed">
            Welcome, <strong className="text-[#FFFDF9]">{userProfile?.displayName}</strong> ({role === 'super_admin' ? 'System Administrator' : role.replace('_', ' ')}). {bannerConfig.description || 'Monitor all 6 SBM dimensions, verify Means of Verification (MOVs), and calibrate official degrees of manifestation.'}
          </p>

          {/* Optional Broadcast Announcement */}
          {bannerConfig.showAnnouncement && bannerConfig.announcementText && (
            <div className={`p-2.5 rounded-xl border flex items-center space-x-2.5 text-xs shadow-sm ${
              bannerConfig.announcementType === 'amber'
                ? 'bg-amber-950/70 border-amber-500/50 text-amber-200'
                : bannerConfig.announcementType === 'emerald'
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                : bannerConfig.announcementType === 'blue'
                ? 'bg-sky-950/70 border-sky-500/50 text-sky-200'
                : 'bg-[#0E3824]/90 border-[#D4AF37]/50 text-[#F0D283]'
            }`}>
              <Megaphone className="w-4 h-4 flex-shrink-0 text-current animate-pulse" />
              <span className="font-medium leading-tight">{bannerConfig.announcementText}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2.5 pt-2">
            {(bannerConfig.quickUploadVisible ?? true) && (
              <button
                id="dashboard-quick-upload-btn"
                onClick={onOpenUpload}
                className="gold-btn px-4 py-2 text-xs rounded-xl shadow-md flex items-center space-x-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload MOV Evidence</span>
              </button>
            )}
            {(bannerConfig.quickAssessVisible ?? true) && (
              <button
                id="dashboard-quick-assess-btn"
                onClick={onNavigateToAssessment}
                className="px-4 py-2 bg-[#061B12]/80 hover:bg-[#0E3322] text-[#F0D283] font-semibold text-xs rounded-xl border border-[#D4AF37]/40 transition-colors flex items-center space-x-1.5"
              >
                <span>Assessment Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {(bannerConfig.quickReportsVisible ?? true) && (
              <button
                id="dashboard-quick-reports-btn"
                onClick={onNavigateToReports}
                className="px-4 py-2 bg-[#061B12]/80 hover:bg-[#0E3322] text-[#FFFDF9] font-semibold text-xs rounded-xl border border-[#D4AF37]/30 transition-colors flex items-center space-x-1.5"
              >
                <span>Generate SBM Reports</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Banner Editor Modal */}
      <BannerEditorModal
        isOpen={isEditingBanner}
        onClose={() => setIsEditingBanner(false)}
        initialConfig={bannerConfig}
        currentSchoolYearLabel={currentSchoolYear.label}
        userDisplayName={userProfile?.displayName}
        userRole={role === 'super_admin' ? 'System Administrator' : role.replace('_', ' ')}
        onSave={handleSaveBanner}
      />

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

      {/* Middle Section: 6 SBM Dimensions Performance & Radar Profile */}
      <div className="space-y-4">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#092217]/70 p-3.5 rounded-2xl border border-[#D4AF37]/25">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#061810] rounded-xl border border-[#D4AF37]/30 text-[#F0D283]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FFFDF9]">
                SBM Dimensions Performance & Radar Analytics
              </h3>
              <p className="text-[11px] text-[#8FBCA7]">
                Operational balance and indicator completion under DepEd Order No. 007, s. 2024
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <div className="flex items-center space-x-1 p-1 bg-[#061810] rounded-xl border border-[#D4AF37]/30 text-xs">
              <button
                type="button"
                id="dimension-view-split-btn"
                onClick={() => setDimensionDisplayMode('split')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all text-xs ${
                  dimensionDisplayMode === 'split'
                    ? 'bg-[#0E3824] text-[#F0D283] font-bold shadow-xs border border-[#D4AF37]/50'
                    : 'text-[#8FBCA7] hover:text-[#FFFDF9]'
                }`}
                title="View Radar Chart and Progress List side by side"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split View</span>
              </button>
              <button
                type="button"
                id="dimension-view-radar-btn"
                onClick={() => setDimensionDisplayMode('radar')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all text-xs ${
                  dimensionDisplayMode === 'radar'
                    ? 'bg-[#0E3824] text-[#F0D283] font-bold shadow-xs border border-[#D4AF37]/50'
                    : 'text-[#8FBCA7] hover:text-[#FFFDF9]'
                }`}
                title="Full width radar chart visualization"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Radar Focus</span>
              </button>
              <button
                type="button"
                id="dimension-view-bars-btn"
                onClick={() => setDimensionDisplayMode('bars')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all text-xs ${
                  dimensionDisplayMode === 'bars'
                    ? 'bg-[#0E3824] text-[#F0D283] font-bold shadow-xs border border-[#D4AF37]/50'
                    : 'text-[#8FBCA7] hover:text-[#FFFDF9]'
                }`}
                title="Full width progress bars list"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Progress List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Display Layout based on dimensionDisplayMode */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Radar Chart (shown in split or radar mode) */}
          {(dimensionDisplayMode === 'split' || dimensionDisplayMode === 'radar') && (
            <div className={dimensionDisplayMode === 'split' ? 'xl:col-span-5 min-w-0' : 'xl:col-span-12 min-w-0'}>
              <DimensionRadarChart
                dimensionProgress={progressStats.dimensionProgress}
                onNavigateToDimension={onNavigateToDimension}
                schoolYearLabel={currentSchoolYear.label}
              />
            </div>
          )}

          {/* Progress Bars List (shown in split or bars mode) */}
          {(dimensionDisplayMode === 'split' || dimensionDisplayMode === 'bars') && (
            <div className={`${dimensionDisplayMode === 'split' ? 'xl:col-span-7' : 'xl:col-span-12'} bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-4`}>
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
          )}
        </div>
      </div>

      {/* Tri-Column Analytics & Evidence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manifestation Distribution & Quick Health */}
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

        {/* Recent MOV Uploads */}
        <div className="bg-[#0D2E1F]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#FFFDF9]">
                Recent MOV Submissions
              </h3>
              <p className="text-xs text-[#8FBCA7]">Latest files in SBM repository</p>
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
                  className="py-2.5 flex items-start justify-between space-x-3 hover:bg-[#123E2A] p-2 rounded-xl transition-colors group"
                >
                  <div
                    onClick={() => (onPreviewMov ? onPreviewMov(mov) : onNavigateToIndicator(mov.indicatorNumber))}
                    className="space-y-1 truncate cursor-pointer flex-1"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-3.5 h-3.5 text-[#F0D283] flex-shrink-0" />
                      <span className="text-xs font-bold text-[#FFFDF9] group-hover:text-[#F0D283] truncate transition-colors">
                        {mov.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8FBCA7]">
                      Ind. {mov.indicatorNumber} • {mov.uploaderName} • {new Date(mov.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {onPreviewMov && (
                      <button
                        type="button"
                        id={`dashboard-preview-mov-${mov.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewMov(mov);
                        }}
                        className="p-1 rounded-lg bg-[#061810] text-[#8FBCA7] hover:text-[#F0D283] hover:bg-[#0E3824] border border-[#D4AF37]/25 transition-colors"
                        title="Preview actual file"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <StatusBadge status={mov.submissionStatus} size="sm" />
                    <ConfidentialityBadge level={mov.confidentialityLevel} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Priority Missing Mandatory MOVs */}
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
