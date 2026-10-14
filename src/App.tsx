import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Save, RotateCcw, Radar, BarChart3, Map, User, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { computeGaps } from '@/lib/gapAnalysis';
import type { JobRole, StudentProfile, LearningResource } from '@/types';
import { Header } from '@/components/Header';
import { RoleSelector } from '@/components/RoleSelector';
import { SkillInput } from '@/components/SkillInput';
import { SkillsRadarChart } from '@/components/SkillsRadarChart';
import { GapBarChart } from '@/components/GapBarChart';
import { GapSummaryCards } from '@/components/GapSummaryCards';
import { StrengthsWeaknesses } from '@/components/StrengthsWeaknesses';
import { LearningPath } from '@/components/LearningPath';

type TabId = 'dashboard' | 'learning';

export default function App() {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [studentName, setStudentName] = useState('Student');
  const [skills, setSkills] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Load initial data
  useEffect(() => {
    (async () => {
      const [{ data: rolesData }, { data: profileData }, { data: resourcesData }] = await Promise.all([
        supabase.from('job_roles').select('*'),
        supabase.from('student_profiles').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('learning_resources').select('*'),
      ]);

      setRoles(rolesData ?? []);
      setResources(resourcesData ?? []);

      if (profileData) {
        setProfile(profileData as StudentProfile);
        setStudentName(profileData.name);
        setSkills(profileData.skills ?? {});
        const role = (rolesData ?? []).find((r) => r.id === profileData.target_role_id);
        if (role) setSelectedRole(role as JobRole);
      }
      setLoading(false);
    })();
  }, []);

  const analysis = useMemo(() => {
    if (!profile) return null;
    const liveProfile = { ...profile, skills, name: studentName };
    return computeGaps(liveProfile, selectedRole);
  }, [profile, skills, studentName, selectedRole]);

  const handleSkillChange = useCallback((skill: string, value: number) => {
    setSkills((prev) => ({ ...prev, [skill]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!profile) return;
    setSaving(true);
    setSaveStatus('idle');
    const { data, error } = await supabase
      .from('student_profiles')
      .update({ name: studentName, skills, target_role_id: selectedRole?.id ?? null, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
      .select('*')
      .maybeSingle();

    if (!error && data) {
      setProfile(data as StudentProfile);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
    setSaving(false);
  }, [profile, studentName, skills, selectedRole]);

  const handleReset = useCallback(() => {
    setSkills({});
    setSelectedRole(null);
    setStudentName('Student');
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-sm text-slate-400">Loading your skills dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <Header />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* === PROFILE & ROLE SELECTION === */}
          <section>
            <SectionTitle icon={User} title="Your Profile & Target Role" subtitle="Tell us about your skills and where you want to go" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Skill Input */}
              <div className="rounded-2xl border border-slate-700/40 bg-slate-800/30 p-6 backdrop-blur-sm">
                <SkillInput
                  profile={{ ...profile!, skills, name: studentName }}
                  studentName={studentName}
                  onNameChange={setStudentName}
                  onSkillChange={handleSkillChange}
                />
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                  <AnimatePresence>
                    {saveStatus === 'saved' && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1 text-sm text-emerald-400"
                      >
                        <Sparkles className="h-4 w-4" />
                        Saved!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Role Selector */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-300">Choose Your Target Role</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Benchmarks define the expected proficiency for each skill</p>
                </div>
                <RoleSelector roles={roles} selectedId={selectedRole?.id ?? null} onSelect={setSelectedRole} />
              </div>
            </div>
          </section>

          {/* === TABS === */}
          <div className="flex gap-2 border-b border-slate-800">
            <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={Radar} label="Dashboard" />
            <TabButton active={activeTab === 'learning'} onClick={() => setActiveTab('learning')} icon={Map} label="Learning Path" />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && analysis && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* Summary Cards */}
                <GapSummaryCards analysis={analysis} />

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <ChartCard icon={Radar} title="Proficiency Radar" subtitle="Target vs. Current skill levels">
                    <SkillsRadarChart analysis={analysis} role={selectedRole} />
                  </ChartCard>
                  <ChartCard icon={BarChart3} title="Gap Analysis" subtitle="Skills sorted by gap size">
                    <GapBarChart analysis={analysis} />
                  </ChartCard>
                </div>

                {/* Strengths & Weaknesses */}
                <SectionTitle icon={Sparkles} title="Strengths & Priority Gaps" subtitle="Where you shine and where to focus" />
                <StrengthsWeaknesses analysis={analysis} />
              </motion.div>
            )}

            {activeTab === 'learning' && analysis && (
              <motion.div
                key="learning"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <SectionTitle icon={Map} title="Recommended Learning Path" subtitle="Ranked resources for every skill gap — courses, docs, tutorials, and practice" />
                <LearningPath analysis={analysis} resources={resources} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="border-t border-slate-800/50 py-6 text-center">
          <p className="text-xs text-slate-500">Student Skills Gap Analyzer — Bridge the gap between learning and landing your dream role.</p>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: typeof Radar; title: string; subtitle: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15">
        <Icon className="h-5 w-5 text-cyan-400" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Radar; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
        active ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      {active && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
        />
      )}
    </button>
  );
}

function ChartCard({ icon: Icon, title, subtitle, children }: { icon: typeof Radar; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-800/30 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
