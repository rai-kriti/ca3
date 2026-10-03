// Student Readiness Page – M6: Dimension-wise readiness with radar chart
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getReadinessForStudent } from '@/lib/mockData';
import { PageHeader, StatCard, ProgressBar, SectionHeader } from '@/components/ui';
import { ScoreRing } from '@/components/ui';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import Head from 'next/head';

export default function StudentReadiness() {
  const { user, student } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'student') router.push('/');
  }, [user, router]);

  if (!student) return null;

  const snap = getReadinessForStudent(student.id);
  if (!snap) {
    return (
      <Layout>
        <PageHeader title="Readiness" subtitle="No readiness data computed yet" />
        <div className="p-8 text-center text-gray-500">Readiness snapshot not available. Submit more evidence to compute readiness.</div>
      </Layout>
    );
  }

  const dims = Object.values(snap.dimensions);
  const radarData = dims.map(d => ({ dimension: d.name, score: d.score, fullMark: 100 }));

  const scoreColor = snap.overallScore >= 80 ? '#10b981' : snap.overallScore >= 60 ? '#f59e0b' : '#ef4444';
  const readinessLabel = snap.overallScore >= 80 ? 'Ready' : snap.overallScore >= 60 ? 'Partially Ready' : 'Not Ready';

  const dimColors: Record<string, string> = {
    technical: '#6366f1', aptitude: '#0ea5e9', communication: '#10b981',
    projectDepth: '#f59e0b', domainFit: '#ec4899',
  };

  return (
    <Layout>
      <Head><title>Readiness – PlacementIQ</title></Head>
      <PageHeader
        title="Readiness Analysis"
        subtitle="Dimension-wise readiness computed from evidence, assessments, and mock interviews"
        badge="M6 · Readiness Engine"
      >
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-400">
          Last computed: {new Date(snap.computedAt).toLocaleDateString()}
        </div>
      </PageHeader>

      <div className="p-8">
        {/* Overall score + radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Score card */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center">
            <ScoreRing score={snap.overallScore} size={160} strokeWidth={14} label="Readiness" />
            <div className="mt-4 text-center">
              <div className="text-lg font-bold" style={{ color: scoreColor }}>{readinessLabel}</div>
              <div className="text-sm text-gray-400 mt-2 max-w-xs text-center">{snap.explanation}</div>
            </div>
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              ${snap.overallScore >= 80 ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40' :
                snap.overallScore >= 60 ? 'bg-amber-900/40 text-amber-400 border border-amber-700/40' :
                'bg-red-900/40 text-red-400 border border-red-700/40'}`}>
              <span className="pulse-dot w-2 h-2 rounded-full" style={{ backgroundColor: scoreColor }}></span>
              Overall: {snap.overallScore}/100
            </div>
          </div>

          {/* Radar chart */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Dimension Radar</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Radar name={student.name} dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dimension breakdown */}
        <SectionHeader title="Dimension Breakdown" subtitle="Each dimension is weighted in the overall readiness score" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(snap.dimensions).map(([key, dim]) => {
            const color = dimColors[key] || '#6366f1';
            return (
              <div key={key} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-white">{dim.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Weight: {Math.round(dim.weight * 100)}%</div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color }}>{dim.score}</div>
                </div>
                <ProgressBar value={dim.score} showValue={false} color={color} />
                <p className="text-xs text-gray-400 mt-3 leading-relaxed">{dim.explanation}</p>
              </div>
            );
          })}
        </div>

        {/* Key insight */}
        <div className="bg-gradient-to-r from-violet-900/20 to-purple-900/10 border border-violet-700/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-semibold text-violet-300 mb-1">Design Note: Eligibility ≠ Readiness</div>
              <p className="text-sm text-gray-400">
                A student may be <strong className="text-white">eligible</strong> for a drive (CGPA, backlogs, branch criteria) yet
                <strong className="text-white"> unready</strong> (skill gaps, low readiness score). This platform tracks both independently.
                Visit <strong className="text-violet-300">Gap Analysis</strong> to see specific gaps and a ranked preparation plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
