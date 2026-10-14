import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, BookOpen, GraduationCap, Lightbulb, Code, Map } from 'lucide-react';
import type { GapAnalysisResult, LearningResource } from '@/types';
import { rankResourcesForGaps } from '@/lib/gapAnalysis';

interface LearningPathProps {
  analysis: GapAnalysisResult;
  resources: LearningResource[];
}

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  course: GraduationCap,
  documentation: BookOpen,
  tutorial: Lightbulb,
  practice: Code,
};

const TYPE_COLORS: Record<string, string> = {
  course: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
  documentation: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  tutorial: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  practice: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
};

export function LearningPath({ analysis, resources }: LearningPathProps) {
  const ranked = rankResourcesForGaps(analysis.gaps, resources);
  const skillKeys = Object.keys(ranked);

  if (skillKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Map className="mb-3 h-12 w-12 text-slate-600" />
        <p className="text-sm text-slate-500">
          You're on track! No learning paths needed for your current skill gaps.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {skillKeys.map((skill, si) => {
          const skillResources = ranked[skill];
          if (skillResources.length === 0) return null;
          const gap = analysis.gaps.find((g) => g.skill === skill);
          return (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: si * 0.1 }}
              className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15">
                    <span className="text-sm font-bold text-cyan-300">{si + 1}</span>
                  </div>
                  <h4 className="font-semibold text-white">{skill}</h4>
                </div>
                {gap && (
                  <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-300">
                    {gap.gap} pts to close
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {skillResources.map((resource, ri) => {
                  const Icon = TYPE_ICONS[resource.type] ?? BookOpen;
                  return (
                    <motion.a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: si * 0.1 + ri * 0.03 }}
                      whileHover={{ y: -2 }}
                      className="group flex items-start gap-3 rounded-xl border border-slate-700/40 bg-slate-900/40 p-4 transition-colors hover:border-cyan-500/30"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${TYPE_COLORS[resource.type]}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                            {resource.title}
                          </p>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500 transition-colors group-hover:text-cyan-400" />
                        </div>
                        <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                          <span>{resource.source}</span>
                          <span className="capitalize">{resource.type}</span>
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {Number(resource.rating).toFixed(1)}
                          </span>
                          {resource.is_free && (
                            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-300">
                              Free
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
