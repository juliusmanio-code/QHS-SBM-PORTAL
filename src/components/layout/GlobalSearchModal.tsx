import React, { useState, useMemo } from 'react';
import { Search, X, FileText, ChevronRight, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { useSbmData } from '../../contexts/SbmDataContext';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidentialityBadge } from '../common/ConfidentialityBadge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndicator: (indicatorNumber: number) => void;
  onSelectMov: (movId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectIndicator,
  onSelectMov
}) => {
  const { indicators, dimensions, movRecords, currentSchoolYear } = useSbmData();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return { indicators: [], movs: [] };
    const q = query.toLowerCase();

    const matchedInds = indicators.filter((ind) => {
      const dim = dimensions.find((d) => d.id === ind.dimensionId);
      return (
        ind.id.toString() === q ||
        `indicator ${ind.id}`.includes(q) ||
        ind.officialWording.toLowerCase().includes(q) ||
        dim?.name.toLowerCase().includes(q) ||
        ind.suggestedLeadOffice?.toLowerCase().includes(q)
      );
    });

    const matchedMovs = movRecords.filter((m) => {
      return (
        m.schoolYearId === currentSchoolYear.id &&
        (m.title.toLowerCase().includes(q) ||
          m.originalFilename.toLowerCase().includes(q) ||
          m.uploaderName.toLowerCase().includes(q) ||
          m.originatingOffice?.toLowerCase().includes(q) ||
          m.tags?.some((t) => t.toLowerCase().includes(q)))
      );
    });

    return { indicators: matchedInds, movs: matchedMovs };
  }, [query, indicators, dimensions, movRecords, currentSchoolYear.id]);

  if (!isOpen) return null;

  return (
    <div
      id="global-search-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4"
    >
      <div
        id="global-search-container"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Search input header */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <input
            id="global-search-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 42 SBM indicators, MOV evidence titles, tags, or keywords..."
            className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-medium"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm">Search by indicator number (1–42), keywords (e.g. "NAT", "CPC", "MOOE"), or file names.</p>
            </div>
          ) : searchResults.indicators.length === 0 && searchResults.movs.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for indicator numbers or DepEd terms like "SGC", "IPCRF", "DRRM".</p>
            </div>
          ) : (
            <>
              {/* Matched Indicators */}
              {searchResults.indicators.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Official Indicators ({searchResults.indicators.length})
                  </h4>
                  <div className="space-y-1.5">
                    {searchResults.indicators.map((ind) => (
                      <button
                        key={ind.id}
                        id={`search-result-ind-${ind.id}`}
                        onClick={() => {
                          onSelectIndicator(ind.id);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 transition-all flex items-start justify-between group"
                      >
                        <div className="space-y-1 pr-3">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                              Indicator {ind.id}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              Dimension {ind.dimensionId}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-800 line-clamp-2">
                            {ind.officialWording}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0 mt-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched MOVs */}
              {searchResults.movs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Means of Verification Evidence ({searchResults.movs.length})
                  </h4>
                  <div className="space-y-1.5">
                    {searchResults.movs.map((mov) => (
                      <button
                        key={mov.id}
                        id={`search-result-mov-${mov.id}`}
                        onClick={() => {
                          onSelectMov(mov.id);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-start justify-between group"
                      >
                        <div className="space-y-1 pr-3">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {mov.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {mov.originalFilename} • Ind. {mov.indicatorNumber} • {mov.uploaderName}
                          </p>
                          <div className="flex items-center space-x-2 pt-1">
                            <StatusBadge status={mov.submissionStatus} size="sm" />
                            <ConfidentialityBadge level={mov.confidentialityLevel} size="sm" />
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 flex-shrink-0 mt-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
