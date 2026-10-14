import { motion } from 'framer-motion';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Legend } from 'recharts';
import type { GapAnalysisResult, JobRole } from '@/types';

interface SkillsRadarChartProps {
  analysis: GapAnalysisResult;
  role: JobRole | null;
}

export function SkillsRadarChart({ analysis, role }: SkillsRadarChartProps) {
  if (!role || analysis.gaps.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center text-sm text-slate-500">
        Select a target role to see your radar chart
      </div>
    );
  }

  const data = analysis.gaps.map((g) => ({
    skill: g.skill,
    Current: g.current,
    Target: g.target,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="h-[360px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
          <Radar
            name="Target"
            dataKey="Target"
            stroke="#22d3ee"
            fill="#22d3ee"
            fillOpacity={0.15}
            strokeWidth={2}
            strokeDasharray="5 3"
            isAnimationActive
          />
          <Radar
            name="Current"
            dataKey="Current"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.4}
            strokeWidth={2}
            isAnimationActive
          />
          <Legend
            wrapperStyle={{ fontSize: 13, color: '#cbd5e1', paddingTop: 10 }}
            iconType="plainline"
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
