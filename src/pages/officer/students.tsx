// Placement Officer – Student Overview with readiness indicators
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  students, getReadinessForStudent, getProfileForStudent,
  getEvidenceForStudent, drives, registrations, computeEligibility
} from '@/lib/mockData';
import { PageHeader, StatCard, LevelBadge, SectionHeader } from '@/components/ui';
import { ScoreRing } from '@/components/ui';
import Head from 'next/head';

export default function OfficerStudents() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'readiness' | 'cgpa' | 'name'>('readiness');

  useEffect(() => {
    if (!user || !['placement_officer', 'placement_head'].includes(user.role)) router.push('/');
  }, [user, router]);

  const filteredStudents = students
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'readiness') {
        const ra = getReadinessForStudent(a.id)?.overallScore ?? 0;
        const rb = getReadinessForStudent(b.id)?.overallScore ?? 0;
        return rb - ra;
      }
      if (sortBy === 'cgpa') return b.cgpa - a.cgpa;
      return a.name.localeCompare(b.name);
    });

  const avgReadiness = students.reduce((s, st) => s + (getReadinessForStudent(st.id)?.overallScore ?? 0), 0) / students.length;
  const readyCount = students.filter(s => (getReadinessForStudent(s.id)?.overallScore ?? 0) >= 70).length;
  const notReadyCount = students.length - readyCount;

  return (
    <Layout>
      <Head><title>Student Overview – PlacementIQ</title></Head>
      <PageHeader
        title="Student Overview"
        subtitle="Batch readiness picture with eligibility and skill indicators"
        badge="M10 · Batch Reporting"
      />

      <div className="p-8">
        {/* Batch stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Students" value={students.length} icon="👥" color="violet" />
          <StatCard label="Avg Readiness" value={`${Math.round(avgReadiness)}%`} icon="📊" color="cyan" />
          <StatCard label="Ready (≥70)" value={readyCount} icon="✅" color="emerald" sub="of total batch" />
          <StatCard label="Need Prep" value={notReadyCount} icon="⚠️" color="amber" sub="readiness < 70" />
        </div>

        {/* Search + sort */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, roll number or branch..."
            className="flex-1 min-w-64 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 focus:outline-none"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'readiness' | 'cgpa' | 'name')}
            className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:border-violet-500 focus:outline-none"
          >
            <option value="readiness">Sort: Readiness</option>
            <option value="cgpa">Sort: CGPA</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {/* Student table / cards */}
        <div className="space-y-3">
          {filteredStudents.map(st => {
            const readiness = getReadinessForStudent(st.id);
            const profile = getProfileForStudent(st.id);
            const evidence = getEvidenceForStudent(st.id);
            const myRegs = registrations.filter(r => r.studentId === st.id);
            const shortlisted = myRegs.filter(r => r.status === 'shortlisted').length;
            const score = readiness?.overallScore ?? 0;

            return (
              <div key={st.id} className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-5 card-hover">
                <div className="flex flex-wrap items-center gap-5">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {st.avatarInitials}
                  </div>

                  {/* Identity */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-white">{st.name}</span>
                      <span className="text-xs text-gray-500">{st.rollNumber}</span>
                    </div>
                    <div className="text-xs text-gray-500">{st.branch} · CGPA {st.cgpa} · {st.backlogs} backlog{st.backlogs !== 1 ? 's' : ''}</div>
                  </div>

                  {/* Skills count */}
                  <div className="text-center flex-shrink-0">
                    <div className="text-lg font-bold text-violet-300">{profile?.claims.length ?? 0}</div>
                    <div className="text-xs text-gray-500">Skills</div>
                  </div>

                  {/* Evidence */}
                  <div className="text-center flex-shrink-0">
                    <div className="text-lg font-bold text-cyan-300">{evidence.filter(e => e.verificationStatus === 'verified').length}/{evidence.length}</div>
                    <div className="text-xs text-gray-500">Verified</div>
                  </div>

                  {/* Registrations */}
                  <div className="text-center flex-shrink-0">
                    <div className="text-lg font-bold text-emerald-300">{shortlisted}/{myRegs.length}</div>
                    <div className="text-xs text-gray-500">Shortlisted</div>
                  </div>

                  {/* Readiness ring */}
                  <div className="flex-shrink-0">
                    {readiness ? (
                      <ScoreRing score={score} size={60} strokeWidth={7} label="Ready" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-600">N/A</div>
                    )}
                  </div>

                  {/* Readiness label */}
                  <div className={`text-xs font-medium flex-shrink-0 px-2 py-1 rounded-lg ${
                    score >= 80 ? 'bg-emerald-900/40 text-emerald-400' :
                    score >= 60 ? 'bg-amber-900/40 text-amber-400' :
                    score > 0 ? 'bg-red-900/40 text-red-400' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {score >= 80 ? 'Ready' : score >= 60 ? 'Partial' : score > 0 ? 'Not Ready' : '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
