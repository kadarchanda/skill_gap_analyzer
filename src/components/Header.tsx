import { motion } from 'framer-motion';
import { GraduationCap, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30"
          >
            <GraduationCap className="h-7 w-7 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Skills Gap Analyzer
            </h1>
            <p className="text-xs text-slate-400 sm:text-sm">
              Bridge the gap between where you are and where you want to be
            </p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden sm:flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2"
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium text-cyan-300">AI-Powered Insights</span>
        </motion.div>
      </div>
    </motion.header>
  );
}
