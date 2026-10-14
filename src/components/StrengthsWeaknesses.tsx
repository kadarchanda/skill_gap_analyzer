import { motion, AnimatePresence } from 'framer-motion';
import { Award, AlertTriangle } from 'lucide-react';
import type { GapAnalysisResult } from '@/types';
import { GAP_COLORS } from '@/lib/gapAnalysis';

interface StrengthsWeaknessesProps {
  analysis: GapAnalysisResult;
}

export function StrengthsWeaknesses({ analysis }: StrengthsWeaknessesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Strengths */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Top Strengths</h3>
        </div>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {analysis.strengths.length === 0 ? (
              <p className="text-xs text-slate-500">No strengths identified yet. Keep building your skills!</p>
            ) : (
              analysis.strengths.map((s, i) => (
                <motion.div
                  key={s.skill}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-xl bg-slate-800/40 px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-slate-200">{s.skill}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-700">
                      <motion.div
                        className="h-full rounded-full bg-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${s.current}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                      />
                    </div>
                    <span className="text-sm font-bold text-emerald-300 tabular-nums">{s.current}%</span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Weaknesses */}
      <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-orange-500/5 p-5">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h3 className="text-sm font-semibold text-white">Priority Gaps</h3>
        </div>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {analysis.weaknesses.length === 0 ? (
              <p className="text-xs text-slate-500">No significant gaps — you're on track!</p>
            ) : (
              analysis.weaknesses.map((w, i) => (
                <motion.div
                  key={w.skill}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-xl bg-slate-800/40 px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-slate-200">{w.skill}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-bold"
                      style={{
                        background: `${GAP_COLORS[w.category]}20`,
                        color: GAP_COLORS[w.category],
                      }}
                    >
                      {w.category}
                    </span>
                    <span className="text-sm font-bold text-red-300 tabular-nums">-{w.gap}pts</span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
