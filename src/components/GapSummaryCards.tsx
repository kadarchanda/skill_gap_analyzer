import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Gauge } from 'lucide-react';
import type { GapAnalysisResult } from '@/types';

interface GapSummaryCardsProps {
  analysis: GapAnalysisResult;
}

export function GapSummaryCards({ analysis }: GapSummaryCardsProps) {
  const highCount = analysis.gaps.filter((g) => g.category === 'High').length;
  const mediumCount = analysis.gaps.filter((g) => g.category === 'Medium').length;

  const cards = [
    {
      label: 'Readiness',
      value: `${analysis.readinessPercent}%`,
      icon: Gauge,
      color: 'text-cyan-300',
      bg: 'from-cyan-500/15 to-blue-500/10',
      border: 'border-cyan-500/30',
    },
    {
      label: 'Overall Score',
      value: `${analysis.overallScore}%`,
      icon: Target,
      color: 'text-blue-300',
      bg: 'from-blue-500/15 to-indigo-500/10',
      border: 'border-blue-500/30',
    },
    {
      label: 'High Gaps',
      value: highCount,
      icon: TrendingDown,
      color: 'text-red-300',
      bg: 'from-red-500/15 to-orange-500/10',
      border: 'border-red-500/30',
    },
    {
      label: 'Medium Gaps',
      value: mediumCount,
      icon: TrendingUp,
      color: 'text-amber-300',
      bg: 'from-amber-500/15 to-yellow-500/10',
      border: 'border-amber-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.bg} p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">{card.label}</p>
                <p className={`mt-1 text-2xl font-bold ${card.color} tabular-nums`}>{card.value}</p>
              </div>
              <Icon className={`h-8 w-8 ${card.color} opacity-60`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
