import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Calendar,
  Building,
  Edit3,
  X,
  Save
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { exportMatrixToCSV, exportMovIndexToCSV, exportGapAnalysisToCSV } from '../../lib/exportUtils';
import { DegreeBadge } from '../common/DegreeBadge';
import { StatusBadge } from '../common/StatusBadge';
import { DegreeOfManifestation } from '../../types';

export type ReportType =
  | 'executive_summary'
  | 'indicator_matrix'
  | 'mov_master_index'
  | 'gap_analysis'
  | 'dimension_accomplishment'
  | 'manifestation_distribution'
  | 'contributor_submissions'
  | 'overdue_reviews'
  | 'audit_history'
  | 'comparative_progress'
  | 'sdo_validation_index'
  | 'printable_dashboard';

export const ReportsCenterView: React.FC = () => {
  const {
    indicators,
    dimensions,
    indicatorRecords,
    movRecords,
    requiredMovItems,
    currentSchoolYear,
    schoolProfile,
    progressStats,
    auditLogs,
    updateSchoolProfile,
    updateIndicatorAssessment
  } = useSbmData();

  const { userProfile, isSuperAdmin, isSchoolHead, isCoordinator } = useAuth();

  const [selectedReport, setSelectedReport] = useState<ReportType>('executive_summary');
  const [selectedDimension, setSelectedDimension] = useState<number | 'all'>('all');
  const [calibratingIndId, setCalibratingIndId] = useState<number | null>(null);
  const [calibratedSuccessId, setCalibratedSuccessId] = useState<number | null>(null);
  const [isQuickCalibrationActive, setIsQuickCalibrationActive] = useState(true);
  const [manifestationFilter, setManifestationFilter] = useState<DegreeOfManifestation | 'all'>('all');
  
  // Signatory & School Header Editing Modal
  const [isEditingSignatories, setIsEditingSignatories] = useState(false);
  const [isSavingSignatories, setIsSavingSignatories] = useState(false);
  const [signatoryForm, setSignatoryForm] = useState({
    schoolName: schoolProfile?.schoolName || schoolProfile?.name || 'Quirino High School',
    schoolId: schoolProfile?.schoolId || '300539',
    division: schoolProfile?.division || 'Division of City Schools - Quezon City',
    region: schoolProfile?.region || 'National Capital Region (NCR)',
    principalName: schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese',
    schoolHeadTitle: schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV',
    sbmCoordinator: schoolProfile?.sbmCoordinator || 'Mr. Jonathan C. Santos',
    sbmCoordinatorTitle: schoolProfile?.sbmCoordinatorTitle || 'School SBM Coordinator / Master Teacher II',
    divisionValidator: schoolProfile?.divisionValidator || 'Dr. Maria Elena V. Gonzales',
    divisionValidatorTitle: schoolProfile?.divisionValidatorTitle || 'Division SBM Validator / EPS - SDO QC'
  });

  const handleOpenSignatoryEditor = () => {
    setSignatoryForm({
      schoolName: schoolProfile?.schoolName || schoolProfile?.name || 'Quirino High School',
      schoolId: schoolProfile?.schoolId || '300539',
      division: schoolProfile?.division || 'Division of City Schools - Quezon City',
      region: schoolProfile?.region || 'National Capital Region (NCR)',
      principalName: schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese',
      schoolHeadTitle: schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV',
      sbmCoordinator: schoolProfile?.sbmCoordinator || 'Mr. Jonathan C. Santos',
      sbmCoordinatorTitle: schoolProfile?.sbmCoordinatorTitle || 'School SBM Coordinator / Master Teacher II',
      divisionValidator: schoolProfile?.divisionValidator || 'Dr. Maria Elena V. Gonzales',
      divisionValidatorTitle: schoolProfile?.divisionValidatorTitle || 'Division SBM Validator / EPS - SDO QC'
    });
    setIsEditingSignatories(true);
  };

  const handleSaveSignatories = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSignatories(true);
    try {
      await updateSchoolProfile({
        schoolName: signatoryForm.schoolName,
        name: signatoryForm.schoolName,
        schoolId: signatoryForm.schoolId,
        division: signatoryForm.division,
        region: signatoryForm.region,
        principalName: signatoryForm.principalName,
        schoolHead: signatoryForm.principalName,
        schoolHeadTitle: signatoryForm.schoolHeadTitle,
        sbmCoordinator: signatoryForm.sbmCoordinator,
        sbmCoordinatorTitle: signatoryForm.sbmCoordinatorTitle,
        divisionValidator: signatoryForm.divisionValidator,
        divisionValidatorTitle: signatoryForm.divisionValidatorTitle
      });
      setIsEditingSignatories(false);
    } catch (err) {
      console.error('Failed to update signatories:', err);
    } finally {
      setIsSavingSignatories(false);
    }
  };

  const reportOptions: { id: ReportType; title: string; desc: string; format: string }[] = [
    {
      id: 'executive_summary',
      title: '1. SBM Executive Summary Report',
      desc: 'Official high-level SBM performance, compliance rates, and manifestation summary.',
      format: 'Summary & Key Metrics'
    },
    {
      id: 'indicator_matrix',
      title: '2. 42-Indicator Matrix Assessment Report',
      desc: 'Complete table of all 42 indicators with degrees of manifestation and action plans.',
      format: 'Comprehensive Table / CSV'
    },
    {
      id: 'mov_master_index',
      title: '3. MOV Master Repository Index',
      desc: 'Full catalog of all uploaded Means of Verification with version logs and privacy levels.',
      format: 'Detailed Index / CSV'
    },
    {
      id: 'gap_analysis',
      title: '4. Missing MOV Gap Analysis Report',
      desc: 'Targeted compliance list of all required checklist items that are missing.',
      format: 'Actionable Checklist / CSV'
    },
    {
      id: 'dimension_accomplishment',
      title: '5. Dimension-by-Dimension Accomplishment Report',
      desc: 'Progress, approved evidence, and key milestones across the 6 dimensions.',
      format: 'Dimension Breakdown'
    },
    {
      id: 'manifestation_distribution',
      title: '6. Degrees of Manifestation Distribution',
      desc: 'Statistical calibration breakdown of 4 manifestation degrees under DO 007, s. 2024.',
      format: 'Distribution Metrics'
    },
    {
      id: 'contributor_submissions',
      title: '7. Contributor & Lead Office Report',
      desc: 'Submissions mapped to academic departments, coordinators, and committees.',
      format: 'Departmental Breakdown'
    },
    {
      id: 'overdue_reviews',
      title: '8. Overdue Submissions & Pending Reviews',
      desc: 'Tracking items awaiting initial verification or revisions.',
      format: 'Queue Analysis'
    },
    {
      id: 'audit_history',
      title: '9. Complete Audit Trail & Activity Log',
      desc: 'Chronological security log of all uploads, reviews, approvals, and unlocks.',
      format: 'Compliance Audit Log'
    },
    {
      id: 'comparative_progress',
      title: '10. School-Year Comparative Progress Report',
      desc: 'Multi-year comparison between S.Y. 2024-2025 and subsequent school years.',
      format: 'Year-over-Year Matrix'
    },
    {
      id: 'sdo_validation_index',
      title: '11. Validation-Ready Evidence Index for SDO QC',
      desc: 'Formal docket prepared for Division validation teams with sanitized references.',
      format: 'SDO QC Official Docket'
    },
    {
      id: 'printable_dashboard',
      title: '12. Printable SBM Dashboard Report',
      desc: 'Clean, printable summary for SBM Stakeholder assembly and PTA meetings.',
      format: 'Printable Sheet'
    }
  ];

  const handleExportCSV = () => {
    if (selectedReport === 'indicator_matrix') {
      exportMatrixToCSV(indicators, indicatorRecords, currentSchoolYear.id);
    } else if (selectedReport === 'mov_master_index') {
      exportMovIndexToCSV(movRecords, currentSchoolYear.id);
    } else if (selectedReport === 'gap_analysis') {
      exportGapAnalysisToCSV(requiredMovItems, currentSchoolYear.id);
    } else {
      exportMatrixToCSV(indicators, indicatorRecords, currentSchoolYear.id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports-center-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
              Official DepEd Reporting Hub
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentSchoolYear.label}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            SBM Reports & Export Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate 12 official SBM report packages compliant with DepEd Order No. 007, s. 2024 and SDO QC guidelines.
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            id="edit-report-signatories-btn"
            onClick={handleOpenSignatoryEditor}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
            title="Edit School ID, Principal, Coordinators and Signatories"
          >
            <Edit3 className="w-4 h-4 text-amber-600" />
            <span>Edit Signatories & School ID</span>
          </button>
          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Grid: Left (Report Selection Menu), Right (Live Report Document Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Report Selector */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 pt-1 pb-2">
            12 Official Report Formats
          </h3>
          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1">
            {reportOptions.map((opt) => (
              <button
                key={opt.id}
                id={`report-select-${opt.id}`}
                onClick={() => setSelectedReport(opt.id)}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  selectedReport === opt.id
                    ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{opt.title}</div>
                <div className="text-[10px] text-slate-500 mt-1 font-normal line-clamp-2">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Rendered Report Output (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 print:shadow-none print:border-none">
          {/* Official DepEd Header in Report */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
            <p className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              Republic of the Philippines • Department of Education
            </p>
            <p className="text-xs font-bold text-slate-800 uppercase">
              {schoolProfile?.region || 'NATIONAL CAPITAL REGION'} • {schoolProfile?.division || 'SCHOOLS DIVISION OFFICE OF QUEZON CITY'}
            </p>
            <h1 className="text-base font-black text-slate-950 uppercase tracking-tight">
              {(schoolProfile?.schoolName || schoolProfile?.name || 'QUIRINO HIGH SCHOOL').toUpperCase()} (SCHOOL ID: {schoolProfile?.schoolId || '300539'})
            </h1>
            <p className="text-xs font-bold text-blue-800">
              SCHOOL-BASED MANAGEMENT (SBM) MONITORING, ARCHIVING, REPOSITORY, AND TRACKING PORTAL
            </p>
            <p className="text-[11px] font-semibold text-slate-500">
              Academic Year: {currentSchoolYear.label} • Policy: DepEd Order No. 007, s. 2024
            </p>
          </div>

          {/* Report Content Body based on selected report */}
          {selectedReport === 'executive_summary' && (
            <div className="space-y-5 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                Executive SBM Performance Summary
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Indicators</span>
                  <span className="text-xl font-black text-slate-900">{progressStats.totalIndicators}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Applicable</span>
                  <span className="text-xl font-black text-blue-700">{progressStats.applicableIndicators}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-800 block text-[10px] uppercase font-bold">Evidence Rate</span>
                  <span className="text-xl font-black text-emerald-700">{progressStats.overallEvidenceCompletionPct}%</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-amber-800 block text-[10px] uppercase font-bold">Missing Required MOVs</span>
                  <span className="text-xl font-black text-amber-700">{progressStats.missingRequiredMovs}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">Dimensions Accomplishment Breakdown:</h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {progressStats.dimensionProgress.map((d) => (
                    <div key={d.dimensionId} className="p-3 flex items-center justify-between bg-white">
                      <div>
                        <span className="font-bold text-slate-800">Dimension {d.dimensionId}: {d.name}</span>
                        <div className="text-[11px] text-slate-500">
                          {d.completedIndicators} of {d.totalIndicators} indicators approved
                        </div>
                      </div>
                      <span className="font-bold text-blue-700">{d.completionPercentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'indicator_matrix' && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    42-Indicator Evaluation Matrix Table
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    I-calibrate ang antas ng pag-iral (Degree of Manifestation) alinsunod sa DepEd Order No. 007, s. 2024.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-[11px] font-semibold text-slate-600 flex items-center space-x-1.5 cursor-pointer bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      checked={isQuickCalibrationActive}
                      onChange={(e) => setIsQuickCalibrationActive(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Editable Calibration Mode</span>
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 w-16">#</th>
                      <th className="p-2.5">Official Statement</th>
                      <th className="p-2.5 min-w-[210px]">Degree of Manifestation</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {indicators
                      .filter((ind) => selectedDimension === 'all' || ind.dimensionId === selectedDimension)
                      .map((ind) => {
                        const rec = indicatorRecords.find(
                          (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === ind.id
                        );
                        return (
                          <tr key={ind.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-2.5 font-bold">Ind. {ind.id}</td>
                            <td className="p-2.5 max-w-xs">
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                                Dim {ind.dimensionId}
                              </span>
                              {ind.officialWording}
                            </td>
                            <td className="p-2.5">
                              {isQuickCalibrationActive ? (
                                <div className="flex items-center space-x-2">
                                  <select
                                    id={`report-matrix-deg-${ind.id}`}
                                    value={rec?.degreeOfManifestation || 'Frequently Manifested'}
                                    disabled={calibratingIndId === ind.id}
                                    onChange={async (e) => {
                                      const newDeg = e.target.value as DegreeOfManifestation;
                                      setCalibratingIndId(ind.id);
                                      try {
                                        await updateIndicatorAssessment(ind.id, { degreeOfManifestation: newDeg });
                                        setCalibratedSuccessId(ind.id);
                                        setTimeout(() => setCalibratedSuccessId((prev) => (prev === ind.id ? null : prev)), 3000);
                                      } catch (err: any) {
                                        alert('Error saving degree of manifestation: ' + err.message);
                                      } finally {
                                        setCalibratingIndId(null);
                                      }
                                    }}
                                    className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border cursor-pointer transition-all shadow-2xs ${
                                      rec?.degreeOfManifestation === 'Always Manifested'
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                                        : rec?.degreeOfManifestation === 'Frequently Manifested'
                                        ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                                        : rec?.degreeOfManifestation === 'Rarely Manifested'
                                        ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                        : 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100'
                                    }`}
                                  >
                                    <option value="Always Manifested">Always Manifested</option>
                                    <option value="Frequently Manifested">Frequently Manifested</option>
                                    <option value="Rarely Manifested">Rarely Manifested</option>
                                    <option value="Not Yet Manifested">Not Yet Manifested</option>
                                  </select>
                                  {calibratingIndId === ind.id && (
                                    <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin flex-shrink-0" />
                                  )}
                                  {calibratedSuccessId === ind.id && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                  )}
                                </div>
                              ) : (
                                <DegreeBadge degree={rec?.degreeOfManifestation} size="sm" />
                              )}
                            </td>
                            <td className="p-2.5">
                              <StatusBadge status={rec?.reviewStatus || 'draft'} size="sm" />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === 'manifestation_distribution' && (
            <div className="space-y-6 text-xs">
              <div className="border-b pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Degrees of Manifestation Statistical Distribution & Calibration Matrix
                </h3>
                <p className="text-[11px] text-slate-500">
                  Compliant with DepEd Order No. 007, s. 2024. You can calibrate and review each degree of manifestation directly in the matrix table below.
                </p>
              </div>

              {/* 4 Manifestation Level Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    deg: 'Always Manifested' as DegreeOfManifestation,
                    level: 'Antas 3',
                    count: progressStats.degreeDistribution['Always Manifested'] || 0,
                    bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
                    pill: 'bg-emerald-700 text-white',
                    desc: 'Fully institutionalized and sustainable high performance.'
                  },
                  {
                    deg: 'Frequently Manifested' as DegreeOfManifestation,
                    level: 'Antas 2',
                    count: progressStats.degreeDistribution['Frequently Manifested'] || 0,
                    bg: 'bg-blue-50 border-blue-300 text-blue-950',
                    pill: 'bg-blue-700 text-white',
                    desc: 'Regularly practiced with verified MOV records.'
                  },
                  {
                    deg: 'Rarely Manifested' as DegreeOfManifestation,
                    level: 'Antas 1',
                    count: progressStats.degreeDistribution['Rarely Manifested'] || 0,
                    bg: 'bg-amber-50 border-amber-300 text-amber-950',
                    pill: 'bg-amber-600 text-white',
                    desc: 'Emerging implementation; technical assistance needed.'
                  },
                  {
                    deg: 'Not Yet Manifested' as DegreeOfManifestation,
                    level: 'Antas 0',
                    count: progressStats.degreeDistribution['Not Yet Manifested'] || 0,
                    bg: 'bg-rose-50 border-rose-300 text-rose-950',
                    pill: 'bg-rose-700 text-white',
                    desc: 'No substantive baseline evidence submitted yet.'
                  }
                ].map((stat) => {
                  const pct = Math.round((stat.count / indicators.length) * 100);
                  const isFiltered = manifestationFilter === stat.deg;
                  return (
                    <div
                      key={stat.deg}
                      onClick={() => setManifestationFilter(isFiltered ? 'all' : stat.deg)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${stat.bg} ${
                        isFiltered ? 'ring-2 ring-blue-600 shadow-md' : 'hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${stat.pill}`}>
                          {stat.level}
                        </span>
                        <span className="text-xl font-black">{stat.count} / {indicators.length}</span>
                      </div>
                      <div className="font-bold text-xs mb-1">{stat.deg}</div>
                      <div className="text-[11px] opacity-80 mb-2">{stat.desc}</div>
                      <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-current h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-right text-[10px] font-bold mt-1 opacity-75">{pct}% of indicators</div>
                    </div>
                  );
                })}
              </div>

              {/* Stacked Progress Bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Overall SBM Manifestation Calibration Breakdown</span>
                  <span>{indicators.length} Total Official Indicators</span>
                </div>
                <div className="h-4 w-full flex rounded-full overflow-hidden shadow-inner bg-slate-200">
                  <div
                    style={{ width: `${Math.round(((progressStats.degreeDistribution['Always Manifested'] || 0) / indicators.length) * 100)}%` }}
                    className="bg-emerald-600 h-full"
                    title={`Always Manifested: ${progressStats.degreeDistribution['Always Manifested'] || 0}`}
                  />
                  <div
                    style={{ width: `${Math.round(((progressStats.degreeDistribution['Frequently Manifested'] || 0) / indicators.length) * 100)}%` }}
                    className="bg-blue-600 h-full"
                    title={`Frequently Manifested: ${progressStats.degreeDistribution['Frequently Manifested'] || 0}`}
                  />
                  <div
                    style={{ width: `${Math.round(((progressStats.degreeDistribution['Rarely Manifested'] || 0) / indicators.length) * 100)}%` }}
                    className="bg-amber-500 h-full"
                    title={`Rarely Manifested: ${progressStats.degreeDistribution['Rarely Manifested'] || 0}`}
                  />
                  <div
                    style={{ width: `${Math.round(((progressStats.degreeDistribution['Not Yet Manifested'] || 0) / indicators.length) * 100)}%` }}
                    className="bg-rose-500 h-full"
                    title={`Not Yet Manifested: ${progressStats.degreeDistribution['Not Yet Manifested'] || 0}`}
                  />
                </div>
              </div>

              {/* Calibrate Indicators List */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-bold text-slate-800">
                    Calibrate Indicators ({manifestationFilter === 'all' ? 'All Degrees' : manifestationFilter})
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-500">Filter by Degree:</span>
                    <select
                      value={manifestationFilter}
                      onChange={(e) => setManifestationFilter(e.target.value as any)}
                      className="p-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium"
                    >
                      <option value="all">All Degrees of Manifestation</option>
                      <option value="Always Manifested">Always Manifested</option>
                      <option value="Frequently Manifested">Frequently Manifested</option>
                      <option value="Rarely Manifested">Rarely Manifested</option>
                      <option value="Not Yet Manifested">Not Yet Manifested</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 w-16">Ind #</th>
                        <th className="p-2.5">Indicator Official Statement</th>
                        <th className="p-2.5 min-w-[210px]">Degree of Manifestation (Editable)</th>
                        <th className="p-2.5">Action Plan / Findings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {indicators
                        .filter((ind) => {
                          const rec = indicatorRecords.find(
                            (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === ind.id
                          );
                          if (selectedDimension !== 'all' && ind.dimensionId !== selectedDimension) return false;
                          if (manifestationFilter !== 'all' && rec?.degreeOfManifestation !== manifestationFilter) return false;
                          return true;
                        })
                        .map((ind) => {
                          const rec = indicatorRecords.find(
                            (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === ind.id
                          );
                          return (
                            <tr key={ind.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-2.5 font-bold">Ind. {ind.id}</td>
                              <td className="p-2.5 max-w-sm">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                                  Dim {ind.dimensionId}
                                </span>
                                {ind.officialWording}
                              </td>
                              <td className="p-2.5">
                                <div className="flex items-center space-x-2">
                                  <select
                                    id={`dist-matrix-deg-${ind.id}`}
                                    value={rec?.degreeOfManifestation || 'Frequently Manifested'}
                                    disabled={calibratingIndId === ind.id}
                                    onChange={async (e) => {
                                      const newDeg = e.target.value as DegreeOfManifestation;
                                      setCalibratingIndId(ind.id);
                                      try {
                                        await updateIndicatorAssessment(ind.id, { degreeOfManifestation: newDeg });
                                        setCalibratedSuccessId(ind.id);
                                        setTimeout(() => setCalibratedSuccessId((prev) => (prev === ind.id ? null : prev)), 3000);
                                      } catch (err: any) {
                                        alert('Error saving degree of manifestation: ' + err.message);
                                      } finally {
                                        setCalibratingIndId(null);
                                      }
                                    }}
                                    className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border cursor-pointer transition-all shadow-2xs ${
                                      rec?.degreeOfManifestation === 'Always Manifested'
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                                        : rec?.degreeOfManifestation === 'Frequently Manifested'
                                        ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                                        : rec?.degreeOfManifestation === 'Rarely Manifested'
                                        ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                        : 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100'
                                    }`}
                                  >
                                    <option value="Always Manifested">Always Manifested</option>
                                    <option value="Frequently Manifested">Frequently Manifested</option>
                                    <option value="Rarely Manifested">Rarely Manifested</option>
                                    <option value="Not Yet Manifested">Not Yet Manifested</option>
                                  </select>
                                  {calibratingIndId === ind.id && (
                                    <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin flex-shrink-0" />
                                  )}
                                  {calibratedSuccessId === ind.id && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                  )}
                                </div>
                              </td>
                              <td className="p-2.5 max-w-xs text-slate-600 text-[11px]">
                                {rec?.evidenceBasis || rec?.improvementAction ? (
                                  <span>{rec.evidenceBasis || rec.improvementAction}</span>
                                ) : (
                                  <span className="italic text-slate-400">Walang nakasaad na tala</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'gap_analysis' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                Missing MOV Compliance Gap Analysis
              </h3>
              <div className="space-y-2">
                {requiredMovItems
                  .filter((r) => r.schoolYearId === currentSchoolYear.id && r.status === 'missing')
                  .map((item) => (
                    <div key={item.id} className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex justify-between">
                      <div>
                        <div className="font-bold text-rose-950">[{item.code}] {item.title}</div>
                        <div className="text-[11px] text-rose-800">
                          Dimension {item.dimensionId} • Indicator {item.indicatorNumber}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                        Missing
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {selectedReport === 'mov_master_index' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                MOV Evidence Master Index Catalog ({movRecords.length} Files)
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Title</th>
                      <th className="p-2.5">Ind #</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Uploader</th>
                      <th className="p-2.5">Version</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {movRecords.filter((m) => m.schoolYearId === currentSchoolYear.id).map((m) => (
                      <tr key={m.id}>
                        <td className="p-2.5 font-semibold text-slate-900">{m.title}</td>
                        <td className="p-2.5">Ind. {m.indicatorNumber}</td>
                        <td className="p-2.5"><StatusBadge status={m.submissionStatus} size="sm" /></td>
                        <td className="p-2.5">{m.uploaderName}</td>
                        <td className="p-2.5 font-mono">v{m.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit History and other report types */}
          {selectedReport === 'audit_history' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
                System Audit Trail & Access Logs ({(auditLogs || []).length} Events)
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
                {(auditLogs || []).slice(0, 10).map((log) => {
                  let formattedDate = 'N/A';
                  try {
                    formattedDate = log && log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A';
                  } catch {
                    formattedDate = 'N/A';
                  }
                  if (!log) return null;
                  return (
                    <div key={log.id} className="p-3">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{log.action}</span>
                        <span className="text-[10px] text-slate-400">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        User: {log.actorName} ({log.actorEmail}) • Role: {log.actorRole}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Signatures block for official printout */}
          <div className="pt-8 border-t-2 border-slate-900 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
              <div>
                <div className="h-10"></div>
                <div className="font-bold text-slate-900 border-t border-slate-400 pt-1 uppercase tracking-wide">
                  {schoolProfile?.sbmCoordinator || 'Mr. Jonathan C. Santos'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {schoolProfile?.sbmCoordinatorTitle || 'School SBM Coordinator / Master Teacher II'}
                </div>
              </div>

              <div>
                <div className="h-10"></div>
                <div className="font-bold text-slate-900 border-t border-slate-400 pt-1 uppercase tracking-wide">
                  {schoolProfile?.principalName || schoolProfile?.schoolHead || 'Dr. Lourdes R. Sese'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {schoolProfile?.schoolHeadTitle || 'Secondary School Principal IV'}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="h-10"></div>
                <div className="font-bold text-slate-900 border-t border-slate-400 pt-1 uppercase tracking-wide">
                  {schoolProfile?.divisionValidator || 'Dr. Maria Elena V. Gonzales'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {schoolProfile?.divisionValidatorTitle || 'Division SBM Validator / EPS - SDO QC'}
                </div>
              </div>
            </div>

            <div className="flex justify-end print:hidden pt-2">
              <button
                id="quick-edit-signatories-print-btn"
                type="button"
                onClick={handleOpenSignatoryEditor}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                <span>Edit Official Report Signatories</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Signatories & School ID Modal */}
      {isEditingSignatories && (
        <div
          id="signatories-edit-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Report Signatories & School Credentials
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update official signatories and school credentials for reports, certificates, and printouts.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingSignatories(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSignatories} className="space-y-4 text-xs">
              {/* Section 1: School Identity */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  1. Official School Identification
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">School Name</label>
                    <input
                      type="text"
                      value={signatoryForm.schoolName}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, schoolName: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">DepEd School ID</label>
                    <input
                      type="text"
                      value={signatoryForm.schoolId}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, schoolId: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Schools Division Office (SDO)</label>
                    <input
                      type="text"
                      value={signatoryForm.division}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, division: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">DepEd Region</label>
                    <input
                      type="text"
                      value={signatoryForm.region}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, region: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Signatories */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                  2. Official Report Signatories
                </span>

                {/* SBM Coordinator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">SBM Coordinator Name</label>
                    <input
                      type="text"
                      value={signatoryForm.sbmCoordinator}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, sbmCoordinator: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">SBM Coordinator Title / Designation</label>
                    <input
                      type="text"
                      value={signatoryForm.sbmCoordinatorTitle}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, sbmCoordinatorTitle: e.target.value })}
                      required
                      placeholder="e.g. School SBM Coordinator / Master Teacher II"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Principal / School Head */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Principal / School Head Name</label>
                    <input
                      type="text"
                      value={signatoryForm.principalName}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, principalName: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Principal Position Title / Designation</label>
                    <input
                      type="text"
                      value={signatoryForm.schoolHeadTitle}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, schoolHeadTitle: e.target.value })}
                      required
                      placeholder="e.g. Secondary School Principal IV"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Division SBM Validator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Division SBM Validator Name</label>
                    <input
                      type="text"
                      value={signatoryForm.divisionValidator}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, divisionValidator: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Validator Position Title / Office</label>
                    <input
                      type="text"
                      value={signatoryForm.divisionValidatorTitle}
                      onChange={(e) => setSignatoryForm({ ...signatoryForm, divisionValidatorTitle: e.target.value })}
                      required
                      placeholder="e.g. Division SBM Validator / EPS - SDO QC"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSignatories(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSignatories}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSignatories ? 'Saving Changes...' : 'Save & Update Signatories'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
