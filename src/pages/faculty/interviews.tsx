// Faculty Mock Interviews Page – M5: Record and view mock interview evaluations
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { mockInterviews, students } from '@/lib/mockData';
import { PageHeader, StatCard, ProgressBar, SectionHeader } from '@/components/ui';
import Head from 'next/head';

export default function FacultyInterviews() {
  const { user } = useAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'faculty') router.push('/');
  }, [user, router]);

  const myInterviews = mockInterviews.filter(m => m.conductedBy === user?.id);
  const avgScore = myInterviews.length
    ? (myInterviews.reduce((s, m) => s + m.overallScore, 0) / myInterviews.length).toFixed(1)
    : '—';

  return (
    <Layout>
      <Head><title>Mock Interviews – PlacementIQ</title></Head>
      <PageHeader
        title="Mock Interviews"
        subtitle="Record and review rubric-based mock interview evaluations"
        badge="M5 · Mock Interview Capture"
      >
        <button onClick={() => setShowForm(v => !v)}
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl transition-colors">
          + Record Interview
        </button>
      </PageHeader>

      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Conducted" value={myInterviews.length} icon="🎙️" color="violet" />
          <StatCard label="Avg Score" value={avgScore} icon="⭐" color="amber" sub="out of 10" />
          <StatCard label="Students Covered" value={new Set(myInterviews.map(m => m.studentId)).size} icon="👥" color="cyan" />
        </div>

        {/* Record form */}
        {showForm && (
          <div className="mb-8 bg-gray-900/80 border border-violet-700/30 rounded-2xl p-6 fade-in-up">
            <div className="text-sm font-semibold text-violet-300 mb-4">🎙️ Record Mock Interview</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Student</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none">
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Date</label>
                <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none" />
              </div>
              {['Technical', 'Communication', 'Problem Solving', 'Confidence', 'Domain Knowledge'].map(dim => (
                <div key={dim}>
                  <label className="text-xs text-gray-400 block mb-1">{dim} (0–10)</label>
                  <input type="number" min={0} max={10} step={0.5}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Feedback</label>
                <textarea rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl transition-colors" onClick={() => setShowForm(false)}>
                Save Interview
              </button>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-sm px-4 py-2">Cancel</button>
            </div>
          </div>
        )}

        <SectionHeader title="Interview History" subtitle="All interviews you have conducted" />
        <div className="space-y-4">
          {myInterviews.map(mi => {
            const student = students.find(s => s.id === mi.studentId);
            const dimColors: Record<string, string> = {
              technical: '#6366f1', communication: '#10b981', problemSolving: '#0ea5e9',
              confidence: '#f59e0b', domainKnowledge: '#ec4899',
            };
            return (
              <div key={mi.id} className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 card-hover">
                <div className="flex flex-wrap items-start gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {student?.avatarInitials}
                      </div>
                      <span className="font-semibold text-white">{student?.name}</span>
                      <span className="text-xs text-gray-500">{student?.rollNumber}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      📅 {new Date(mi.date).toLocaleDateString()} ·
                      Overall: <span className="text-violet-300 font-bold">{mi.overallScore}/10</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-sm font-bold border ${
                    mi.overallScore >= 8 ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40' :
                    mi.overallScore >= 6 ? 'bg-amber-900/40 text-amber-400 border-amber-700/40' :
                    'bg-red-900/40 text-red-400 border-red-700/40'
                  }`}>
                    {mi.overallScore}/10
                  </div>
                </div>

                {/* Dimension bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {Object.entries(mi.dimensions).map(([dim, score]) => (
                    <ProgressBar
                      key={dim}
                      value={score * 10}
                      label={dim.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                      color={dimColors[dim] || '#6366f1'}
                    />
                  ))}
                </div>

                <div className="bg-gray-800/50 rounded-xl p-3 text-sm text-gray-400 italic">
                  "{mi.feedback}"
                </div>
              </div>
            );
          })}
          {myInterviews.length === 0 && (
            <div className="text-center text-gray-500 py-12 bg-gray-900/30 rounded-2xl border border-gray-800">
              <div className="text-3xl mb-2">🎙️</div>
              <p className="font-medium text-gray-400">No interviews recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
