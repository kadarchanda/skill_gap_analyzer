import {
  Code2,
  BarChart3,
  Cpu,
  FileCode2,
  Database,
  Globe,
  Atom,
  Binary,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Code,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  BarChart3,
  Cpu,
  FileCode2,
  Database,
  Globe,
  Atom,
  Binary,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Code,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Code2;
}
