import React from 'react';
import {
  School,
  Building,
  GraduationCap,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Heart,
  Globe,
  LogIn,
  CheckCircle2
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { SchoolReportCard } from '../../types';

interface PublicPortalViewProps {
  onOpenAuth: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSrc: () => void;
  onNavigateToDashboard: () => void;
}

export const PublicPortalView: React.FC<PublicPortalViewProps> = ({
  onOpenAuth,
  onNavigateToProfile,
  onNavigateToSrc,
  onNavigateToDashboard
}) => {
  const { schoolProfile, dimensions, schoolReportCards } = useSbmData();

  const publishedSrc =
    (schoolReportCards && schoolReportCards.find((s) => s.isPublished || s.status === 'published')) ||
    (schoolReportCards && schoolReportCards[0]) ||
    ({
      id: 'src-default',
      schoolYearId: 'SY-2024-2025',
      schoolYearLabel: 'S.Y. 2024–2025',
      title: 'School Report Card S.Y. 2024–2025',
      status: 'published',
      isPublished: true,
      enrollmentTotal: 5392,
      enrollment: 5392,
      promotionRate: 98.4,
      completionRate: 97.8,
      dropoutRate: 0.6,
      natProficiencyAverage: 79.2,
      natRating: 79.2,
      summary: 'Quirino High School official transparency document presenting school performance, learner outcomes, and financial stewardship.',
      keyAccomplishments: [],
      accomplishments: [],
      priorityImprovementAreas: [],
      priorityAreas: [],
      stakeholderHighlights: [],
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as SchoolReportCard);

  const enrollment = publishedSrc.enrollment ?? publishedSrc.enrollmentTotal ?? 0;
  const completionRate = publishedSrc.completionRate ?? 0;
  const promotionRate = publishedSrc.promotionRate ?? 0;
  const natRating = publishedSrc.natRating ?? publishedSrc.natProficiencyAverage ?? 0;
  const summary = publishedSrc.summary || 'Quirino High School official transparency document presenting school performance, learner outcomes, and financial stewardship.';

  const coreValues = schoolProfile?.depEdCoreValues || schoolProfile?.coreValues || ['Maka-Diyos', 'Maka-tao', 'Makakalikasan', 'Makabansa'];
  const schoolId = schoolProfile?.schoolId || '300539';
  const principalName = schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese';
  const division = schoolProfile?.division || 'Division of City Schools - Quezon City';
  const region = schoolProfile?.region || 'National Capital Region (NCR)';

  return (
    <div id="public-portal-view" className="space-y-8">
      {/* Hero Welcome Section - Picture Holder & Theme */}
      <div className="relative rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden bg-gradient-to-r from-[#072015] via-[#0C301F] to-[#04140D] border border-[#D4AF37]/35">
        {/* Banner Background Image */}
        {(schoolProfile?.bannerUrl || schoolProfile?.schoolBanner) && (
          <>
            <img
              src={schoolProfile.bannerUrl || schoolProfile.schoolBanner}
              alt="School Banner Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Transparent overlay that clearly reveals the banner photo */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#041A10]/60 via-[#072418]/40 to-[#03150D]/25" />
            <div className="absolute inset-0 bg-black/10 backdrop-brightness-[0.98]" />
          </>
        )}

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center space-x-3">
            {(schoolProfile?.logoUrl || schoolProfile?.schoolLogo) ? (
              <div className="w-12 h-12 rounded-full bg-[#061810] border-2 border-[#D4AF37] p-0.5 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg">
                <img
                  src={schoolProfile.logoUrl || schoolProfile.schoolLogo}
                  alt="School Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : null}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F0D283] text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Official SBM Public Transparency Portal</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {schoolProfile?.schoolName || schoolProfile?.name || 'Quirino High School'}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            School-Based Management (SBM) Monitoring, Archiving, Repository, and Tracking Portal. Empowering continuous school improvement under DepEd Order No. 007, s. 2024.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              id="public-hero-signin-btn"
              onClick={onOpenAuth}
              className="gold-btn px-5 py-2.5 text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as SBM Personnel</span>
            </button>

            <button
              id="public-hero-src-btn"
              onClick={onNavigateToSrc}
              className="px-5 py-2.5 bg-[#061810]/80 hover:bg-[#0E3322] text-[#F0D283] font-semibold text-xs rounded-xl border border-[#D4AF37]/40 transition-colors flex items-center space-x-2"
            >
              <span>View School Report Card</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DepEd Core Values Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {coreValues.map((val) => (
          <div
            key={val}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1"
          >
            <Heart className="w-4 h-4 text-rose-500 mx-auto" />
            <p className="text-xs font-bold text-slate-900">{val}</p>
            <span className="text-[10px] text-slate-400">DepEd Core Value</span>
          </div>
        ))}
      </div>

      {/* School Highlights & Published SRC Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Published SRC highlight */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Official Transparency Document
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                School Report Card Highlights
              </h2>
            </div>
            <button
              onClick={onNavigateToSrc}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Full SRC Document →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Enrollment</span>
              <span className="text-xl font-black text-blue-900">{(enrollment || 0).toLocaleString()}</span>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Completion</span>
              <span className="text-xl font-black text-emerald-700">{completionRate}%</span>
            </div>
            <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Promotion</span>
              <span className="text-xl font-black text-purple-700">{promotionRate}%</span>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">NAT Rating</span>
              <span className="text-xl font-black text-amber-700">{natRating}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            "{summary}"
          </p>
        </div>

        {/* Right 1 col: School Info & Leadership */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <School className="w-5 h-5 text-blue-700" />
              <h3 className="text-base font-bold text-slate-900">School Profile</h3>
            </div>

            <div className="space-y-2 text-xs text-slate-700 divide-y divide-slate-100">
              <div className="pt-1 flex justify-between">
                <span className="text-slate-500">School ID:</span>
                <strong className="text-slate-900">{schoolId}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Principal:</span>
                <strong className="text-slate-900">{principalName}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Division:</span>
                <strong className="text-slate-900">{division}</strong>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Region:</span>
                <strong className="text-slate-900">{region}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToProfile}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
          >
            Explore Complete School Profile
          </button>
        </div>
      </div>

      {/* 6 Dimensions Overview */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Governance Framework
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            The Six SBM Dimensions (DepEd Order No. 007, s. 2024)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensions.map((dim) => (
            <div
              key={dim.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
            >
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-md bg-blue-900 text-amber-300 font-bold text-[11px] flex items-center justify-center">
                  {dim.id}
                </span>
                <h3 className="text-xs font-bold text-slate-900">{dim.name}</h3>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                {dim.officialDescription}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
