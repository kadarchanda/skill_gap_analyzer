import { motion } from 'framer-motion';
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { GapAnalysisResult } from '@/types';
import { GAP_COLORS } from '@/lib/gapAnalysis';

interface GapBarChartProps {
  analysis: GapAnalysisResult;
}

export function GapBarChart({ analysis }: GapBarChartProps) {
  if (analysis.gaps.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
        Gap analysis will appear here
      </div>
    );
  }

  const data = analysis.gaps
    .map((g) => ({
      skill: g.skill,
      gap: g.gap,
      category: g.category,
    }))
    .sort((a, b) => b.gap - a.gap);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis
            type="category"
            dataKey="skill"
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#334155' }}
            width={100}
          />
          <Tooltip
            cursor={{ fill: '#1e293b50' }}
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 12,
              color: '#e2e8f0',
              fontSize: 13,
            }}
            formatter={(value) => [`${value} pts`, 'Gap']}
          />
          <Bar dataKey="gap" radius={[0, 8, 8, 0]} isAnimationActive animationDuration={600}>
            {data.map((entry, i) => (
              <Cell key={i} fill={GAP_COLORS[entry.category]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
