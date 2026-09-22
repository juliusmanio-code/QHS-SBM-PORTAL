import React, { useState } from 'react';
import {
  ArrowLeft,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronRight,
  ShieldAlert,
  User,
  Clock
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DegreeBadge } from '../common/DegreeBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidentialityBadge } from '../common/ConfidentialityBadge';
import { DegreeOfManifestation } from '../../types';

interface DimensionDetailViewProps {
  dimensionId: number;
  onBack: () => void;
  onSelectIndicator: (indicatorNumber: number) => void;
}

export const DimensionDetailView: React.FC<DimensionDetailViewProps> = ({
  dimensionId,
  onBack,
  onSelectIndicator
}) => {
  const {
    dimensions,
    indicators,
    indicatorRecords,
    requiredMovItems,
    movRecords,
    currentSchoolYear,
    updateIndicatorAssessment
  } = useSbmData();
  const { canEditIndicator } = useAuth();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const dimension = dimensions.find((d) => d.id === dimensionId) || dimensions[0];
  const dimIndicators = indicators.filter((i) => i.dimensionId === dimensionId);

  return (
    <div id="dimension-detail-view" className="space-y-6">
      {/* Top Navigation */}
      <button
        id="back-to-dimensions-btn"
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All 6 Dimensions</span>
      </button>

      {/* Dimension Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="px-3 py-1 rounded-lg bg-blue-900 text-amber-300 font-black text-xs">
              DIMENSION {dimension.id}
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentSchoolYear.label}</span>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {dimIndicators.length} Official Indicators
          </span>
        </div>

        <h2 className="text-xl font-black text-slate-900">{dimension.name}</h2>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 italic leading-relaxed">
          "{dimension.officialDescription}"
        </div>
      </div>

      {/* Indicators Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Official Indicators in Dimension {dimension.id} (DO 007, s. 2024)
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Click any indicator to manage MOVs and ratings
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {dimIndicators.map((ind) => {
            const rec = indicatorRecords.find(
              (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === ind.id
            );
            const reqItems = requiredMovItems.filter(
              (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === ind.id
            );
            const uploadedMovs = movRecords.filter(
              (m) =>
                m.schoolYearId === currentSchoolYear.id &&
                m.indicatorNumber === ind.id &&
                !m.isArchived
            );
            const missingCount = reqItems.filter((r) => r.status === 'missing').length;

            return (
              <div
                key={ind.id}
                id={`dimension-indicator-row-${ind.id}`}
                onClick={() => onSelectIndicator(ind.id)}
                className="p-5 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 font-black text-xs">
                      Indicator {ind.id}
                    </span>
                    <ConfidentialityBadge level={ind.defaultConfidentiality} size="sm" />
                    {rec?.isApplicable === false && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                        Non-Applicable (Justified)
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                    {ind.officialWording}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Lead: <strong className="text-slate-700">{ind.suggestedLeadOffice || 'Department Head'}</strong></span>
                    <span>•</span>
                    <span>MOVs: <strong className="text-blue-700">{uploadedMovs.length} uploaded</strong></span>
                    {missingCount > 0 ? (
                      <>
                        <span>•</span>
                        <span className="text-amber-700 font-medium">⚠️ {missingCount} missing required items</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col items-end space-y-1">
                    {canEditIndicator(ind.id, ind.dimensionId) ? (
                      <div className="relative">
                        <select
                          id={`dim-degree-select-${ind.id}`}
                          value={rec?.degreeOfManifestation || 'Frequently Manifested'}
                          disabled={updatingId === ind.id}
                          onChange={async (e) => {
                            const newDeg = e.target.value as DegreeOfManifestation;
                            setUpdatingId(ind.id);
                            try {
                              await updateIndicatorAssessment(ind.id, { degreeOfManifestation: newDeg });
                            } finally {
                              setUpdatingId(null);
                            }
                          }}
                          title="Quick Calibrate Manifestation Degree"
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
                      </div>
                    ) : (
                      <DegreeBadge degree={rec?.degreeOfManifestation} size="sm" />
                    )}
                    {rec?.reviewStatus && <StatusBadge status={rec.reviewStatus} size="sm" />}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
