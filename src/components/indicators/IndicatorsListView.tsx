import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { DegreeBadge } from '../common/DegreeBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidentialityBadge } from '../common/ConfidentialityBadge';
import { DegreeOfManifestation, SubmissionStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface IndicatorsListViewProps {
  onSelectIndicator: (indicatorNumber: number) => void;
}

export const IndicatorsListView: React.FC<IndicatorsListViewProps> = ({ onSelectIndicator }) => {
  const {
    indicators,
    dimensions,
    indicatorRecords,
    movRecords,
    currentSchoolYear,
    updateIndicatorAssessment
  } = useSbmData();

  const { canEditIndicator, role } = useAuth();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<number | 'all'>('all');
  const [selectedDegree, setSelectedDegree] = useState<DegreeOfManifestation | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus | 'all'>('all');

  const filteredIndicators = useMemo(() => {
    return indicators.filter((ind) => {
      const rec = indicatorRecords.find(
        (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === ind.id
      );

      // Dimension Filter
      if (selectedDimension !== 'all' && ind.dimensionId !== selectedDimension) return false;

      // Degree Filter
      if (selectedDegree !== 'all' && rec?.degreeOfManifestation !== selectedDegree) return false;

      // Status Filter
      if (selectedStatus !== 'all' && rec?.reviewStatus !== selectedStatus) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const dim = dimensions.find((d) => d.id === ind.dimensionId);
        const matchNumber = ind.id.toString() === q || `indicator ${ind.id}`.includes(q);
        const matchText = ind.officialWording.toLowerCase().includes(q);
        const matchLead = ind.suggestedLeadOffice?.toLowerCase().includes(q);
        const matchDim = dim?.name.toLowerCase().includes(q);
        if (!matchNumber && !matchText && !matchLead && !matchDim) return false;
      }

      return true;
    });
  }, [
    indicators,
    indicatorRecords,
    currentSchoolYear.id,
    selectedDimension,
    selectedDegree,
    selectedStatus,
    searchQuery,
    dimensions
  ]);

  return (
    <div id="indicators-list-view" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
              Official Master List
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentSchoolYear.label}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            42 Official SBM Indicators
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full compliance directory under DepEd Order No. 007, s. 2024. Filter and review indicators directly.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              id="indicators-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search indicator # or text..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dimension Filter */}
          <div>
            <select
              id="filter-by-dimension-select"
              value={selectedDimension}
              onChange={(e) =>
                setSelectedDimension(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="all">All 6 Dimensions</option>
              {dimensions.map((d) => (
                <option key={d.id} value={d.id}>
                  Dim {d.id}: {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Degree Filter */}
          <div>
            <select
              id="filter-by-degree-select"
              value={selectedDegree}
              onChange={(e) =>
                setSelectedDegree(e.target.value === 'all' ? 'all' : (e.target.value as DegreeOfManifestation))
              }
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="all">All Degrees of Manifestation</option>
              <option value="Always Manifested">Always Manifested</option>
              <option value="Frequently Manifested">Frequently Manifested</option>
              <option value="Rarely Manifested">Rarely Manifested</option>
              <option value="Not Yet Manifested">Not Yet Manifested</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="filter-by-status-select"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value === 'all' ? 'all' : (e.target.value as SubmissionStatus))
              }
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="all">All Review Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="needs_revision">Needs Revision</option>
              <option value="verified">Verified</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1 border-t border-slate-100">
          <span>
            Showing <strong>{filteredIndicators.length}</strong> of 42 official indicators
          </span>
          {(searchQuery || selectedDimension !== 'all' || selectedDegree !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDimension('all');
                setSelectedDegree('all');
                setSelectedStatus('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Indicators List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredIndicators.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">No matching indicators found.</p>
              <p className="text-xs text-slate-400 mt-1">Try clearing your search query or filters.</p>
            </div>
          ) : (
            filteredIndicators.map((ind) => {
              const rec = indicatorRecords.find(
                (r) => r.schoolYearId === currentSchoolYear.id && r.indicatorNumber === ind.id
              );
              const dim = dimensions.find((d) => d.id === ind.dimensionId);
              const uploadedCount = movRecords.filter(
                (m) =>
                  m.schoolYearId === currentSchoolYear.id &&
                  m.indicatorNumber === ind.id &&
                  !m.isArchived
              ).length;

              return (
                <div
                  key={ind.id}
                  id={`indicator-list-row-${ind.id}`}
                  onClick={() => onSelectIndicator(ind.id)}
                  className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-900 text-amber-300 font-black text-xs">
                        Indicator {ind.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Dimension {ind.dimensionId}: {dim?.name}
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
                      <span>MOVs: <strong className="text-blue-700">{uploadedCount} evidence files</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col items-end space-y-1">
                      {canEditIndicator(ind.id, ind.dimensionId) ? (
                        <div className="relative group/calib">
                          <select
                            id={`quick-degree-select-${ind.id}`}
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
                    <button
                      type="button"
                      onClick={() => onSelectIndicator(ind.id)}
                      className="p-1 rounded-lg hover:bg-blue-100/70 text-slate-400 hover:text-blue-700 transition-colors"
                      title="Open Full Indicator Workspace"
                    >
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
