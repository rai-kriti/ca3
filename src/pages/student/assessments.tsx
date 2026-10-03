// Student Assessments Page – M5: Assessment & Mock Interview history
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAssessmentsForStudent, getMockInterviewsForStudent } from '@/lib/mockData';
import { PageHeader, StatCard, SectionHeader, ProgressBar, TabBar } from '@/components/ui';
import { ScoreRing } from '@/components/ui';
import { useState } from 'react';
import Head from 'next/head';

export default function StudentAssessments() {
  const { user, student } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('assessments');

  useEffect(() => {
    if (!user || user.role !== 'student') router.push('/');
  }, [user, router]);

  if (!student) return null;

  const assessments = getAssessmentsForStudent(student.id);
  const mockInterviews = getMockInterviewsForStudent(student.id);

  const avgAssessment = assessments.length
    ? Math.round(assessments.reduce((s, a) => s + (a.score / a.maxScore) * 100, 0) / assessments.length)
    : 0;

  const avgMI = mockInterviews.length
    ? Math.round(mockInterviews.reduce((s, m) => s + m.overallScore * 10, 0) / mockInterviews.length)
    : 0;

  const typeColors: Record<string, string> = {
    aptitude: '#f59e0b', coding: '#6366f1', technical: '#0ea5e9',
    communication: '#10b981', group_discussion: '#ec4899',
  };

  const tabs = [
    { id: 'assessments', label: 'Assessments', count: assessments.length },
    { id: 'mock_interviews', label: 'Mock Interviews', count: mockInterviews.length },
  ];

  return (
    <Layout>
      <Head><title>Assessments – PlacementIQ</title></Head>
      <PageHeader title="Assessments & Mock Interviews" subtitle="M5 – Rubric-based evaluation history" badge="M5 · Assessment Engine" />

      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Assessments" value={assessments.length} icon="✍️" color="violet" />
          <StatCard label="Avg Assessment" value={`${avgAssessment}%`} icon="📊" color="cyan" />
          <StatCard label="Mock Interviews" value={mockInterviews.length} icon="🎙️" color="emerald" />
          <StatCard label="Avg MI Score" value={`${avgMI}%`} icon="⭐" color="amber" />
        </div>

        <div className="mb-6">
          <TabBar tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {tab === 'assessments' && (
          <div className="space-y-4">
            {assessments.map(a => {
              const pct = Math.round((a.score / a.maxScore) * 100);
              const color = typeColors[a.type] || '#6366f1';
              return (
                <div key={a.id} className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 card-hover">
                  <div className="flex flex-wrap items-start gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{a.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${color}20`, color }}>
                          {a.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-3">
                        📅 {new Date(a.conductedAt).toLocaleDateString()} ·
                        Score: {a.score}/{a.maxScore}
                        {a.notes && ` · ${a.notes}`}
                      </div>
                      {a.rubric && (
                        <div className="space-y-2">
                          {a.rubric.map((r, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 w-24 flex-shrink-0">{r.criterion}</span>
                              <ProgressBar value={r.score} max={r.maxScore} showValue={true} color={color} />
                              <span className="text-xs text-gray-500 w-32 flex-shrink-0 truncate">{r.feedback}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <ScoreRing score={pct} size={80} strokeWidth={8} label="Score" />
                    </div>
                  </div>
                </div>
              );
            })}
            {assessments.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <div className="text-3xl mb-2">✍️</div>
                <p className="font-medium">No assessments recorded yet</p>
              </div>
            )}
          </div>
        )}

        {tab === 'mock_interviews' && (
          <div className="space-y-4">
            {mockInterviews.map(mi => {
              const dimData = Object.entries(mi.dimensions);
              return (
                <div key={mi.id} className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 card-hover">
                  <div className="flex flex-wrap items-start gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🎙️</span>
                        <span className="font-semibold text-white">Mock Interview</span>
                        <span className="text-xs text-gray-500">📅 {new Date(mi.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4 italic">"{mi.feedback}"</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {dimData.map(([dim, score]) => (
                          <div key={dim} className="bg-gray-800/50 rounded-xl p-3">
                            <div className="text-xs text-gray-500 capitalize mb-1">{dim.replace(/([A-Z])/g, ' $1')}</div>
                            <ProgressBar value={score * 10} showValue={false} color="#6366f1" />
                            <div className="text-sm font-bold text-violet-300 mt-1">{score}/10</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <ScoreRing score={mi.overallScore * 10} size={80} strokeWidth={8} label="Score" />
                    </div>
                  </div>
                </div>
              );
            })}
            {mockInterviews.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <div className="text-3xl mb-2">🎙️</div>
                <p className="font-medium">No mock interviews recorded yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
