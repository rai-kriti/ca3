// Faculty Verification Queue – M3: Evidence verification workflow
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { evidenceItems, students, getSkillById } from '@/lib/mockData';
import { PageHeader, VerifBadge, LevelBadge, StatCard, TabBar } from '@/components/ui';
import type { EvidenceType } from '@/types';
import Head from 'next/head';

const typeIcons: Record<EvidenceType, string> = {
  academic_result: '🎓', project: '💼', certification: '🏆',
  assessment: '✍️', mock_interview: '🎙️', external_course: '📚', hackathon: '🏁',
};

export default function FacultyVerify() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('pending');
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user || user.role !== 'faculty') router.push('/');
  }, [user, router]);

  const allEvidence = evidenceItems.filter(e => e.verificationStatus === 'pending');
  const tabs = [
    { id: 'pending', label: 'Pending Review', count: allEvidence.length - verifiedIds.size - rejectedIds.size },
    { id: 'verified', label: 'Verified', count: verifiedIds.size },
    { id: 'rejected', label: 'Rejected', count: rejectedIds.size },
  ];

  const filtered = tab === 'pending'
    ? allEvidence.filter(e => !verifiedIds.has(e.id) && !rejectedIds.has(e.id))
    : tab === 'verified'
    ? allEvidence.filter(e => verifiedIds.has(e.id))
    : allEvidence.filter(e => rejectedIds.has(e.id));

  function getStudent(studentId: string) {
    return students.find(s => s.id === studentId);
  }

  return (
    <Layout>
      <Head><title>Verification Queue – PlacementIQ</title></Head>
      <PageHeader
        title="Verification Queue"
        subtitle="Review and verify student evidence submissions. Faculty must not verify their own students' self-assessments."
        badge="M3 · Evidence Verification"
      />

      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Pending Review" value={allEvidence.length - verifiedIds.size - rejectedIds.size} icon="⏳" color="amber" />
          <StatCard label="Verified Today" value={verifiedIds.size} icon="✅" color="emerald" />
          <StatCard label="Rejected" value={rejectedIds.size} icon="❌" color="rose" />
        </div>

        <div className="mb-6">
          <TabBar tabs={tabs} active={tab} onChange={setTab} />
        </div>

        <div className="space-y-4">
          {filtered.map(ev => {
            const student = getStudent(ev.studentId);
            const skill = getSkillById(ev.skillId);
            const isVerified = verifiedIds.has(ev.id);
            const isRejected = rejectedIds.has(ev.id);

            return (
              <div key={ev.id} className={`bg-gray-900/60 rounded-2xl border overflow-hidden ${
                isVerified ? 'border-emerald-700/40' : isRejected ? 'border-red-700/40' : 'border-gray-700/50'
              }`}>
                <div className="p-6">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                      {typeIcons[ev.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{ev.title}</span>
                        <LevelBadge level={ev.level} size="xs" />
                        {(isVerified || isRejected) && <VerifBadge status={isVerified ? 'verified' : 'rejected'} />}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{ev.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>👤 {student?.name} ({student?.rollNumber})</span>
                        <span>🧠 {skill?.name}</span>
                        {ev.score !== undefined && <span>📊 {ev.score}/100</span>}
                        <span>📅 Submitted {new Date(ev.submittedAt).toLocaleDateString()}</span>
                      </div>
                      {ev.externalUrl && (
                        <a href={ev.externalUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:underline">
                          🔗 View external evidence
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    {!isVerified && !isRejected && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => setVerifiedIds(prev => new Set([...prev, ev.id]))}
                          className="bg-emerald-700/40 hover:bg-emerald-600/60 text-emerald-300 border border-emerald-700/50 text-xs px-3 py-1.5 rounded-lg transition-colors">
                          ✓ Verify
                        </button>
                        <button
                          onClick={() => setRejectedIds(prev => new Set([...prev, ev.id]))}
                          className="bg-red-700/20 hover:bg-red-700/40 text-red-400 border border-red-700/40 text-xs px-3 py-1.5 rounded-lg transition-colors">
                          ✗ Reject
                        </button>
                      </div>
                    )}
                    {isVerified && <span className="text-emerald-400 text-sm flex-shrink-0">✓ Verified</span>}
                    {isRejected && <span className="text-red-400 text-sm flex-shrink-0">✗ Rejected</span>}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-12 bg-gray-900/30 rounded-2xl border border-gray-800">
              <div className="text-3xl mb-2">
                {tab === 'pending' ? '🎉' : tab === 'verified' ? '✅' : '❌'}
              </div>
              <div className="font-medium text-gray-400">
                {tab === 'pending' ? 'Queue is empty!' : `No ${tab} items`}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
