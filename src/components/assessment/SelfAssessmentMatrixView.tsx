import React, { useState } from 'react';
import {
  ClipboardList,
  Save,
  CheckCircle2,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Lock,
  Unlock,
  Clock
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DegreeBadge } from '../common/DegreeBadge';
import { StatusBadge } from '../common/StatusBadge';
import { DegreeOfManifestation } from '../../types';

interface SelfAssessmentMatrixViewProps {
  onSelectIndicator: (indicatorNumber: number) => void;
}

export const SelfAssessmentMatrixView: React.FC<SelfAssessmentMatrixViewProps> = ({
  onSelectIndicator
}) => {
  const {
    indicators,
    dimensions,
    indicatorRecords,
    currentSchoolYear,
    updateIndicatorAssessment,
    progressStats
  } = useSbmData();

  const { canEditIndicator, role, switchDemoRole } = useAuth();

  const [selectedDimension, setSelectedDimension] = useState<number | 'all'>('all');
  const [selectedDegree, setSelectedDegree] = useState<DegreeOfManifestation | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savingIndId, setSavingIndId] = useState<number | null>(null);
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<number | null>(null);

  const anyCanEdit = indicators.some((ind) => canEditIndicator(ind.id, ind.dimensionId));

  const handleQuickDegreeChange = async (
    indicatorNumber: number,
    dimensionId: number,
    newDegree: DegreeOfManifestation
  ) => {
    if (!canEditIndicator(indicatorNumber, dimensionId)) {
      switchDemoRole('sbm_coordinator');
    }

    setSavingIndId(indicatorNumber);
    try {
      await updateIndicatorAssessment(indicatorNumber, {
        degreeOfManifestation: newDegree
      });
      setRecentlyUpdatedId(indicatorNumber);
      setTimeout(() => {
        setRecentlyUpdatedId((prev) => (prev === indicatorNumber ? null : prev));
      }, 3000);
    } catch (err) {
      alert('Error updating manifestation degree: ' + err);
    } finally {
      setSavingIndId(null);
    }
  };

  const filteredIndicators = indicators.filter((ind) => {
    const rec = indicatorRecords.find(
      (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === ind.id
    );

    if (selectedDimension !== 'all' && ind.dimensionId !== selectedDimension) return false;
    if (selectedDegree !== 'all' && rec?.degreeOfManifestation !== selectedDegree) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = ind.id.toString() === q || `indicator ${ind.id}`.includes(q);
      const matchText = ind.officialWording.toLowerCase().includes(q);
      if (!matchNum && !matchText) return false;
    }

    return true;
  });

  return (
    <div id="assessment-matrix-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
              DepEd Order No. 007, s. 2024
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentSchoolYear.label}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            42-Indicator SBM Assessment Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrate degrees of manifestation, evidence basis, and continuous improvement action plans.
          </p>
        </div>

        {/* Degree summary pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
            Always: {progressStats.degreeDistribution['Always Manifested']}
          </div>
          <div className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg font-bold">
            Frequently: {progressStats.degreeDistribution['Frequently Manifested']}
          </div>
          <div className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-bold">
            Rarely: {progressStats.degreeDistribution['Rarely Manifested']}
          </div>
          <div className="bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg font-bold">
            Not Yet: {progressStats.degreeDistribution['Not Yet Manifested']}
          </div>
        </div>
      </div>

      {/* Role advisory banner if editing is restricted */}
      {!anyCanEdit && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Naka-lock ang pag-edit ng matrix: Ang iyong role ay <strong>{role?.replace('_', ' ')}</strong>.
              Ang SBM Coordinator, Dimension Leader, at Validator ang may pahintulot mag-calibrate ng degrees.
            </span>
          </div>
          <button
            type="button"
            onClick={() => switchDemoRole('sbm_coordinator')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl whitespace-nowrap shadow-xs text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>I-unlock / Lumipat sa SBM Coordinator</span>
          </button>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="matrix-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indicator # or text..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            id="matrix-dimension-select"
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

        <div>
          <select
            id="matrix-degree-select"
            value={selectedDegree}
            onChange={(e) =>
              setSelectedDegree(
                e.target.value === 'all' ? 'all' : (e.target.value as DegreeOfManifestation)
              )
            }
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
          >
            <option value="all">All Degrees of Manifestation</option>
            <option value="Always Manifested">Always Manifested</option>
            <option value="Frequently Manifested">Frequently Manifested</option>
            <option value="Rarely Manifested">Rarely Manifested</option>
            <option value="Not Yet Manifested">Not Yet Manifested</option>
          </select>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Ind #</th>
                <th className="py-3.5 px-4 w-1/3">Official Indicator Statement</th>
                <th className="py-3.5 px-4">Degree of Manifestation (DO 007, s. 2024)</th>
                <th className="py-3.5 px-4">Evidence Findings</th>
                <th className="py-3.5 px-4">Improvement Action</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIndicators.map((ind) => {
                const rec = indicatorRecords.find(
                  (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === ind.id
                );
                const canEdit = canEditIndicator(ind.id, ind.dimensionId);

                return (
                  <tr key={ind.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-900 text-amber-300 font-black text-xs">
                        {ind.id}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Dimension {ind.dimensionId}
                        </span>
                        <p className="font-semibold text-slate-900 leading-snug">
                          {ind.officialWording}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5 min-w-[190px]">
                        <select
                          id={`matrix-degree-select-${ind.id}`}
                          value={rec?.degreeOfManifestation || 'Frequently Manifested'}
                          disabled={savingIndId === ind.id}
                          onChange={(e) =>
                            handleQuickDegreeChange(
                              ind.id,
                              ind.dimensionId,
                              e.target.value as DegreeOfManifestation
                            )
                          }
                          title="I-calibrate ang Degree of Manifestation"
                          className={`w-full text-xs font-bold p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                            rec?.degreeOfManifestation === 'Always Manifested'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : rec?.degreeOfManifestation === 'Frequently Manifested'
                              ? 'bg-blue-50 text-blue-900 border-blue-300'
                              : rec?.degreeOfManifestation === 'Rarely Manifested'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-rose-50 text-rose-900 border-rose-300'
                          } ${!canEdit ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-xs focus:ring-2 focus:ring-blue-500'}`}
                        >
                          <option value="Always Manifested">Always Manifested</option>
                          <option value="Frequently Manifested">Frequently Manifested</option>
                          <option value="Rarely Manifested">Rarely Manifested</option>
                          <option value="Not Yet Manifested">Not Yet Manifested</option>
                        </select>
                        <div className="flex items-center justify-between text-[10px]">
                          {savingIndId === ind.id ? (
                            <span className="text-blue-600 font-semibold animate-pulse flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Sine-save...</span>
                            </span>
                          ) : recentlyUpdatedId === ind.id ? (
                            <span className="text-emerald-700 font-bold flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>✓ Na-save!</span>
                            </span>
                          ) : !canEdit ? (
                            <span className="text-amber-700 flex items-center space-x-1">
                              <Lock className="w-3 h-3 text-amber-600" />
                              <span>Naka-lock (View-only)</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">Piliin upang i-calibrate</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-600 line-clamp-2 italic">
                        {rec?.evidenceBasis || 'No evidence findings recorded yet.'}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-600 line-clamp-2">
                        {rec?.improvementAction || 'No action plan recorded yet.'}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        id={`open-matrix-detail-${ind.id}`}
                        onClick={() => onSelectIndicator(ind.id)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors inline-flex items-center space-x-1"
                      >
                        <span>Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
