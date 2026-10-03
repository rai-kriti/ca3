// Reusable UI components for the platform
import React from 'react';
import type { SkillLevel, GapSeverity, VerificationStatus, DriveStatus, RegistrationStatus } from '@/types';

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
  color?: string;
}
export function StatCard({ label, value, icon, sub, color = 'violet' }: StatCardProps) {
  const colors: Record<string, string> = {
    violet: 'from-violet-900/40 to-purple-900/20 border-violet-700/30',
    cyan: 'from-cyan-900/40 to-blue-900/20 border-cyan-700/30',
    emerald: 'from-emerald-900/40 to-teal-900/20 border-emerald-700/30',
    amber: 'from-amber-900/40 to-orange-900/20 border-amber-700/30',
    rose: 'from-rose-900/40 to-pink-900/20 border-rose-700/30',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color] || colors.violet} border rounded-2xl p-5 card-hover`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-extrabold mb-0.5">{value}</div>
          <div className="text-sm font-medium text-gray-300">{label}</div>
          {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

// ── Level Badge ───────────────────────────────────────────────────────────────
interface LevelBadgeProps { level: SkillLevel; size?: 'sm' | 'xs'; }
export function LevelBadge({ level, size = 'sm' }: LevelBadgeProps) {
  const cls: Record<SkillLevel, string> = {
    expert: 'level-expert',
    advanced: 'level-advanced',
    intermediate: 'level-intermediate',
    beginner: 'level-beginner',
  };
  const sz = size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2.5 py-1';
  return <span className={`inline-flex items-center rounded-full font-medium capitalize ${cls[level]} ${sz}`}>{level}</span>;
}

// ── Verification Badge ────────────────────────────────────────────────────────
export function VerifBadge({ status }: { status: VerificationStatus }) {
  const cls: Record<VerificationStatus, string> = {
    verified: 'badge-verified',
    pending: 'badge-pending',
    rejected: 'badge-rejected',
    unverified: 'bg-gray-800/60 text-gray-500 border border-gray-700/50',
  };
  const icons: Record<VerificationStatus, string> = {
    verified: '✓', pending: '⏳', rejected: '✗', unverified: '—',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full text-xs px-2.5 py-1 font-medium ${cls[status]}`}>
      {icons[status]} {status}
    </span>
  );
}

// ── Gap Severity Badge ────────────────────────────────────────────────────────
export function GapBadge({ severity }: { severity: GapSeverity }) {
  const cls: Record<GapSeverity, string> = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
  };
  return <span className={`inline-flex items-center rounded-full text-xs px-2.5 py-1 font-medium capitalize ${cls[severity]}`}>{severity}</span>;
}

// ── Drive Status Badge ────────────────────────────────────────────────────────
export function DriveStatusBadge({ status }: { status: DriveStatus }) {
  const cls: Record<DriveStatus, string> = {
    draft: 'bg-gray-800 text-gray-400 border border-gray-700',
    published: 'bg-blue-900/60 text-blue-400 border border-blue-700/50',
    registration_open: 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50',
    closed: 'bg-red-900/60 text-red-400 border border-red-700/50',
    completed: 'bg-purple-900/60 text-purple-400 border border-purple-700/50',
  };
  const labels: Record<DriveStatus, string> = {
    draft: 'Draft', published: 'Published', registration_open: 'Open', closed: 'Closed', completed: 'Completed',
  };
  return <span className={`inline-flex rounded-full text-xs px-2.5 py-1 font-medium ${cls[status]}`}>{labels[status]}</span>;
}

// ── Registration Status Badge ─────────────────────────────────────────────────
export function RegStatusBadge({ status }: { status: RegistrationStatus }) {
  const cls: Record<RegistrationStatus, string> = {
    applied: 'bg-blue-900/60 text-blue-400 border border-blue-700/50',
    shortlisted: 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50',
    rejected: 'bg-red-900/60 text-red-400 border border-red-700/50',
    selected: 'bg-purple-900/60 text-purple-400 border border-purple-700/50',
    withdrawn: 'bg-gray-800 text-gray-500 border border-gray-700',
  };
  return <span className={`inline-flex rounded-full text-xs px-2.5 py-1 font-medium capitalize ${cls[status]}`}>{status}</span>;
}

// ── Score Ring ─────────────────────────────────────────────────────────────────
interface ScoreRingProps { score: number; size?: number; strokeWidth?: number; label?: string; }
export function ScoreRing({ score, size = 120, strokeWidth = 10, label }: ScoreRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1f2937" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-extrabold" style={{ color }}>{score}</div>
        {label && <div className="text-xs text-gray-500">{label}</div>}
      </div>
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
interface ProgressBarProps { value: number; max?: number; color?: string; label?: string; showValue?: boolean; }
export function ProgressBar({ value, max = 100, color = '#6366f1', label, showValue = true }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1 text-xs">
          {label && <span className="text-gray-400">{label}</span>}
          {showValue && <span className="text-gray-300 font-medium">{value}{max !== 100 ? `/${max}` : '%'}</span>}
        </div>
      )}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────────
interface SectionHeaderProps { title: string; subtitle?: string; action?: React.ReactNode; }
export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Page Header ────────────────────────────────────────────────────────────────
interface PageHeaderProps { title: string; subtitle?: string; badge?: string; children?: React.ReactNode; }
export function PageHeader({ title, subtitle, badge, children }: PageHeaderProps) {
  return (
    <div className="border-b border-gray-800 px-8 py-6">
      {badge && (
        <div className="inline-flex items-center gap-2 bg-violet-950/40 border border-violet-700/30 rounded-full px-3 py-1 text-xs text-violet-400 mb-3">
          {badge}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description }: { icon: string; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
    </div>
  );
}

// ── Info Row ───────────────────────────────────────────────────────────────────
export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-200 font-medium">{value}</span>
    </div>
  );
}

// ── Tab Bar ───────────────────────────────────────────────────────────────────
interface TabBarProps {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}
export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 bg-gray-900/50 rounded-xl p-1 w-fit">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            active === tab.id
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
              : 'text-gray-400 hover:text-gray-200'
          }`}>
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs rounded-full px-1.5 py-0.5 ${active === tab.id ? 'bg-white/20' : 'bg-gray-700'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
