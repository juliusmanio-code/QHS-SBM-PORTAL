import React from 'react';
import {
  Layers,
  ChevronRight,
  User,
  AlertTriangle,
  CheckCircle2,
  FileText,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { DegreeBadge } from '../common/DegreeBadge';

interface DimensionsListViewProps {
  onSelectDimension: (dimensionId: number) => void;
}

export const DimensionsListView: React.FC<DimensionsListViewProps> = ({ onSelectDimension }) => {
  const { dimensions, progressStats, currentSchoolYear } = useSbmData();

  return (
    <div id="dimensions-list-view" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-semibold">{currentSchoolYear.label}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Official SBM Dimensions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a dimension to inspect its official indicators, verify Means of Verification (MOVs), and calibrate manifestation ratings.
          </p>
        </div>
      </div>

      {/* 6 Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dimensions.map((dim) => {
          const dimStats = progressStats.dimensionProgress.find((p) => p.dimensionId === dim.id);
          const completionPct = dimStats?.completionPercentage || 0;
          const missingCount = dimStats?.missingMovsCount || 0;

          return (
            <div
              key={dim.id}
              id={`dimension-card-${dim.id}`}
              onClick={() => onSelectDimension(dim.id)}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-6 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-900 text-amber-300 font-black text-xs">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>DIMENSION {dim.id}</span>
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    {completionPct}% Complete
                  </span>
                </div>

                {/* Dimension Name */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {dim.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  "{dim.officialDescription}"
                </p>
              </div>

              {/* Stats & Progress Bar */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Evidence Progress</span>
                    <span className="font-bold text-slate-700">{completionPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Indicators</span>
                    <span className="font-bold text-slate-800">
                      {dimStats?.totalIndicators || 0} Official
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Approved</span>
                    <span className="font-bold text-emerald-700">
                      {dimStats?.completedIndicators || 0} Complete
                    </span>
                  </div>
                </div>

                {/* Missing warning or check */}
                <div className="flex items-center justify-between text-xs pt-1">
                  {missingCount > 0 ? (
                    <span className="text-amber-700 font-semibold flex items-center text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                      {missingCount} missing MOVs
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      All MOVs Accounted
                    </span>
                  )}

                  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Explore <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
