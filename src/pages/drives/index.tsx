// Drives List Page – M7: Drive browsing + eligibility check for students
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  drives, registrations, computeEligibility, getSkillById
} from '@/lib/mockData';
import {
  PageHeader, DriveStatusBadge, LevelBadge, StatCard, SectionHeader
} from '@/components/ui';
import { ScoreRing } from '@/components/ui';
import { gapAnalyses } from '@/lib/mockData';
import Head from 'next/head';

export default function DrivesPage() {
  const { user, student } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  const isStudent = user?.role === 'student';
  const isOfficer = user?.role === 'placement_officer' || user?.role === 'placement_head';

  const myRegistrations = isStudent && student
    ? registrations.filter(r => r.studentId === student.id)
    : [];

  const openDrives = drives.filter(d => d.status === 'registration_open' || d.status === 'published');
  const otherDrives = drives.filter(d => d.status === 'draft' || d.status === 'closed' || d.status === 'completed');

  return (
    <Layout>
      <Head><title>Placement Drives – PlacementIQ</title></Head>
      <PageHeader
        title="Placement Drives"
        subtitle="Active and upcoming recruitment drives with eligibility and readiness indicators"
        badge="M7 · Drive & Eligibility Management"
      >
        {isOfficer && (
          <button className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl transition-colors">
            + Create Drive
          </button>
        )}
      </PageHeader>

      <div className="p-8">
        {/* Quick stats for student */}
        {isStudent && student && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Open Drives" value={openDrives.length} icon="🏢" color="violet" />
            <StatCard label="Registered" value={myRegistrations.length} icon="📝" color="cyan" />
            <StatCard label="Shortlisted" value={myRegistrations.filter(r => r.status === 'shortlisted').length} icon="⭐" color="emerald" />
            <StatCard label="CGPA" value={student.cgpa} icon="🎓" color="amber" />
          </div>
        )}

        <SectionHeader title="Open Drives" subtitle="Drives currently accepting registrations" />
        <div className="space-y-4 mb-10">
          {openDrives.map(drive => {
            const myReg = myRegistrations.find(r => r.driveId === drive.id);
            const eligibility = isStudent && student ? computeEligibility(student, drive) : null;
            const myGA = isStudent && student ? gapAnalyses.find(g => g.studentId === student.id && g.driveId === drive.id) : null;

            return (
              <div key={drive.id} className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden card-hover">
                <div className="p-6">
                  <div className="flex flex-wrap items-start gap-4">
                    {/* Company + Role */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-xl text-white">{drive.company}</span>
                        <DriveStatusBadge status={drive.status} />
                      </div>
                      <div className="text-lg text-violet-300 font-medium mb-2">{drive.role}</div>
                      <p className="text-sm text-gray-400 mb-3 leading-relaxed">{drive.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>💰 {drive.package}</span>
                        <span>📅 Drive: {new Date(drive.driveDate).toLocaleDateString()}</span>
                        <span>⏰ Deadline: {new Date(drive.registrationDeadline).toLocaleDateString()}</span>
                        {drive.totalSeats && <span>💺 Seats: {drive.totalSeats}</span>}
                      </div>
                    </div>

                    {/* Eligibility / Readiness for student */}
                    {isStudent && student && eligibility && (
                      <div className="flex flex-col gap-3 flex-shrink-0">
                        {/* Eligibility */}
                        <div className={`rounded-xl border px-3 py-2 text-center ${
                          eligibility.eligible
                            ? 'bg-emerald-900/30 border-emerald-700/40'
                            : 'bg-red-900/30 border-red-700/40'
                        }`}>
                          <div className={`text-xs font-semibold ${eligibility.eligible ? 'text-emerald-400' : 'text-red-400'}`}>
                            {eligibility.eligible ? '✅ Eligible' : '❌ Ineligible'}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">Eligibility</div>
                        </div>
                        {/* Readiness */}
                        {myGA && (
                          <div className="flex flex-col items-center">
                            <ScoreRing score={myGA.matchScore} size={64} strokeWidth={7} />
                            <div className="text-xs text-gray-500 mt-1">Readiness</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Match score for officer */}
                    {isOfficer && (
                      <div className="text-xs text-gray-500 flex flex-col gap-1 flex-shrink-0">
                        <span>Registered: {registrations.filter(r => r.driveId === drive.id).length}</span>
                        <span>Eligible: {registrations.filter(r => r.driveId === drive.id && r.isEligible).length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Required skills */}
                <div className="border-t border-gray-800 px-6 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500 mr-1">Required skills:</span>
                    {drive.requiredSkills.slice(0, 6).map(req => {
                      const sk = getSkillById(req.skillId);
                      return (
                        <div key={req.skillId} className="flex items-center gap-1">
                          <span className="text-xs text-gray-300">{sk?.name}</span>
                          <LevelBadge level={req.minLevel} size="xs" />
                          {req.mandatory && <span className="text-red-500 text-xs">*</span>}
                        </div>
                      );
                    })}
                    {drive.requiredSkills.length > 6 && (
                      <span className="text-xs text-gray-600">+{drive.requiredSkills.length - 6} more</span>
                    )}
                  </div>
                </div>

                {/* Eligibility details + actions */}
                {isStudent && student && eligibility && (
                  <div className={`border-t px-6 py-3 flex items-center justify-between ${
                    eligibility.eligible ? 'border-emerald-800/40 bg-emerald-950/20' : 'border-red-800/40 bg-red-950/20'
                  }`}>
                    <span className="text-xs text-gray-400">{eligibility.reason}</span>
                    {eligibility.eligible && !myReg && (
                      <button className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition-colors">
                        Register →
                      </button>
                    )}
                    {myReg && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Status:</span>
                        <span className={`text-xs font-medium capitalize ${
                          myReg.status === 'shortlisted' ? 'text-emerald-400' : 'text-blue-400'
                        }`}>{myReg.status}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Other drives */}
        {otherDrives.length > 0 && isOfficer && (
          <>
            <SectionHeader title="Draft / Closed Drives" />
            <div className="space-y-3">
              {otherDrives.map(drive => (
                <div key={drive.id} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex items-center gap-4 opacity-60">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-300">{drive.company}</span>
                      <span className="text-sm text-gray-500">–</span>
                      <span className="text-sm text-gray-400">{drive.role}</span>
                      <DriveStatusBadge status={drive.status} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{drive.package}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
