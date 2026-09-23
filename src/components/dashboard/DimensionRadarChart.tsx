import React, { useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from 'recharts';
import { Sparkles, Target, Compass, Award, AlertCircle } from 'lucide-react';
import { DimensionProgress } from '../../types';

interface DimensionRadarChartProps {
  dimensionProgress: DimensionProgress[];
  onNavigateToDimension?: (dimensionId: number) => void;
  schoolYearLabel: string;
}

// Short display names for polar angles so they don't clip on small screens
const DIMENSION_SHORT_LABELS: Record<number, string> = {
  1: 'D1: Leadership',
  2: 'D2: Learning Env',
  3: 'D3: Curriculum',
  4: 'D4: Human Resources',
  5: 'D5: Resource Mgmt',
  6: 'D6: Continuous Imprv'
};

export const DimensionRadarChart: React.FC<DimensionRadarChartProps> = ({
  dimensionProgress,
  onNavigateToDimension,
  schoolYearLabel
}) => {
  const [showTarget, setShowTarget] = useState(true);
  const [activeDimensionId, setActiveDimensionId] = useState<number | null>(null);

  // Transform dimension progress into chart data
  const chartData = dimensionProgress.map((dim) => ({
    dimensionId: dim.dimensionId,
    subject: DIMENSION_SHORT_LABELS[dim.dimensionId] || `D${dim.dimensionId}`,
    fullName: dim.name,
    completion: dim.completionPercentage,
    target: 100,
    completed: dim.completedIndicators,
    total: dim.totalIndicators,
    applicable: dim.applicableIndicators,
    missingMovs: dim.missingMovsCount
  }));

  // Calculate statistics
  const avgCompletion = Math.round(
    chartData.reduce((acc, d) => acc + d.completion, 0) / (chartData.length || 1)
  );

  const highestDim = [...chartData].sort((a, b) => b.completion - a.completion)[0];
  const lowestDim = [...chartData].sort((a, b) => a.completion - b.completion)[0];

  // Custom tooltip renderer
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#051810]/95 backdrop-blur-md border border-[#D4AF37]/50 rounded-xl p-3 shadow-2xl text-xs text-[#FFFDF9] min-w-[200px] pointer-events-none z-50">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-1.5 mb-2">
            <span className="font-bold text-[#F0D283]">Dimension {data.dimensionId}</span>
            <span className="font-black text-emerald-400 text-sm">{data.completion}%</span>
          </div>
          <p className="font-semibold text-[#E2F0EA] mb-1.5 leading-snug">{data.fullName}</p>
          <div className="space-y-1 text-[11px] text-[#8FBCA7]">
            <div className="flex justify-between">
              <span>Approved Indicators:</span>
              <strong className="text-[#FFFDF9]">{data.completed} / {data.applicable}</strong>
            </div>
            <div className="flex justify-between">
              <span>Target Standard:</span>
              <strong className="text-[#F0D283]">100%</strong>
            </div>
            {data.missingMovs > 0 ? (
              <div className="flex justify-between text-amber-300 font-medium pt-1 border-t border-[#D4AF37]/15">
                <span>Missing MOVs:</span>
                <span>{data.missingMovs} items</span>
              </div>
            ) : (
              <div className="text-emerald-400 font-medium pt-1 border-t border-[#D4AF37]/15">
                ✓ All required MOVs present
              </div>
            )}
          </div>
          {onNavigateToDimension && (
            <div className="mt-2 text-[10px] text-[#D4AF37] italic text-center">
              Click dimension to inspect indicators
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0D2E1F]/90 rounded-2xl p-5 border border-[#D4AF37]/30 shadow-md flex flex-col justify-between space-y-4">
      {/* Header with Title & Target Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#061810] rounded-lg border border-[#D4AF37]/30 text-[#F0D283]">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#FFFDF9] flex items-center space-x-2">
              <span>6 SBM Dimensions Radar Analysis</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F0D283] border border-[#D4AF37]/30 font-medium">
                DO 007, s. 2024
              </span>
            </h3>
          </div>
          <p className="text-xs text-[#8FBCA7] mt-0.5">
            Holistic completion balance across all 6 SBM operational dimensions for {schoolYearLabel}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowTarget(!showTarget)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center space-x-1.5 ${
              showTarget
                ? 'bg-[#0E3824] border-[#D4AF37] text-[#F0D283] font-semibold'
                : 'bg-[#061810] border-[#D4AF37]/30 text-[#8FBCA7] hover:text-[#FFFDF9]'
            }`}
            title="Toggle 100% Target Reference Contour"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Target Contour (100%)</span>
          </button>
        </div>
      </div>

      {/* Main Radar Chart Visualization */}
      <div className="relative w-full min-w-0 h-[320px] sm:h-[350px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%" minWidth={250} minHeight={280}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid
              stroke="#D4AF37"
              strokeOpacity={0.25}
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={({ payload, x, y, cx, cy, ...rest }) => {
                const dimId = parseInt(payload.value.substring(1, 2), 10);
                const isHovered = activeDimensionId === dimId;
                return (
                  <text
                    {...rest}
                    x={x}
                    y={y}
                    className="cursor-pointer transition-all select-none"
                    onClick={() => onNavigateToDimension && onNavigateToDimension(dimId)}
                    onMouseEnter={() => setActiveDimensionId(dimId)}
                    onMouseLeave={() => setActiveDimensionId(null)}
                    fill={isHovered ? '#FFFFFF' : '#F0D283'}
                    fontSize={11}
                    fontWeight={isHovered ? '700' : '600'}
                    textAnchor="middle"
                  >
                    {payload.value}
                  </text>
                );
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#8FBCA7', fontSize: 10 }}
              stroke="#D4AF37"
              strokeOpacity={0.3}
              tickCount={5}
            />
            
            {showTarget && (
              <Radar
                name="100% Target Benchmark"
                dataKey="target"
                stroke="#D4AF37"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
                fill="#D4AF37"
                fillOpacity={0.05}
              />
            )}

            <Radar
              name="Current Completion %"
              dataKey="completion"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="#10B981"
              fillOpacity={0.38}
              dot={{
                r: 4,
                fill: '#D4AF37',
                stroke: '#061810',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: '#FFFDF9',
                stroke: '#10B981',
                strokeWidth: 2
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => (
                <span className="text-xs text-[#E2F0EA] font-medium">{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary KPI Strip below Radar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#D4AF37]/20">
        <div className="p-2.5 rounded-xl bg-[#092217] border border-[#D4AF37]/20 flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-[#061810] text-[#F0D283] border border-[#D4AF37]/30 flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#8FBCA7] uppercase tracking-wider block">Average Balance</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black text-[#FFFDF9]">{avgCompletion}%</span>
              <span className="text-[11px] text-[#A7D7C1]">across 6 dimensions</span>
            </div>
          </div>
        </div>

        {highestDim && (
          <div
            onClick={() => onNavigateToDimension && onNavigateToDimension(highestDim.dimensionId)}
            className="p-2.5 rounded-xl bg-[#092217] border border-[#D4AF37]/20 flex items-center space-x-2.5 cursor-pointer hover:bg-[#123E2A] transition-colors"
            title="Click to view dimension"
          >
            <div className="p-2 rounded-lg bg-[#061810] text-emerald-400 border border-emerald-500/30 flex-shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Highest Dimension</span>
              <span className="text-xs font-bold text-[#FFFDF9] truncate block">
                D{highestDim.dimensionId}: {highestDim.completion}%
              </span>
            </div>
          </div>
        )}

        {lowestDim && (
          <div
            onClick={() => onNavigateToDimension && onNavigateToDimension(lowestDim.dimensionId)}
            className="p-2.5 rounded-xl bg-[#092217] border border-[#D4AF37]/20 flex items-center space-x-2.5 cursor-pointer hover:bg-[#123E2A] transition-colors"
            title="Click to view dimension"
          >
            <div className="p-2 rounded-lg bg-[#061810] text-amber-400 border border-amber-500/30 flex-shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Needs Focus</span>
              <span className="text-xs font-bold text-[#FFFDF9] truncate block">
                D{lowestDim.dimensionId}: {lowestDim.completion}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
