export type SkillName = string;

export interface JobRole {
  id: string;
  name: string;
  description: string;
  benchmarks: Record<SkillName, number>;
  icon: string;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  target_role_id: string | null;
  skills: Record<SkillName, number>;
  created_at: string;
  updated_at: string;
}

export type ResourceType = 'course' | 'documentation' | 'tutorial' | 'practice';

export interface LearningResource {
  id: string;
  skill: SkillName;
  title: string;
  url: string;
  type: ResourceType;
  source: string;
  is_free: boolean;
  rating: number;
  created_at: string;
}

export type GapCategory = 'High' | 'Medium' | 'Low' | 'On Track';

export interface SkillGap {
  skill: SkillName;
  current: number;
  target: number;
  gap: number;
  category: GapCategory;
}

export interface GapAnalysisResult {
  gaps: SkillGap[];
  strengths: SkillGap[];
  weaknesses: SkillGap[];
  overallScore: number;
  readinessPercent: number;
}
