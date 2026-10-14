import type { GapAnalysisResult, GapCategory, JobRole, SkillGap, StudentProfile, LearningResource } from '@/types';

export const SKILL_LIST = ['Python', 'SQL', 'REST APIs', 'React', 'Data Structures'] as const;

export function categorizeGap(gap: number): GapCategory {
  if (gap <= 5) return 'On Track';
  if (gap <= 15) return 'Low';
  if (gap <= 30) return 'Medium';
  return 'High';
}

export function computeGaps(
  profile: StudentProfile,
  role: JobRole | null,
): GapAnalysisResult {
  if (!role) {
    return { gaps: [], strengths: [], weaknesses: [], overallScore: 0, readinessPercent: 0 };
  }

  const gaps: SkillGap[] = SKILL_LIST.map((skill) => {
    const current = profile.skills[skill] ?? 0;
    const target = role.benchmarks[skill] ?? 0;
    const gap = Math.max(0, target - current);
    return { skill, current, target, gap, category: categorizeGap(gap) };
  });

  const sorted = [...gaps].sort((a, b) => b.gap - a.gap);
  const weaknesses = sorted.filter((g) => g.gap > 5).slice(0, 3);
  const strengths = [...gaps]
    .filter((g) => g.gap <= 5 && g.current > 0)
    .sort((a, b) => b.current - a.current)
    .slice(0, 3);

  const totalTarget = gaps.reduce((s, g) => s + g.target, 0);
  const totalCurrent = gaps.reduce((s, g) => s + Math.min(g.current, g.target), 0);
  const readinessPercent = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
  const overallScore = Math.round(gaps.reduce((s, g) => s + g.current, 0) / gaps.length);

  return { gaps, strengths, weaknesses, overallScore, readinessPercent };
}

export function rankResourcesForGaps(
  gaps: SkillGap[],
  resources: LearningResource[],
): Record<string, LearningResource[]> {
  const result: Record<string, LearningResource[]> = {};
  for (const gap of gaps) {
    if (gap.gap <= 5) continue;
    const matching = resources
      .filter((r) => r.skill === gap.skill)
      .sort((a, b) => b.rating - a.rating);
    result[gap.skill] = matching;
  }
  return result;
}

export const GAP_COLORS: Record<GapCategory, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
  'On Track': '#3b82f6',
};

export const RESOURCE_TYPE_ICONS: Record<string, string> = {
  course: 'GraduationCap',
  documentation: 'BookOpen',
  tutorial: 'Lightbulb',
  practice: 'Code',
};

export const SKILL_ICONS: Record<string, string> = {
  Python: 'FileCode2',
  SQL: 'Database',
  'REST APIs': 'Globe',
  React: 'Atom',
  'Data Structures': 'Binary',
};
