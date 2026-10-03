// Student Gap Analysis Page – M8: Per-drive gap analysis ranked by impact
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  gapAnalyses, drives, getSkillById, computeEligibility, getReadinessForStudent
} from '@/lib/mockData';
import { PageHeader, GapBadge, LevelBadge, DriveStatusBadge, SectionHeader, ProgressBar, StatCard } from '@/components/ui';
import { ScoreRing } from '@/components/ui';
import Link from 'next/link';
import Head from 'next/head';

export default function StudentGaps() {
  const { user, student } = useAuth();
  const router = useRouter();
  const [selectedDrive, setSelectedDrive] = useState<string>('');

  useEffect(() => {
    if (!user || user.role !== 'student') router.push('/');
  }, [user, router]);

  if (!student) return null;

  const myGapAnalyses = gapAnalyses.filter(g => g.studentId === student.id);
  const readiness = getReadinessForStudent(student.id);

  // Pick selected drive's gap analysis
  const activeGA = selectedDrive
    ? myGapAnalyses.find(g => g.driveId === selectedDrive)
    : myGapAnalyses[0];

  const activeDrive = activeGA ? drives.find(d => d.id === activeGA.driveId) : undefined;
  const eligibility = activeDrive ? computeEligibility(student, activeDrive) : null;

  const sortedGaps = activeGA ? [...activeGA.gaps].sort((a, b) => b.impact - a.impact) : [];

  return (
    <Layout>
      <Head><title>Gap Analysis – PlacementIQ</title></Head>
      <PageHeader
        title="Gap Analysis"
        subtitle="Ranked, actionable skill gaps for each drive. Eligibility and readiness are computed independently."
        badge="M8 · Match & Gap Analysis"
      />

      <div className="p-8">
        {myGapAnalyses.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <div className="text-4xl mb-3">🎯</div>
            <div className="font-semibold text-gray-300 mb-1">No gap analyses yet</div>
            <p className="text-sm">Register for a drive to compute your gap analysis.</p>
          </div>
        ) : (
          <>
            {/* Drive selector */}
            <div className="mb-6 flex flex-wrap gap-2">
              {myGapAnalyses.map(ga => {
                const d = drives.find(dr => dr.id === ga.driveId);
                return (
                  <button key={ga.driveId}
                    onClick={() => setSelectedDrive(ga.driveId)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      (activeGA?.driveId === ga.driveId)
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-violet-500/50'
                    }`}>
                    {d?.company} – {d?.role}
                  </button>
                );
              })}
            </div>

            {activeGA && activeDrive && eligibility && (
              <>
                {/* Eligibility vs Readiness panel – the critical design distinction */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Eligibility */}
                  <div className={`rounded-2xl border p-6 ${
                    eligibility.eligible
                      ? 'bg-emerald-950/30 border-emerald-700/40'
                      : 'bg-red-950/30 border-red-700/40'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{eligibility.eligible ? '✅' : '❌'}</span>
                      <span className="font-semibold text-white">Eligibility</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${eligibility.eligible ? 'bg-emerald-900/60 text-emerald-400' : 'bg-red-900/60 text-red-400'}`}>
                        {eligibility.eligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{eligibility.reason}</p>
                    <div className="mt-3 text-xs text-gray-600 border-t border-gray-700/40 pt-3">
                      Min CGPA: {activeDrive.eligibilityCriteria.minCGPA} ·
                      Max Backlogs: {activeDrive.eligibilityCriteria.maxBacklogs} ·
                      Branches: {activeDrive.eligibilityCriteria.allowedBranches.join(', ')}
                    </div>
                  </div>

                  {/* Readiness */}
                  <div className={`rounded-2xl border p-6 ${
                    activeGA.matchScore >= 80
                      ? 'bg-emerald-950/30 border-emerald-700/40'
                      : activeGA.matchScore >= 60
                      ? 'bg-amber-950/30 border-amber-700/40'
                      : 'bg-red-950/30 border-red-700/40'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📊</span>
                        <span className="font-semibold text-white">Drive Readiness</span>
                      </div>
                      <ScoreRing score={activeGA.matchScore} size={64} strokeWidth={7} />
                    </div>
                    <p className="text-sm text-gray-400">
                      Match score for {activeDrive.role} at {activeDrive.company}.
                      {activeGA.matchScore < 70 && ' Focus on critical gaps below.'}
                    </p>
                    <div className="mt-3 text-xs text-gray-600 border-t border-gray-700/40 pt-3">
                      Overall readiness: {readiness?.overallScore ?? '—'}/100 · Drive match: {activeGA.matchScore}/100
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {activeGA.strengths.length > 0 && (
                  <div className="bg-emerald-950/20 border border-emerald-700/30 rounded-2xl p-5 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">💪</span>
                      <span className="font-semibold text-emerald-300">Strengths – Skills meeting or exceeding requirements</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeGA.strengths.map(sid => {
                        const sk = getSkillById(sid);
                        return (
                          <span key={sid} className="bg-emerald-900/40 text-emerald-300 border border-emerald-700/40 rounded-full px-3 py-1 text-sm">
                            ✓ {sk?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Gap list – ranked by impact */}
                <SectionHeader
                  title="Skill Gaps – Ranked by Impact"
                  subtitle="Ordered by impact on drive match score. Address critical gaps first."
                  action={
                    <Link href="/student/plan" className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl transition-colors">
                      View Prep Plan →
                    </Link>
                  }
                />
                <div className="space-y-3">
                  {sortedGaps.map((gap, idx) => (
                    <div key={gap.skillId}
                      className={`bg-gray-900/60 border rounded-2xl p-5 transition-all ${
                        gap.severity === 'critical' ? 'border-red-700/40' :
                        gap.severity === 'high' ? 'border-orange-700/40' :
                        gap.severity === 'medium' ? 'border-amber-700/40' : 'border-gray-700/40'
                      }`}>
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-gray-400">#{idx + 1}</span>
                            <span className="font-semibold text-white">{gap.skillName}</span>
                            <GapBadge severity={gap.severity} />
                            {gap.mandatory && (
                              <span className="text-xs bg-red-950/60 text-red-400 border border-red-800/50 rounded-full px-2 py-0.5">
                                Mandatory
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Required: </span>
                              <LevelBadge level={gap.required} size="xs" />
                            </div>
                            <div>
                              <span className="text-gray-500">Current: </span>
                              {gap.current ? <LevelBadge level={gap.current} size="xs" /> : <span className="text-xs text-gray-600">Not evidenced</span>}
                            </div>
                          </div>
                        </div>
                        <div className="w-32">
                          <div className="text-xs text-gray-500 mb-1 text-right">Impact on score</div>
                          <ProgressBar value={gap.impact} showValue={true}
                            color={gap.severity === 'critical' ? '#ef4444' : gap.severity === 'high' ? '#f97316' : gap.severity === 'medium' ? '#f59e0b' : '#6366f1'} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {sortedGaps.length === 0 && (
                  <div className="text-center text-gray-500 py-8 bg-gray-900/40 rounded-2xl border border-gray-800">
                    <div className="text-3xl mb-2">🎉</div>
                    <div className="font-semibold text-emerald-400">No significant gaps!</div>
                    <p className="text-sm mt-1">You meet or exceed all drive requirements.</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
