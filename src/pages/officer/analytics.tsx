// Batch Analytics – M10: Skill supply vs demand, readiness distribution, department breakdown
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { batchReadiness, drives, getSkillById, students, getReadinessForStudent } from '@/lib/mockData';
import { PageHeader, StatCard, SectionHeader } from '@/components/ui';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import Head from 'next/head';

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function OfficerAnalytics() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !['placement_officer', 'placement_head'].includes(user.role)) router.push('/');
  }, [user, router]);

  // Readiness distribution buckets
  const readinessBuckets = [
    { label: '0–40', range: [0, 40], count: 0, color: '#ef4444' },
    { label: '40–60', range: [40, 60], count: 0, color: '#f97316' },
    { label: '60–70', range: [60, 70], count: 0, color: '#f59e0b' },
    { label: '70–80', range: [70, 80], count: 0, color: '#22c55e' },
    { label: '80–100', range: [80, 100], count: 0, color: '#10b981' },
  ];

  students.forEach(s => {
    const score = getReadinessForStudent(s.id)?.overallScore ?? 0;
    const bucket = readinessBuckets.find(b => score >= b.range[0] && score < b.range[1]);
    if (bucket) bucket.count++;
  });

  // Supply vs Demand
  const supplyDemandData = batchReadiness.skillSupplyDemand.map(sd => ({
    skill: getSkillById(sd.skillId)?.name ?? sd.skillId,
    supply: sd.supply,
    demand: sd.demand,
    gap: Math.max(0, sd.demand - sd.supply),
  }));

  // Department breakdown
  const deptData = batchReadiness.departmentBreakdown.map(d => ({
    dept: d.department,
    readiness: d.avgReadiness,
    eligible: d.eligibleCount,
    total: d.count,
  }));

  const funnel = [
    { stage: 'Total Students', count: 8, color: '#6366f1' },
    { stage: 'Eligible', count: 6, color: '#0ea5e9' },
    { stage: 'Registered', count: 6, color: '#10b981' },
    { stage: 'Shortlisted', count: 2, color: '#f59e0b' },
    { stage: 'Selected', count: 0, color: '#ef4444' },
  ];

  return (
    <Layout>
      <Head><title>Batch Analytics – PlacementIQ</title></Head>
      <PageHeader
        title="Batch Readiness Analytics"
        subtitle="The single most valuable view – skill supply vs demand, readiness distribution, and conversion funnel"
        badge="M10 · Batch Reporting & Analytics"
      >
        <div className="text-xs text-gray-500 bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5">
          📊 Background job: last run 5 min ago
        </div>
      </PageHeader>

      <div className="p-8">
        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Students" value={batchReadiness.totalStudents} icon="👥" color="violet" />
          <StatCard label="Eligible for Drive" value={batchReadiness.eligibleCount} icon="✅" color="cyan" sub={`of ${batchReadiness.totalStudents}`} />
          <StatCard label="Ready (≥70)" value={batchReadiness.readyCount} icon="🎯" color="emerald" sub="truly prepared" />
          <StatCard label="Avg Readiness" value={`${batchReadiness.averageReadiness}%`} icon="📈" color="amber" />
        </div>

        {/* Skill Supply vs Demand – the most important report */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-8">
          <SectionHeader
            title="⭐ Skill Supply vs Demand"
            subtitle="The most critical report – tells the training team which skills to prioritise next term"
          />
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={supplyDemandData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f9fafb' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
              <Bar dataKey="supply" name="Supply (students have skill)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="demand" name="Demand (drives require skill)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap gap-2">
            {supplyDemandData.filter(d => d.demand > d.supply).map(d => (
              <div key={d.skill} className="flex items-center gap-2 bg-red-950/30 border border-red-700/30 rounded-lg px-3 py-1.5">
                <span className="text-xs text-red-400">⚠️ Deficit in <strong>{d.skill}</strong></span>
                <span className="text-xs text-red-600">–{d.gap} student{d.gap !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Readiness distribution */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <SectionHeader title="Readiness Distribution" subtitle="Score buckets across the batch" />
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={readinessBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} labelStyle={{ color: '#f9fafb' }} />
                <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]}>
                  {readinessBuckets.map((b, i) => (
                    <Cell key={i} fill={b.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department breakdown */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <SectionHeader title="Department Breakdown" subtitle="Avg readiness by department" />
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="dept" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} labelStyle={{ color: '#f9fafb' }} />
                <Bar dataKey="readiness" name="Avg Readiness %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drive conversion funnel */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-8">
          <SectionHeader title="Drive Conversion Funnel" subtitle="From eligible to registered to shortlisted to selected" />
          <div className="flex flex-wrap justify-center gap-4">
            {funnel.map((stage, idx) => (
              <div key={stage.stage} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold"
                    style={{ backgroundColor: `${stage.color}20`, border: `1px solid ${stage.color}40`, color: stage.color }}>
                    {stage.count}
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center max-w-16">{stage.stage}</div>
                </div>
                {idx < funnel.length - 1 && (
                  <div className="text-gray-700 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key insight box */}
        <div className="bg-gradient-to-r from-amber-950/20 to-orange-950/10 border border-amber-700/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <div className="font-semibold text-amber-300 mb-1">Training Recommendation</div>
              <p className="text-sm text-gray-400">
                Based on the skill supply-demand analysis above, the training team should prioritise:
                <strong className="text-white"> Cypress/E2E Testing</strong> (gap: 1 student),
                <strong className="text-white"> System Design</strong> and
                <strong className="text-white"> TypeScript</strong> for the upcoming TechCorp drive.
                Students with readiness &lt; 60 ({readinessBuckets.filter(b => b.range[1] <= 60).reduce((s, b) => s + b.count, 0)} students) need targeted intensive coaching.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
