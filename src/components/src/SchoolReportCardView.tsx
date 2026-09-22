import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Calendar,
  Award,
  TrendingUp,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Globe,
  Edit3,
  Plus,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { SchoolReportCard } from '../../types';

export const SchoolReportCardView: React.FC = () => {
  const {
    schoolProfile,
    schoolReportCards,
    schoolYears,
    toggleSrcPublish,
    saveSchoolReportCard,
    updateSchoolProfile
  } = useSbmData();
  const { isSchoolHead, isSuperAdmin, isCoordinator } = useAuth();

  const [selectedSyId, setSelectedSyId] = useState<string>('SY-2024-2025');

  // Edit Modal State
  const [isEditingSrc, setIsEditingSrc] = useState(false);
  const [isSavingSrc, setIsSavingSrc] = useState(false);
  const [newAccomplishment, setNewAccomplishment] = useState('');
  const [newPriorityArea, setNewPriorityArea] = useState('');

  const activeSrc =
    (schoolReportCards && schoolReportCards.find((s) => s.schoolYearId === selectedSyId)) ||
    (schoolReportCards && schoolReportCards[0]) ||
    ({
      id: 'src-default',
      schoolYearId: selectedSyId || 'SY-2024-2025',
      schoolYearLabel: 'S.Y. 2024–2025',
      title: 'School Report Card S.Y. 2024–2025',
      schoolId: schoolProfile?.schoolId || '300539',
      status: 'published',
      isPublished: true,
      enrollmentTotal: 5392,
      enrollment: 5392,
      promotionRate: 98.4,
      completionRate: 97.8,
      dropoutRate: 0.6,
      natProficiencyAverage: 79.2,
      natRating: 79.2,
      attestedByName: schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese',
      attestedByTitle: schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV',
      preparedByName: schoolProfile?.sbmCoordinator || 'Mr. Jonathan C. Santos',
      preparedByTitle: schoolProfile?.sbmCoordinatorTitle || 'School SBM Coordinator / Master Teacher II',
      validatedByName: schoolProfile?.divisionValidator || 'Dr. Maria Elena V. Gonzales',
      validatedByTitle: schoolProfile?.divisionValidatorTitle || 'Division SBM Validator / EPS - SDO QC',
      summary: 'Quirino High School official transparency document presenting school performance, learner outcomes, and financial stewardship.',
      keyAccomplishments: [
        'Ranked in the top 5 high schools in SDO Quezon City for National Achievement Test (NAT G10 & G12).',
        '100% functionality certification for School Governance Council (SGC) and Child Protection Committee.'
      ],
      accomplishments: [
        'Ranked in the top 5 high schools in SDO Quezon City for National Achievement Test (NAT G10 & G12).',
        '100% functionality certification for School Governance Council (SGC) and Child Protection Committee.'
      ],
      priorityImprovementAreas: [
        'Intensify Catch-Up Friday reading and numeracy interventions in Junior High School.'
      ],
      priorityAreas: [
        'Intensify Catch-Up Friday reading and numeracy interventions in Junior High School.'
      ],
      stakeholderHighlights: [],
      publishedAt: new Date().toISOString(),
      publishedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as SchoolReportCard);

  const [srcForm, setSrcForm] = useState({
    title: activeSrc.title || `School Report Card ${activeSrc.schoolYearLabel || activeSrc.schoolYearId}`,
    schoolId: activeSrc.schoolId || schoolProfile?.schoolId || '300539',
    schoolName: schoolProfile?.schoolName || schoolProfile?.name || 'Quirino High School',
    enrollmentTotal: activeSrc.enrollmentTotal ?? activeSrc.enrollment ?? 5392,
    completionRate: activeSrc.completionRate ?? 97.8,
    promotionRate: activeSrc.promotionRate ?? 98.4,
    dropoutRate: activeSrc.dropoutRate ?? 0.6,
    natProficiencyAverage: activeSrc.natProficiencyAverage ?? activeSrc.natRating ?? 79.2,
    summary: activeSrc.summary || '',
    attestedByName: activeSrc.attestedByName || schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese',
    attestedByTitle: activeSrc.attestedByTitle || schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV',
    preparedByName: activeSrc.preparedByName || schoolProfile?.sbmCoordinator || 'Mr. Jonathan C. Santos',
    preparedByTitle: activeSrc.preparedByTitle || schoolProfile?.sbmCoordinatorTitle || 'School SBM Coordinator / Master Teacher II',
    validatedByName: activeSrc.validatedByName || schoolProfile?.divisionValidator || 'Dr. Maria Elena V. Gonzales',
    validatedByTitle: activeSrc.validatedByTitle || schoolProfile?.divisionValidatorTitle || 'Division SBM Validator / EPS - SDO QC',
    status: activeSrc.status || 'published',
    keyAccomplishments: activeSrc.accomplishments && activeSrc.accomplishments.length > 0
      ? [...activeSrc.accomplishments]
      : (activeSrc.keyAccomplishments ? [...activeSrc.keyAccomplishments] : []),
    priorityImprovementAreas: activeSrc.priorityAreas && activeSrc.priorityAreas.length > 0
      ? [...activeSrc.priorityAreas]
      : (activeSrc.priorityImprovementAreas ? [...activeSrc.priorityImprovementAreas] : [])
  });

  const handleOpenEditSrc = () => {
    setSrcForm({
      title: activeSrc.title || `School Report Card ${activeSrc.schoolYearLabel || activeSrc.schoolYearId}`,
      schoolId: activeSrc.schoolId || schoolProfile?.schoolId || '300539',
      schoolName: schoolProfile?.schoolName || schoolProfile?.name || 'Quirino High School',
      enrollmentTotal: activeSrc.enrollmentTotal ?? activeSrc.enrollment ?? 5392,
      completionRate: activeSrc.completionRate ?? 97.8,
      promotionRate: activeSrc.promotionRate ?? 98.4,
      dropoutRate: activeSrc.dropoutRate ?? 0.6,
      natProficiencyAverage: activeSrc.natProficiencyAverage ?? activeSrc.natRating ?? 79.2,
      summary: activeSrc.summary || '',
      attestedByName: activeSrc.attestedByName || schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese',
      attestedByTitle: activeSrc.attestedByTitle || schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV',
      preparedByName: activeSrc.preparedByName || schoolProfile?.sbmCoordinator || 'Mr. Jonathan C. Santos',
      preparedByTitle: activeSrc.preparedByTitle || schoolProfile?.sbmCoordinatorTitle || 'School SBM Coordinator / Master Teacher II',
      validatedByName: activeSrc.validatedByName || schoolProfile?.divisionValidator || 'Dr. Maria Elena V. Gonzales',
      validatedByTitle: activeSrc.validatedByTitle || schoolProfile?.divisionValidatorTitle || 'Division SBM Validator / EPS - SDO QC',
      status: activeSrc.status || 'published',
      keyAccomplishments: activeSrc.accomplishments && activeSrc.accomplishments.length > 0
        ? [...activeSrc.accomplishments]
        : (activeSrc.keyAccomplishments ? [...activeSrc.keyAccomplishments] : []),
      priorityImprovementAreas: activeSrc.priorityAreas && activeSrc.priorityAreas.length > 0
        ? [...activeSrc.priorityAreas]
        : (activeSrc.priorityImprovementAreas ? [...activeSrc.priorityImprovementAreas] : [])
    });
    setNewAccomplishment('');
    setNewPriorityArea('');
    setIsEditingSrc(true);
  };

  const handleSaveSrc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSrc(true);
    try {
      const updatedReportCard: SchoolReportCard = {
        ...activeSrc,
        title: srcForm.title,
        schoolId: srcForm.schoolId,
        enrollmentTotal: Number(srcForm.enrollmentTotal),
        enrollment: Number(srcForm.enrollmentTotal),
        completionRate: Number(srcForm.completionRate),
        promotionRate: Number(srcForm.promotionRate),
        dropoutRate: Number(srcForm.dropoutRate),
        natProficiencyAverage: Number(srcForm.natProficiencyAverage),
        natRating: Number(srcForm.natProficiencyAverage),
        summary: srcForm.summary,
        attestedByName: srcForm.attestedByName,
        attestedByTitle: srcForm.attestedByTitle,
        preparedByName: srcForm.preparedByName,
        preparedByTitle: srcForm.preparedByTitle,
        validatedByName: srcForm.validatedByName,
        validatedByTitle: srcForm.validatedByTitle,
        status: srcForm.status as 'draft' | 'published',
        isPublished: srcForm.status === 'published',
        keyAccomplishments: srcForm.keyAccomplishments,
        accomplishments: srcForm.keyAccomplishments,
        priorityImprovementAreas: srcForm.priorityImprovementAreas,
        priorityAreas: srcForm.priorityImprovementAreas,
        updatedAt: new Date().toISOString()
      };

      await saveSchoolReportCard(updatedReportCard);

      // Also sync school credentials to schoolProfile if modified
      if (
        srcForm.schoolId !== schoolProfile?.schoolId ||
        srcForm.schoolName !== schoolProfile?.schoolName ||
        srcForm.attestedByName !== schoolProfile?.principalName ||
        srcForm.preparedByName !== schoolProfile?.sbmCoordinator
      ) {
        await updateSchoolProfile({
          schoolId: srcForm.schoolId,
          schoolName: srcForm.schoolName,
          name: srcForm.schoolName,
          principalName: srcForm.attestedByName,
          schoolHead: srcForm.attestedByName,
          schoolHeadTitle: srcForm.attestedByTitle,
          sbmCoordinator: srcForm.preparedByName,
          sbmCoordinatorTitle: srcForm.preparedByTitle,
          divisionValidator: srcForm.validatedByName,
          divisionValidatorTitle: srcForm.validatedByTitle
        });
      }

      setIsEditingSrc(false);
    } catch (err) {
      console.error('Failed to save school report card:', err);
    } finally {
      setIsSavingSrc(false);
    }
  };

  const handleAddAccomplishment = () => {
    if (!newAccomplishment.trim()) return;
    setSrcForm({
      ...srcForm,
      keyAccomplishments: [...srcForm.keyAccomplishments, newAccomplishment.trim()]
    });
    setNewAccomplishment('');
  };

  const handleRemoveAccomplishment = (index: number) => {
    setSrcForm({
      ...srcForm,
      keyAccomplishments: srcForm.keyAccomplishments.filter((_, i) => i !== index)
    });
  };

  const handleAddPriorityArea = () => {
    if (!newPriorityArea.trim()) return;
    setSrcForm({
      ...srcForm,
      priorityImprovementAreas: [...srcForm.priorityImprovementAreas, newPriorityArea.trim()]
    });
    setNewPriorityArea('');
  };

  const handleRemovePriorityArea = (index: number) => {
    setSrcForm({
      ...srcForm,
      priorityImprovementAreas: srcForm.priorityImprovementAreas.filter((_, i) => i !== index)
    });
  };

  const isPublished = activeSrc.status === 'published' || Boolean(activeSrc.isPublished);
  const enrollment = activeSrc.enrollment ?? activeSrc.enrollmentTotal ?? 0;
  const completionRate = activeSrc.completionRate ?? 0;
  const promotionRate = activeSrc.promotionRate ?? 0;
  const dropoutRate = activeSrc.dropoutRate ?? 0;
  const natRating = activeSrc.natRating ?? activeSrc.natProficiencyAverage ?? 0;
  const title = activeSrc.title || `School Report Card ${activeSrc.schoolYearLabel || activeSrc.schoolYearId}`;
  const summary = activeSrc.summary || 'Quirino High School official transparency document presenting school performance, learner outcomes, and financial stewardship.';
  const accomplishments = activeSrc.accomplishments && activeSrc.accomplishments.length > 0
    ? activeSrc.accomplishments
    : (activeSrc.keyAccomplishments || []);
  const priorityAreas = activeSrc.priorityAreas && activeSrc.priorityAreas.length > 0
    ? activeSrc.priorityAreas
    : (activeSrc.priorityImprovementAreas || []);
  const publishedDateStr = (() => {
    try {
      const raw = activeSrc.publishedDate || activeSrc.publishedAt || activeSrc.updatedAt;
      return raw ? new Date(raw).toLocaleDateString() : new Date().toLocaleDateString();
    } catch {
      return new Date().toLocaleDateString();
    }
  })();

  const handleTogglePublish = async () => {
    if (!isSchoolHead && !isSuperAdmin && !isCoordinator) {
      alert('Only the School Principal or SBM Coordinator can toggle SRC public visibility.');
      return;
    }
    if (toggleSrcPublish && activeSrc.id) {
      await toggleSrcPublish(activeSrc.id, !isPublished);
    }
  };

  const currentSchoolId = activeSrc.schoolId || schoolProfile?.schoolId || '300539';
  const currentSchoolName = schoolProfile?.schoolName || schoolProfile?.name || 'Quirino High School';
  const currentAttestedName = activeSrc.attestedByName || schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese';
  const currentAttestedTitle = activeSrc.attestedByTitle || schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV';
  const currentPreparedName = activeSrc.preparedByName || schoolProfile?.sbmCoordinator || 'Mr. Jonathan C. Santos';
  const currentPreparedTitle = activeSrc.preparedByTitle || schoolProfile?.sbmCoordinatorTitle || 'School SBM Coordinator / Master Teacher II';
  const currentValidatedName = activeSrc.validatedByName || schoolProfile?.divisionValidator || 'Dr. Maria Elena V. Gonzales';
  const currentValidatedTitle = activeSrc.validatedByTitle || schoolProfile?.divisionValidatorTitle || 'Division SBM Validator / EPS - SDO QC';

  return (
    <div id="school-report-card-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              DepEd Official Accountability Document
            </span>
            {isPublished ? (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center">
                <Globe className="w-3 h-3 mr-1" /> Published Publicly
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center">
                <Lock className="w-3 h-3 mr-1" /> Internal Draft
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            School Report Card (SRC)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentSchoolName} official transparency document presenting school performance, learner outcomes, and financial stewardship.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* SY Picker */}
          <select
            id="src-school-year-select"
            value={selectedSyId}
            onChange={(e) => setSelectedSyId(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none"
          >
            {schoolYears.map((sy) => (
              <option key={sy.id} value={sy.id}>
                {sy.label}
              </option>
            ))}
          </select>

          {/* Edit SRC & Signatories Button */}
          <button
            id="edit-src-btn"
            onClick={handleOpenEditSrc}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-amber-600" />
            <span>Edit Report Card & Signatories</span>
          </button>

          {(isSchoolHead || isSuperAdmin || isCoordinator) && (
            <button
              id="toggle-src-publish-btn"
              onClick={handleTogglePublish}
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors ${
                isPublished
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPublished ? 'Unpublish from Portal' : 'Publish to Public Portal'}
            </button>
          )}
        </div>
      </div>

      {/* Main SRC Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Title and Principal Signature block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              {currentSchoolName} • School ID: {currentSchoolId}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{title}</h3>
            <p className="text-xs text-slate-500">
              Published on: {publishedDateStr} • {schoolProfile?.division || 'DepEd SDO Quezon City'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-0.5 min-w-[220px]">
            <span className="font-semibold text-slate-500 block text-[10px] uppercase">Attested By:</span>
            <span className="font-bold text-slate-900 block text-sm">{currentAttestedName}</span>
            <span className="text-[11px] text-slate-500 block font-medium">{currentAttestedTitle}</span>
          </div>
        </div>

        {/* Quantitative Performance Indicators Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Key Institutional Performance Metrics
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
              <span className="text-slate-500 text-xs font-medium">Total Enrollment</span>
              <p className="text-2xl font-black text-blue-900">{(enrollment || 0).toLocaleString()}</p>
              <span className="text-[10px] text-slate-500">Learners Enrolled</span>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
              <span className="text-slate-500 text-xs font-medium">Completion Rate</span>
              <p className="text-2xl font-black text-emerald-700">{completionRate}%</p>
              <span className="text-[10px] text-slate-500">JHS to SHS Graduation</span>
            </div>

            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1">
              <span className="text-slate-500 text-xs font-medium">Promotion Rate</span>
              <p className="text-2xl font-black text-purple-700">{promotionRate}%</p>
              <span className="text-[10px] text-slate-500">Grade Level Advancement</span>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1">
              <span className="text-slate-500 text-xs font-medium">Dropout / Leaver Rate</span>
              <p className="text-2xl font-black text-amber-700">{dropoutRate}%</p>
              <span className="text-[10px] text-slate-500">Under 1.0% Target</span>
            </div>
          </div>
        </div>

        {/* NAT Performance Rating */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-800">
              National Achievement Test (NAT G10 & G12) Mean Percentage Score (MPS):
            </span>
            <p className="text-xs text-slate-500">
              Standardized assessment rating conducted by the Bureau of Education Assessment (BEA).
            </p>
          </div>
          <span className="text-xl font-black text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-slate-300">
            {natRating}% MPS
          </span>
        </div>

        {/* Narrative & Accomplishments */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Executive Summary & Institutional Narrative
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {summary}
          </p>
        </div>

        {/* Accomplishments and Priority Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Accomplishments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Major School Accomplishments ({accomplishments.length})</span>
            </h4>
            <div className="space-y-2">
              {accomplishments.map((acc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs text-slate-800 flex items-start space-x-2"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{acc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Improvement Areas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Priority Improvement & Continuous Projects ({priorityAreas.length})</span>
            </h4>
            <div className="space-y-2">
              {priorityAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-50/40 rounded-xl border border-amber-100 text-xs text-slate-800 flex items-start space-x-2"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Official DepEd Accountability Signatories Block */}
        <div className="pt-8 border-t-2 border-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Official School Report Card Accountability & Endorsement
            </h4>
            <button
              onClick={handleOpenEditSrc}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit Signatories</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Prepared & Certified By:</div>
              <div className="h-8"></div>
              <div className="font-bold text-slate-900 border-t border-slate-300 pt-1 uppercase">
                {currentPreparedName}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {currentPreparedTitle}
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Attested & Approved By:</div>
              <div className="h-8"></div>
              <div className="font-bold text-slate-900 border-t border-slate-300 pt-1 uppercase">
                {currentAttestedName}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {currentAttestedTitle}
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Validated & Endorsed By:</div>
              <div className="h-8"></div>
              <div className="font-bold text-slate-900 border-t border-slate-300 pt-1 uppercase">
                {currentValidatedName}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {currentValidatedTitle}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit School Report Card (SRC) Modal */}
      {isEditingSrc && (
        <div
          id="src-edit-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit School Report Card (SRC) & Signatories
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modify performance metrics, school credentials, accomplishment highlights, and official endorsements.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingSrc(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSrc} className="space-y-5 text-xs">
              {/* Section 1: School Identity & Report Title */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  1. Report Title & School Identification
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">SRC Title</label>
                    <input
                      type="text"
                      value={srcForm.title}
                      onChange={(e) => setSrcForm({ ...srcForm, title: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">DepEd School ID</label>
                    <input
                      type="text"
                      value={srcForm.schoolId}
                      onChange={(e) => setSrcForm({ ...srcForm, schoolId: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">School Name</label>
                    <input
                      type="text"
                      value={srcForm.schoolName}
                      onChange={(e) => setSrcForm({ ...srcForm, schoolName: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Publication Status</label>
                    <select
                      value={srcForm.status}
                      onChange={(e) => setSrcForm({ ...srcForm, status: e.target.value as 'draft' | 'published' })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    >
                      <option value="published">Published (Visible in Public Portal)</option>
                      <option value="draft">Draft (Internal Only)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Quantitative Institutional Performance Metrics */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  2. Institutional Performance Metrics
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Total Enrollment</label>
                    <input
                      type="number"
                      value={srcForm.enrollmentTotal}
                      onChange={(e) => setSrcForm({ ...srcForm, enrollmentTotal: Number(e.target.value) })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Completion Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={srcForm.completionRate}
                      onChange={(e) => setSrcForm({ ...srcForm, completionRate: Number(e.target.value) })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Promotion Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={srcForm.promotionRate}
                      onChange={(e) => setSrcForm({ ...srcForm, promotionRate: Number(e.target.value) })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Dropout Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={srcForm.dropoutRate}
                      onChange={(e) => setSrcForm({ ...srcForm, dropoutRate: Number(e.target.value) })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">NAT MPS (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={srcForm.natProficiencyAverage}
                      onChange={(e) => setSrcForm({ ...srcForm, natProficiencyAverage: Number(e.target.value) })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Narrative */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  3. Executive Summary & Institutional Narrative
                </label>
                <textarea
                  rows={3}
                  value={srcForm.summary}
                  onChange={(e) => setSrcForm({ ...srcForm, summary: e.target.value })}
                  placeholder="Enter high-level institutional summary..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Section 4: Signatories */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  4. Official Signatories & Endorsements
                </span>
                
                {/* Attested By: Principal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Attested By (Principal Name)</label>
                    <input
                      type="text"
                      value={srcForm.attestedByName}
                      onChange={(e) => setSrcForm({ ...srcForm, attestedByName: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Principal Position Title / Designation</label>
                    <input
                      type="text"
                      value={srcForm.attestedByTitle}
                      onChange={(e) => setSrcForm({ ...srcForm, attestedByTitle: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Prepared By: Coordinator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Prepared By (SBM Coordinator Name)</label>
                    <input
                      type="text"
                      value={srcForm.preparedByName}
                      onChange={(e) => setSrcForm({ ...srcForm, preparedByName: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">SBM Coordinator Title / Designation</label>
                    <input
                      type="text"
                      value={srcForm.preparedByTitle}
                      onChange={(e) => setSrcForm({ ...srcForm, preparedByTitle: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Validated By: Division Validator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Validated By (Division Validator Name)</label>
                    <input
                      type="text"
                      value={srcForm.validatedByName}
                      onChange={(e) => setSrcForm({ ...srcForm, validatedByName: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Division Validator Title / Designation</label>
                    <input
                      type="text"
                      value={srcForm.validatedByTitle}
                      onChange={(e) => setSrcForm({ ...srcForm, validatedByTitle: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Key Accomplishments */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  5. Major Accomplishment Items ({srcForm.keyAccomplishments.length})
                </span>
                <div className="space-y-2">
                  {srcForm.keyAccomplishments.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const copy = [...srcForm.keyAccomplishments];
                          copy[idx] = e.target.value;
                          setSrcForm({ ...srcForm, keyAccomplishments: copy });
                        }}
                        className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAccomplishment(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Remove Accomplishment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add new school accomplishment..."
                      value={newAccomplishment}
                      onChange={(e) => setNewAccomplishment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAccomplishment();
                        }
                      }}
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddAccomplishment}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 6: Priority Improvement Areas */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  6. Priority Improvement Areas ({srcForm.priorityImprovementAreas.length})
                </span>
                <div className="space-y-2">
                  {srcForm.priorityImprovementAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => {
                          const copy = [...srcForm.priorityImprovementAreas];
                          copy[idx] = e.target.value;
                          setSrcForm({ ...srcForm, priorityImprovementAreas: copy });
                        }}
                        className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePriorityArea(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Remove Priority Area"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add new priority improvement area..."
                      value={newPriorityArea}
                      onChange={(e) => setNewPriorityArea(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPriorityArea();
                        }
                      }}
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddPriorityArea}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSrc(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSrc}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSrc ? 'Saving Changes...' : 'Save School Report Card'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
