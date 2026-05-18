import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { STAT_DEFINITIONS } from '../../constants/stats';
import type { StatKey } from '../../store/types';

interface RadarChartProps {
  statPoints: Record<StatKey, number>;
}

export function RadarChart({ statPoints }: RadarChartProps) {
  // Map stat points to recharts data shape
  const data = STAT_DEFINITIONS.map((def) => ({
    subject: `${def.symbol} ${def.label}`,
    value: statPoints[def.key] || 0,
    key: def.key,
  }));

  // Domain max is 1.2x the highest stat point, floor of 10 to keep it looking good
  const maxVal = Math.max(...Object.values(statPoints), 0);
  const domainMax = Math.max(Math.ceil(maxVal * 1.2), 10);

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div className="bg-[#1A1A26] border border-white/10 p-2.5 rounded-lg shadow-xl text-left font-[family-name:var(--font-body)] text-xs select-none">
          <span className="text-[var(--text-primary)] font-extrabold tracking-wider">{pData.subject}</span>
          <div className="text-[var(--accent-primary)] font-bold mt-1">Points: {pData.value}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] flex items-center justify-center font-[family-name:var(--font-body)] select-none">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: 'var(--text-secondary)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, domainMax]}
            tick={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Radar
            name="Hunter Build"
            dataKey="value"
            stroke="var(--accent-primary)"
            strokeWidth={2}
            fill="var(--accent-primary)"
            fillOpacity={0.2}
            dot={{
              r: 3.5,
              fill: 'var(--accent-primary)',
              stroke: '#0A0A0F',
              strokeWidth: 1.5,
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
