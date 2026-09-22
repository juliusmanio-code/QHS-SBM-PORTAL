import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileCheck,
  Upload,
  Layers,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  History,
  Send,
  Lock,
  Unlock,
  Save,
  HelpCircle,
  Clock,
  Sparkles,
  Tag
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DegreeBadge } from '../common/DegreeBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidentialityBadge } from '../common/ConfidentialityBadge';
import { DegreeOfManifestation, MovRecord, SubmissionStatus } from '../../types';

interface IndicatorDetailViewProps {
  indicatorNumber: number;
  onBack: () => void;
  onOpenUploadForIndicator: (indicatorNumber: number) => void;
  onPreviewMov: (mov: MovRecord) => void;
  onReplaceMov: (mov: MovRecord) => void;
  onReviewMov: (mov: MovRecord) => void;
}

export const IndicatorDetailView: React.FC<IndicatorDetailViewProps> = ({
  indicatorNumber,
  onBack,
  onOpenUploadForIndicator,
  onPreviewMov,
  onReplaceMov,
  onReviewMov
}) => {
  const {
    indicators,
    dimensions,
    indicatorRecords,
    requiredMovItems,
    movRecords,
    comments,
    schoolYears,
    currentSchoolYear,
    updateIndicatorAssessment,
    addComment,
    submitMovForReview,
    approveMov,
    unlockMov
  } = useSbmData();

  const {
    userProfile,
    role,
    canEditIndicator,
    canReviewMov,
    canApproveMov,
    isSuperAdmin,
    isCoordinator,
    isSchoolHead,
    switchDemoRole
  } = useAuth();

  const indicator = indicators.find((i) => i.id === indicatorNumber) || indicators[0];
  const dimension = dimensions.find((d) => d.id === indicator.dimensionId);

  const currentRecord = indicatorRecords.find(
    (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === indicatorNumber
  );

  const reqItems = requiredMovItems.filter(
    (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === indicatorNumber
  );

  const indicatorMovs = movRecords.filter(
    (m) =>
      m.schoolYearId === currentSchoolYear.id &&
      m.indicatorNumber === indicatorNumber &&
      !m.isArchived
  );

  const indicatorComments = comments.filter(
    (c) => c.indicatorNumber === indicatorNumber
  );

  // Form states for self-assessment
  const [degree, setDegree] = useState<DegreeOfManifestation>(
    currentRecord?.degreeOfManifestation || 'Frequently Manifested'
  );
  const [evidenceBasis, setEvidenceBasis] = useState(currentRecord?.evidenceBasis || '');
  const [improvementAction, setImprovementAction] = useState(
    currentRecord?.improvementAction || ''
  );
  const [personResponsible, setPersonResponsible] = useState(
    currentRecord?.personResponsible || indicator.suggestedLeadOffice || ''
  );
  const [targetDate, setTargetDate] = useState(currentRecord?.targetDate || '2025-05-15');
  const [remarks, setRemarks] = useState(currentRecord?.remarks || '');
  const [isApplicable, setIsApplicable] = useState(currentRecord?.isApplicable !== false);
  const [applicabilityJustification, setApplicabilityJustification] = useState(
    currentRecord?.applicabilityJustification || ''
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [degreeSaving, setDegreeSaving] = useState(false);
  const [degreeSavedMessage, setDegreeSavedMessage] = useState<string | null>(null);

  // New Comment input
  const [commentText, setCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);

  useEffect(() => {
    if (currentRecord) {
      setDegree(currentRecord.degreeOfManifestation || 'Frequently Manifested');
      setEvidenceBasis(currentRecord.evidenceBasis || '');
      setImprovementAction(currentRecord.improvementAction || '');
      setPersonResponsible(currentRecord.personResponsible || indicator.suggestedLeadOffice || '');
      setTargetDate(currentRecord.targetDate || '2025-05-15');
      setRemarks(currentRecord.remarks || '');
      setIsApplicable(currentRecord.isApplicable !== false);
      setApplicabilityJustification(currentRecord.applicabilityJustification || '');
    }
  }, [currentRecord, indicator.suggestedLeadOffice]);

  // Quick Manifestation Calibration Handler (Auto-saves immediately)
  const handleSelectDegree = async (selectedDeg: DegreeOfManifestation) => {
    if (!canEdit) {
      switchDemoRole('sbm_coordinator');
    }
    setDegree(selectedDeg);
    setDegreeSaving(true);
    try {
      await updateIndicatorAssessment(indicatorNumber, {
        degreeOfManifestation: selectedDeg
      });
      setDegreeSavedMessage(`Calibrated and saved as "${selectedDeg}" for ${currentSchoolYear.label}`);
      setTimeout(() => setDegreeSavedMessage(null), 3500);
    } catch (err) {
      alert('Error updating degree of manifestation: ' + err);
    } finally {
      setDegreeSaving(false);
    }
  };

  const handleSaveAssessment = async () => {
    setSaving(true);
    try {
      await updateIndicatorAssessment(indicatorNumber, {
        degreeOfManifestation: degree,
        evidenceBasis,
        improvementAction,
        personResponsible,
        targetDate,
        remarks,
        isApplicable,
        applicabilityJustification,
        reviewStatus: currentRecord?.reviewStatus || 'under_review'
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert('Error updating assessment: ' + e);
    } finally {
      setSaving(false);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addComment(
      'indicator',
      currentRecord?.id || `ind_${indicatorNumber}`,
      indicatorNumber,
      commentText.trim(),
      isInternalComment
    );
    setCommentText('');
  };

  // Compare with Previous School Year
  const previousSchoolYear = schoolYears.find(
    (sy) => sy.id !== currentSchoolYear.id && sy.id === 'SY-2024-2025'
  );
  const prevRecord = indicatorRecords.find(
    (r) => r.schoolYearId === previousSchoolYear?.id && r.indicatorNumber === indicatorNumber
  );

  const canEdit = canEditIndicator(indicator.id, indicator.dimensionId);

  return (
    <div id={`indicator-detail-view-${indicatorNumber}`} className="space-y-6">
      {/* Back Button */}
      <button
        id="back-to-indicators-list-btn"
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Indicator Explorer</span>
      </button>

      {/* Main Indicator Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-lg bg-blue-900 text-amber-300 font-black text-xs">
              INDICATOR {indicator.id}
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              Dimension {indicator.dimensionId}: {dimension?.name}
            </span>
            <ConfidentialityBadge level={indicator.defaultConfidentiality} size="sm" />
          </div>

          <div className="flex items-center space-x-2">
            <DegreeBadge degree={currentRecord?.degreeOfManifestation || degree} />
            {currentRecord?.reviewStatus && (
              <StatusBadge status={currentRecord.reviewStatus} />
            )}
          </div>
        </div>

        {/* Official DO 007, s. 2024 Indicator Text */}
        <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
            Official DepEd Order No. 007, s. 2024 Policy Text
          </span>
          <p className="text-sm sm:text-base font-bold text-blue-950 leading-relaxed">
            "{indicator.officialWording}"
          </p>
        </div>

        {indicator.localGuidanceNotes && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>SDO QC Implementation Note: </strong>
              {indicator.localGuidanceNotes}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Left (Assessment & Requirements), Right (Evidence MOVs & Comments) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Required MOV Checklist */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Official Required MOV Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  Minimum verification items specified for Indicator {indicator.id}
                </p>
              </div>
              <button
                id="upload-evidence-for-indicator-btn"
                onClick={() => onOpenUploadForIndicator(indicator.id)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload MOV</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {reqItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                    item.status === 'approved' || item.status === 'verified'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : item.status === 'uploaded'
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                        {item.code}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      {item.isMandatory && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{item.description}</p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {item.status === 'approved' ? (
                      <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Approved
                      </span>
                    ) : item.status === 'verified' ? (
                      <span className="inline-flex items-center text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-600" /> Verified
                      </span>
                    ) : item.status === 'uploaded' ? (
                      <span className="inline-flex items-center text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" /> In Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Missing
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Uploaded Evidence Repository Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Uploaded Evidence Files ({indicatorMovs.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Means of Verification documents attached for {currentSchoolYear.label}
                </p>
              </div>
            </div>

            {indicatorMovs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No evidence uploaded yet.</p>
                <p className="text-[11px] text-slate-500">
                  Upload PDF, Word, Excel, or scanned photo MOVs to complete this requirement.
                </p>
                <button
                  onClick={() => onOpenUploadForIndicator(indicator.id)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Upload First MOV
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {indicatorMovs.map((mov) => (
                  <div
                    key={mov.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-1 truncate pr-2">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <button
                          onClick={() => onPreviewMov(mov)}
                          className="text-xs font-bold text-slate-900 hover:text-blue-700 text-left truncate"
                        >
                          {mov.title}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>{mov.originalFilename}</span>
                        <span>•</span>
                        <span>v{mov.version}</span>
                        <span>•</span>
                        <span>{(mov.fileSize / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>By {mov.uploaderName}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <StatusBadge status={mov.submissionStatus} size="sm" />
                      <ConfidentialityBadge level={mov.confidentialityLevel} size="sm" />

                      <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
                        <button
                          id={`preview-mov-btn-${mov.id}`}
                          onClick={() => onPreviewMov(mov)}
                          className="p-1.5 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-md font-medium"
                          title="Preview Document"
                        >
                          View
                        </button>

                        {/* Review Button for Dimension Leaders & Coordinators */}
                        {canReviewMov(indicator.dimensionId) && (
                          <button
                            id={`review-mov-btn-${mov.id}`}
                            onClick={() => onReviewMov(mov)}
                            className="p-1.5 text-xs text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-md font-medium"
                            title="Verify & Review"
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

          {/* Section 3: Official Assessment Matrix Calibration */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Official Assessment Matrix Evaluation
                </h3>
                <p className="text-xs text-slate-500">
                  Calibrate the four degrees of manifestation under DepEd Order No. 007, s. 2024
                </p>
              </div>
              {saveSuccess && (
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Assessment Saved
                </span>
              )}
            </div>

            {/* Applicability Override */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Applicability to Quirino High School
                </span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    id="indicator-applicability-toggle"
                    type="checkbox"
                    checked={isApplicable}
                    onChange={(e) => setIsApplicable(e.target.checked)}
                    disabled={!canEdit}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-2 text-xs font-medium text-slate-700">
                    {isApplicable ? 'Applicable' : 'Non-Applicable'}
                  </span>
                </label>
              </div>

              {!isApplicable && (
                <div className="pt-2">
                  <label className="text-[11px] font-bold text-amber-900 block mb-1">
                    Mandatory Non-Applicability Justification (Required for SDO QC Validation):
                  </label>
                  <textarea
                    id="applicability-justification-input"
                    rows={2}
                    value={applicabilityJustification}
                    onChange={(e) => setApplicabilityJustification(e.target.value)}
                    placeholder="State specific school level, program context, or SDO QC directive justifying non-applicability..."
                    className="w-full text-xs p-2.5 border border-amber-300 rounded-lg bg-amber-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Degree of Manifestation Selector */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">
                    Degree of Manifestation (DO 007, s. 2024):
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Pumili ng antas ng pag-iral ng indikasyon sa paaralan. Kusang nagse-save kapag pinindot.
                  </span>
                </div>
                {degreeSaving && (
                  <span className="text-xs font-semibold text-blue-700 animate-pulse flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Sine-save ang calibration...</span>
                  </span>
                )}
              </div>

              {/* View-only or restricted role banner */}
              {!canEdit && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      Naka-lock ang pag-edit: Ang iyong kasalukuyang role ay <strong>{role?.replace('_', ' ')}</strong>.
                      Ang SBM Coordinator, Dimension Leader, at Validator ang may pahintulot mag-calibrate.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchDemoRole('sbm_coordinator')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg whitespace-nowrap shadow-xs text-xs flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Lumipat sa SBM Coordinator / I-unlock</span>
                  </button>
                </div>
              )}

              {/* Real-time saved notification */}
              {degreeSavedMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 font-bold transition-all">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{degreeSavedMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {(
                  [
                    {
                      deg: 'Not Yet Manifested' as DegreeOfManifestation,
                      color: 'bg-rose-50/70 text-rose-900 border-rose-200 hover:bg-rose-100',
                      activeColor: 'bg-rose-700 text-white border-rose-800 ring-2 ring-rose-400 shadow-md',
                      levelNum: 'Antas 0',
                      desc: 'Wala pang sapat na patunay o simula ng implementasyon.'
                    },
                    {
                      deg: 'Rarely Manifested' as DegreeOfManifestation,
                      color: 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100',
                      activeColor: 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 shadow-md',
                      levelNum: 'Antas 1',
                      desc: 'May panimulang ebidensya ngunit hindi palagian o buo.'
                    },
                    {
                      deg: 'Frequently Manifested' as DegreeOfManifestation,
                      color: 'bg-blue-50/70 text-blue-900 border-blue-200 hover:bg-blue-100',
                      activeColor: 'bg-blue-700 text-white border-blue-800 ring-2 ring-blue-400 shadow-md',
                      levelNum: 'Antas 2',
                      desc: 'Regular, napatunayan, at patuloy na isinasagawa sa paaralan.'
                    },
                    {
                      deg: 'Always Manifested' as DegreeOfManifestation,
                      color: 'bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:bg-emerald-100',
                      activeColor: 'bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-400 shadow-md',
                      levelNum: 'Antas 3',
                      desc: 'Pangmatagalan, institutionalized, at may mataas na kalidad.'
                    }
                  ]
                ).map(({ deg, color, activeColor, levelNum, desc }) => {
                  const isSelected = degree === deg;
                  return (
                    <button
                      key={deg}
                      type="button"
                      id={`degree-btn-${deg.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => handleSelectDegree(deg)}
                      disabled={degreeSaving}
                      className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all flex flex-col justify-between ${
                        isSelected ? activeColor : color
                      } cursor-pointer hover:shadow-xs`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              isSelected ? 'text-white/80' : 'text-slate-500'
                            }`}
                          >
                            {levelNum}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <div className="text-sm font-extrabold leading-tight">{deg}</div>
                      </div>
                      <div
                        className={`text-[10px] font-normal mt-2 leading-snug ${
                          isSelected ? 'text-white/90' : 'text-slate-600'
                        }`}
                      >
                        {desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evidence Basis & Improvement Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Evidence Basis / Findings:
                </label>
                <textarea
                  id="evidence-basis-input"
                  rows={3}
                  value={evidenceBasis}
                  onChange={(e) => setEvidenceBasis(e.target.value)}
                  disabled={!canEdit}
                  placeholder="Specify findings, verified MOVs, test ratings, or certificates supporting this rating..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Continuous Improvement Action Plan:
                </label>
                <textarea
                  id="improvement-action-input"
                  rows={3}
                  value={improvementAction}
                  onChange={(e) => setImprovementAction(e.target.value)}
                  disabled={!canEdit}
                  placeholder="Actions, interventions, or technical assistance required to sustain or elevate manifestation..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Person Responsible & Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Person / Office Responsible:
                </label>
                <input
                  id="person-responsible-input"
                  type="text"
                  value={personResponsible}
                  onChange={(e) => setPersonResponsible(e.target.value)}
                  disabled={!canEdit}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Calibration Date:
                </label>
                <input
                  id="target-date-input"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  disabled={!canEdit}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Save Button */}
            {canEdit && (
              <div className="pt-2 flex justify-end">
                <button
                  id="save-self-assessment-btn"
                  type="button"
                  onClick={handleSaveAssessment}
                  disabled={saving}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Assessment...' : 'Save Self-Assessment Record'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col on lg): Metadata, Previous SY Comparison, Comments */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Indicator Overview
            </h4>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">School Year:</span>
                <span className="font-bold text-slate-800">{currentSchoolYear.label}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">Lead Office:</span>
                <span className="font-semibold text-slate-800">{indicator.suggestedLeadOffice}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">Required MOVs:</span>
                <span className="font-bold text-blue-700">{reqItems.length} Checklist Items</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">Review Status:</span>
                {currentRecord?.reviewStatus && (
                  <StatusBadge status={currentRecord.reviewStatus} size="sm" />
                )}
              </div>
              {currentRecord?.approvedBy && (
                <div className="pt-2 text-[11px] text-emerald-800">
                  <span>Approved By: <strong>{currentRecord.approvedBy}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Previous School Year Comparison */}
          {previousSchoolYear && prevRecord && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Previous Year ({previousSchoolYear.label})</span>
                <History className="w-3.5 h-3.5 text-slate-400" />
              </h4>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Manifestation:</span>
                  <DegreeBadge degree={prevRecord.degreeOfManifestation} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status:</span>
                  <StatusBadge status={prevRecord.reviewStatus} size="sm" />
                </div>
                {prevRecord.evidenceBasis && (
                  <p className="text-[11px] text-slate-600 italic pt-1 border-t border-slate-200">
                    "{prevRecord.evidenceBasis}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Review Comments & Thread */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Review Feedback & Thread ({indicatorComments.length})</span>
            </h4>

            <div className="max-h-60 overflow-y-auto space-y-2.5 divide-y divide-slate-100">
              {indicatorComments.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No comments or feedback logged yet.</p>
              ) : (
                indicatorComments.map((comm) => (
                  <div key={comm.id} className="pt-2 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{comm.authorName}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{comm.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handleSendComment} className="pt-2 space-y-2 border-t border-slate-100">
              <textarea
                rows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add feedback, validation note, or question..."
                className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-500 flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={isInternalComment}
                    onChange={(e) => setIsInternalComment(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Internal Staff Only</span>
                </label>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
