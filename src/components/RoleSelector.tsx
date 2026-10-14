import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { JobRole } from '@/types';
import { getIcon } from '@/lib/iconMap';

interface RoleSelectorProps {
  roles: JobRole[];
  selectedId: string | null;
  onSelect: (role: JobRole) => void;
}

export function RoleSelector({ roles, selectedId, onSelect }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {roles.map((role, i) => {
        const Icon = getIcon(role.icon);
        const isSelected = role.id === selectedId;
        return (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => onSelect(role)}
            className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
              isSelected
                ? 'border-cyan-400/60 bg-gradient-to-br from-cyan-500/15 to-blue-600/10 shadow-lg shadow-cyan-500/20'
                : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/60'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="role-selected"
                className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="h-4 w-4 text-slate-900" />
              </motion.div>
            )}
            <div
              className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${
                isSelected ? 'bg-cyan-400/20' : 'bg-slate-700/40'
              }`}
            >
              <Icon className={`h-6 w-6 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`} />
            </div>
            <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
              {role.name}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{role.description}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
