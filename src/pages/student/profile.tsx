// Student Profile Page – M4: Skill Profile aggregated from evidence
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  getProfileForStudent, getEvidenceForStudent, getSkillById,
  skills, skillClusters
} from '@/lib/mockData';
import { PageHeader, StatCard, LevelBadge, VerifBadge, ProgressBar, SectionHeader } from '@/components/ui';
import type { SkillLevel } from '@/types';
import Head from 'next/head';

const LEVEL_NUM: Record<SkillLevel, number> = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };

export default function StudentProfile() {
  const { user, student } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'student') router.push('/');
  }, [user, router]);

  if (!student) return null;

  const profile = getProfileForStudent(student.id);
  const evidence = getEvidenceForStudent(student.id);
  const verifiedEvidence = evidence.filter(e => e.verificationStatus === 'verified');

  // Group claims by cluster
  const claimsByCluster = skillClusters.map(cluster => ({
    cluster,
    claims: (profile?.claims || []).filter(c => {
      const sk = getSkillById(c.skillId);
      return sk?.cluster === cluster.id;
    }),
  })).filter(g => g.claims.length > 0);

  return (
    <Layout>
      <Head><title>My Skill Profile – PlacementIQ</title></Head>

      <PageHeader
        title={student.name}
        subtitle={`${student.rollNumber} · ${student.branch} · Batch ${student.batch}`}
        badge="M4 · Student Skill Profile"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">CGPA</span>
          <span className={`text-lg font-bold ${student.cgpa >= 8.0 ? 'text-emerald-400' : student.cgpa >= 7.0 ? 'text-amber-400' : 'text-red-400'}`}>
            {student.cgpa}
          </span>
        </div>
      </PageHeader>

      <div className="p-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Skills Claimed" value={profile?.claims.length ?? 0} icon="🧠" color="violet" />
          <StatCard label="Verified Evidence" value={verifiedEvidence.length} icon="✅" color="emerald" sub={`of ${evidence.length} total`} />
          <StatCard label="CGPA" value={student.cgpa} icon="🎓" color="cyan" sub={`${student.branch} · Year ${student.year}`} />
          <StatCard label="Backlogs" value={student.backlogs} icon="⚠️" color={student.backlogs === 0 ? 'emerald' : 'amber'} sub={student.backlogs === 0 ? 'Clean record' : 'Active backlog'} />
        </div>

        {/* Profile completeness */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-8">
          <SectionHeader title="Profile Completeness" subtitle="Based on evidence coverage and verification status" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProgressBar value={profile?.claims.length ?? 0} max={12} label="Skills documented" color="#6366f1" />
            <ProgressBar value={verifiedEvidence.length} max={evidence.length || 1} label="Evidence verified" color="#10b981" />
            <ProgressBar value={Math.round((profile?.claims.filter(c => c.verifiedLevel).length ?? 0) / (profile?.claims.length || 1) * 100)} max={100} label="Verified skill coverage" color="#f59e0b" />
          </div>
        </div>

        {/* Skill profile by cluster */}
        <SectionHeader title="Skill Profile by Domain" subtitle="Aggregated from all evidence sources with verification status" />
        <div className="space-y-6">
          {claimsByCluster.map(({ cluster, claims }) => (
            <div key={cluster.id} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cluster.color }}></div>
                <h3 className="font-semibold text-gray-200">{cluster.name}</h3>
                <span className="text-xs text-gray-500 ml-1">{claims.length} skills</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {claims.map(claim => {
                  const sk = getSkillById(claim.skillId);
                  return (
                    <div key={claim.skillId} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-sm text-white">{sk?.name ?? claim.skillId}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{claim.evidenceCount} evidence item{claim.evidenceCount !== 1 ? 's' : ''}</div>
                        </div>
                        <LevelBadge level={claim.level} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Confidence</span>
                          <span>{Math.round(claim.confidence * 100)}%</span>
                        </div>
                        <ProgressBar value={Math.round(claim.confidence * 100)} showValue={false} color={cluster.color} />
                        {claim.verifiedLevel ? (
                          <div className="flex items-center gap-1 text-xs text-emerald-400">
                            <span>✓</span>
                            <span>Faculty-verified at {claim.verifiedLevel}</span>
                          </div>
                        ) : (
                          <div className="text-xs text-amber-500">⏳ Pending verification</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Student info */}
        <div className="mt-8 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <SectionHeader title="Personal Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm text-gray-200">{student.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
                <span className="text-sm text-gray-500">Phone</span>
                <span className="text-sm text-gray-200">{student.phone}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">Branch</span>
                <span className="text-sm text-gray-200">{student.branch}</span>
              </div>
            </div>
            <div className="space-y-1">
              {student.linkedInUrl && (
                <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
                  <span className="text-sm text-gray-500">LinkedIn</span>
                  <a href={student.linkedInUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate max-w-48">{student.linkedInUrl}</a>
                </div>
              )}
              {student.githubUrl && (
                <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
                  <span className="text-sm text-gray-500">GitHub</span>
                  <a href={student.githubUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate max-w-48">{student.githubUrl}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
