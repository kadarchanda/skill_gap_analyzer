import { motion } from 'framer-motion';
import type { StudentProfile } from '@/types';
import { SKILL_LIST, SKILL_ICONS } from '@/lib/gapAnalysis';
import { getIcon } from '@/lib/iconMap';

interface SkillInputProps {
  profile: StudentProfile;
  studentName: string;
  onNameChange: (name: string) => void;
  onSkillChange: (skill: string, value: number) => void;
}

export function SkillInput({ profile, studentName, onNameChange, onSkillChange }: SkillInputProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Student Name</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-slate-300">
          Self-Evaluation Scores (0–100%)
        </label>
        <div className="space-y-4">
          {SKILL_LIST.map((skill, i) => {
            const value = profile.skills[skill] ?? 0;
            const Icon = getIcon(SKILL_ICONS[skill] ?? 'Code2');
            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-slate-200">{skill}</span>
                  </div>
                  <span className="text-sm font-bold text-cyan-300 tabular-nums">{value}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) => onSkillChange(skill, Number(e.target.value))}
                  className="skill-slider w-full"
                  style={{
                    background: `linear-gradient(to right, #22d3ee ${value}%, #1e293b ${value}%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
