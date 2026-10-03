// Preparation Plan Page – M9: Time-bound plan with calendar view
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { preparationPlans, drives } from '@/lib/mockData';
import { PageHeader, LevelBadge, SectionHeader, ProgressBar, StatCard } from '@/components/ui';
import Head from 'next/head';

const resourceTypeIcons: Record<string, string> = {
  course: '🎓', book: '📚', practice_problem: '💻', video: '📹', mock_test: '📝',
};

export default function StudentPlan() {
  const { user, student } = useAuth();
  const router = useRouter();
  const [expandedCp, setExpandedCp] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'student') router.push('/');
  }, [user, router]);

  if (!student) return null;

  const plans = preparationPlans.filter(p => p.studentId === student.id);
  const plan = plans[0]; // primary plan

  if (!plan) {
    return (
      <Layout>
        <Head><title>Prep Plan – PlacementIQ</title></Head>
        <PageHeader title="Preparation Plan" subtitle="No preparation plan generated yet" badge="M9 · Preparation Planning" />
        <div className="p-8 text-center">
          <div className="text-4xl mb-3">📅</div>
          <div className="font-semibold text-gray-300 mb-2">No plan generated</div>
          <p className="text-sm text-gray-500">Complete gap analysis and the system will generate a time-bound plan with resources.</p>
          <button onClick={() => router.push('/student/gaps')} className="mt-4 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-xl text-sm transition-colors">
            View Gap Analysis →
          </button>
        </div>
      </Layout>
    );
  }

  const drive = drives.find(d => d.id === plan.driveId);
  const completedCount = plan.checkpoints.filter(c => c.completed).length;
  const totalHoursDone = plan.checkpoints.filter(c => c.completed).reduce((s, c) => s + c.estimatedHours, 0);
  const daysLeft = Math.ceil((new Date(plan.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // Calendar grid – show weeks
  const start = new Date(plan.startDate);
  const end = new Date(plan.targetDate);
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const today = new Date();

  return (
    <Layout>
      <Head><title>Prep Plan – PlacementIQ</title></Head>
      <PageHeader
        title="Preparation Plan"
        subtitle={`For ${drive?.role} at ${drive?.company}`}
        badge="M9 · Preparation Planning"
      >
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${
          daysLeft > 14 ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40' :
          daysLeft > 7 ? 'bg-amber-900/40 text-amber-400 border-amber-700/40' :
          'bg-red-900/40 text-red-400 border-red-700/40'
        }`}>
          🗓️ {daysLeft > 0 ? `${daysLeft} days until drive` : 'Drive date passed'}
        </div>
      </PageHeader>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Hours" value={plan.totalEstimatedHours} icon="⏱️" color="violet" sub="Estimated study time" />
          <StatCard label="Hours Done" value={totalHoursDone} icon="✅" color="emerald" sub={`of ${plan.totalEstimatedHours} total`} />
          <StatCard label="Checkpoints" value={`${completedCount}/${plan.checkpoints.length}`} icon="🎯" color="cyan" sub="Completed" />
          <StatCard label="Days Left" value={Math.max(0, daysLeft)} icon="📅" color={daysLeft > 14 ? 'emerald' : daysLeft > 7 ? 'amber' : 'rose'} sub="Until drive date" />
        </div>

        {/* Overall progress */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-8">
          <SectionHeader title="Overall Progress" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressBar value={completedCount} max={plan.checkpoints.length} label="Checkpoints completed" color="#6366f1" />
            <ProgressBar value={totalHoursDone} max={plan.totalEstimatedHours} label="Hours invested" color="#10b981" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
            <span>📅 Start: {new Date(plan.startDate).toLocaleDateString()}</span>
            <span>🏁 Target: {new Date(plan.targetDate).toLocaleDateString()}</span>
            <span>📆 Total duration: {totalDays} days</span>
          </div>
        </div>

        {/* Timeline / Calendar view */}
        <SectionHeader title="Preparation Timeline" subtitle="Checkpoints ordered by due date with resources" />
        <div className="relative space-y-4 mb-8">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800"></div>

          {[...plan.checkpoints].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map((cp, idx) => {
              const isExpanded = expandedCp === cp.id;
              const isPast = new Date(cp.dueDate) < today;
              const isToday = new Date(cp.dueDate).toDateString() === today.toDateString();
              return (
                <div key={cp.id} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs
                    ${cp.completed ? 'bg-emerald-600 border-emerald-500' : isPast ? 'bg-red-600/50 border-red-500' : 'bg-gray-800 border-gray-600'}`}>
                    {cp.completed ? '✓' : idx + 1}
                  </div>

                  <div className={`bg-gray-900/60 border rounded-2xl overflow-hidden transition-all duration-200
                    ${cp.completed ? 'border-emerald-700/30' : isPast ? 'border-red-700/30' : 'border-gray-700/50'}
                    card-hover cursor-pointer`}
                    onClick={() => setExpandedCp(isExpanded ? null : cp.id)}>
                    <div className="p-5">
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{cp.skillName}</span>
                            <LevelBadge level={cp.targetLevel} size="xs" />
                            {cp.completed && <span className="text-xs bg-emerald-900/60 text-emerald-400 border border-emerald-700/40 rounded-full px-2">Completed ✓</span>}
                            {isPast && !cp.completed && <span className="text-xs bg-red-900/60 text-red-400 border border-red-700/40 rounded-full px-2">Overdue</span>}
                            {isToday && <span className="text-xs bg-amber-900/60 text-amber-400 border border-amber-700/40 rounded-full px-2">Due today</span>}
                          </div>
                          <div className="text-sm text-gray-500">
                            Due: {new Date(cp.dueDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} ·
                            {cp.estimatedHours}h estimated · {cp.resources.length} resources
                          </div>
                        </div>
                        <span className="text-gray-600">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* Expanded resources */}
                    {isExpanded && (
                      <div className="border-t border-gray-800 p-5">
                        <div className="text-xs font-medium text-gray-400 mb-3">Study Resources</div>
                        <div className="space-y-2">
                          {cp.resources.map((res, i) => (
                            <div key={i} className="flex items-center gap-3 bg-gray-800/60 rounded-xl p-3">
                              <span className="text-xl">{resourceTypeIcons[res.type] || '📎'}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">{res.title}</div>
                                <div className="text-xs text-gray-500 capitalize">{res.type.replace('_', ' ')} · {res.estimatedHours}h</div>
                              </div>
                              {res.url && (
                                <a href={res.url} target="_blank" rel="noreferrer"
                                  className="text-xs bg-violet-600/30 text-violet-400 border border-violet-700/40 rounded-lg px-2 py-1 hover:bg-violet-600/50 transition-colors flex-shrink-0"
                                  onClick={e => e.stopPropagation()}>
                                  Open →
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}
