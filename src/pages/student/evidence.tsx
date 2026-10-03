// Student Evidence Page – M2 & M3: Evidence ingestion and verification status
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getEvidenceForStudent, getSkillById } from '@/lib/mockData';
import { PageHeader, VerifBadge, LevelBadge, SectionHeader, StatCard, TabBar } from '@/components/ui';
import type { EvidenceType } from '@/types';
import Head from 'next/head';

const typeIcons: Record<EvidenceType, string> = {
  academic_result: '🎓', project: '💼', certification: '🏆',
  assessment: '✍️', mock_interview: '🎙️', external_course: '📚', hackathon: '🏁',
};

const typeLabels: Record<EvidenceType, string> = {
  academic_result: 'Academic', project: 'Project', certification: 'Certification',
  assessment: 'Assessment', mock_interview: 'Mock Interview', external_course: 'Course', hackathon: 'Hackathon',
};

export default function StudentEvidence() {
  const { user, student } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'student') router.push('/');
  }, [user, router]);

  if (!student) return null;

  const evidence = getEvidenceForStudent(student.id);
  const tabs = [
    { id: 'all', label: 'All', count: evidence.length },
    { id: 'verified', label: 'Verified', count: evidence.filter(e => e.verificationStatus === 'verified').length },
    { id: 'pending', label: 'Pending', count: evidence.filter(e => e.verificationStatus === 'pending').length },
    { id: 'unverified', label: 'Unverified', count: evidence.filter(e => e.verificationStatus === 'unverified').length },
  ];

  const filtered = activeTab === 'all' ? evidence : evidence.filter(e => e.verificationStatus === activeTab);

  return (
    <Layout>
      <Head><title>Evidence – PlacementIQ</title></Head>
      <PageHeader
        title="Evidence Portfolio"
        subtitle="Your skill evidence from academic results, projects, certifications, assessments and mock interviews"
        badge="M2 · Evidence Ingestion & M3 · Verification"
      >
        <button onClick={() => setShowForm(v => !v)}
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl transition-colors">
          + Add Evidence
        </button>
      </PageHeader>

      <div className="p-8">
        {/* Add Evidence Form (demo) */}
        {showForm && (
          <div className="mb-8 bg-gray-900/80 border border-violet-700/30 rounded-2xl p-6 fade-in-up">
            <div className="text-sm font-semibold text-violet-300 mb-4">📋 Submit New Evidence</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Evidence Type</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none">
                  {Object.entries(typeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Skill</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none">
                  {['React','TypeScript','Node.js','Python','DSA','System Design','Machine Learning'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Title</label>
                <input type="text" placeholder="e.g. E-commerce React App"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Claimed Level</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none">
                  {['beginner','intermediate','advanced','expert'].map(l => <option key={l} className="capitalize">{l}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Description</label>
                <textarea rows={2} placeholder="Describe the evidence..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">External URL (optional)</label>
                <input type="url" placeholder="https://github.com/..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl transition-colors"
                onClick={() => setShowForm(false)}>Submit Evidence</button>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-200 text-sm px-4 py-2 transition-colors">Cancel</button>
            </div>
            <p className="text-xs text-gray-600 mt-3">⚠️ Students cannot self-verify evidence. Faculty will review and verify submitted items.</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Items" value={evidence.length} icon="📋" color="violet" />
          <StatCard label="Verified" value={evidence.filter(e => e.verificationStatus === 'verified').length} icon="✅" color="emerald" />
          <StatCard label="Pending" value={evidence.filter(e => e.verificationStatus === 'pending').length} icon="⏳" color="amber" />
          <StatCard label="Evidence Types" value={new Set(evidence.map(e => e.type)).size} icon="🗂️" color="cyan" />
        </div>

        {/* Tabs + list */}
        <div className="mb-6">
          <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="space-y-3">
          {filtered.map(ev => {
            const sk = getSkillById(ev.skillId);
            return (
              <div key={ev.id} className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-5 card-hover">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                    {typeIcons[ev.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{ev.title}</span>
                      <VerifBadge status={ev.verificationStatus} />
                      <LevelBadge level={ev.level} size="xs" />
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{ev.description}</div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>🏷️ {typeLabels[ev.type]}</span>
                      <span>🧠 {sk?.name ?? ev.skillId}</span>
                      {ev.score !== undefined && <span>📊 Score: {ev.score}/100</span>}
                      <span>📅 {new Date(ev.submittedAt).toLocaleDateString()}</span>
                      {ev.verifiedAt && <span>✓ Verified: {new Date(ev.verifiedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  {ev.externalUrl && (
                    <a href={ev.externalUrl} target="_blank" rel="noreferrer"
                      className="text-xs bg-blue-900/30 text-blue-400 border border-blue-700/40 rounded-lg px-2 py-1 hover:bg-blue-900/50 transition-colors flex-shrink-0">
                      View →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-12 bg-gray-900/30 rounded-2xl border border-gray-800">
              <div className="text-3xl mb-2">📋</div>
              <div className="font-medium text-gray-400">No evidence in this category</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
