// Officer Drives Management – M7: Create/manage drives, view registrations, shortlist
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { drives, registrations, students, getSkillById, computeEligibility } from '@/lib/mockData';
import { PageHeader, DriveStatusBadge, RegStatusBadge, StatCard, SectionHeader, LevelBadge } from '@/components/ui';
import Head from 'next/head';

export default function OfficerDrives() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDrive, setSelectedDrive] = useState(drives[0]?.id);

  useEffect(() => {
    if (!user || !['placement_officer', 'placement_head'].includes(user.role)) router.push('/');
  }, [user, router]);

  const drive = drives.find(d => d.id === selectedDrive);
  const driveRegs = registrations.filter(r => r.driveId === selectedDrive);
  const eligibleRegs = driveRegs.filter(r => r.isEligible);

  return (
    <Layout>
      <Head><title>Manage Drives – PlacementIQ</title></Head>
      <PageHeader
        title="Drive Management"
        subtitle="Create drives, manage registrations, and publish shortlists"
        badge="M7 · Drive & Eligibility Management"
      >
        <button className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl transition-colors">
          + New Drive
        </button>
      </PageHeader>

      <div className="p-8 flex gap-6">
        {/* Drive list sidebar */}
        <div className="w-72 flex-shrink-0">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">All Drives</div>
          <div className="space-y-2">
            {drives.map(d => (
              <button key={d.id} onClick={() => setSelectedDrive(d.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedDrive === d.id
                    ? 'bg-violet-600/20 border-violet-500/50 text-white'
                    : 'bg-gray-900/60 border-gray-700/50 text-gray-300 hover:border-gray-600'
                }`}>
                <div className="font-medium text-sm truncate mb-1">{d.company}</div>
                <div className="text-xs text-gray-400 truncate mb-2">{d.role}</div>
                <div className="flex items-center justify-between">
                  <DriveStatusBadge status={d.status} />
                  <span className="text-xs text-gray-500">{d.package}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Drive detail */}
        {drive && (
          <div className="flex-1 min-w-0">
            {/* Drive info */}
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">{drive.company}</h2>
                    <DriveStatusBadge status={drive.status} />
                  </div>
                  <div className="text-violet-300 font-medium">{drive.role}</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors">
                    Edit
                  </button>
                  <button className="text-sm bg-emerald-700/30 hover:bg-emerald-700/50 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-700/40 transition-colors">
                    Publish
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">{drive.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-500">Package:</span> <span className="text-white font-medium">{drive.package}</span></div>
                <div><span className="text-gray-500">Seats:</span> <span className="text-white font-medium">{drive.totalSeats ?? '—'}</span></div>
                <div><span className="text-gray-500">Drive Date:</span> <span className="text-white font-medium">{new Date(drive.driveDate).toLocaleDateString()}</span></div>
                <div><span className="text-gray-500">Deadline:</span> <span className="text-white font-medium">{new Date(drive.registrationDeadline).toLocaleDateString()}</span></div>
              </div>
              {/* Eligibility criteria */}
              <div className="mt-4 bg-gray-800/50 rounded-xl p-4">
                <div className="text-xs font-medium text-gray-400 mb-2">Eligibility Criteria</div>
                <div className="flex flex-wrap gap-4 text-xs">
                  <span className="text-gray-300">Min CGPA: <strong>{drive.eligibilityCriteria.minCGPA}</strong></span>
                  <span className="text-gray-300">Max Backlogs: <strong>{drive.eligibilityCriteria.maxBacklogs}</strong></span>
                  <span className="text-gray-300">Branches: <strong>{drive.eligibilityCriteria.allowedBranches.join(', ')}</strong></span>
                </div>
              </div>
              {/* Required skills */}
              <div className="mt-4">
                <div className="text-xs font-medium text-gray-400 mb-2">Required Skills</div>
                <div className="flex flex-wrap gap-2">
                  {drive.requiredSkills.map(req => (
                    <div key={req.skillId} className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2.5 py-1.5 text-xs">
                      <span className="text-gray-200">{getSkillById(req.skillId)?.name}</span>
                      <LevelBadge level={req.minLevel} size="xs" />
                      <span className="text-gray-600">w={req.weight}</span>
                      {req.mandatory && <span className="text-red-500">*</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Registrations */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard label="Registered" value={driveRegs.length} icon="📝" color="violet" />
              <StatCard label="Eligible" value={eligibleRegs.length} icon="✅" color="emerald" />
              <StatCard label="Shortlisted" value={driveRegs.filter(r => r.status === 'shortlisted').length} icon="⭐" color="amber" />
            </div>

            <SectionHeader title="Registrations" subtitle="All students who registered for this drive" />
            <div className="space-y-2">
              {driveRegs.map(reg => {
                const st = students.find(s => s.id === reg.studentId);
                return (
                  <div key={reg.id} className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 flex flex-wrap items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {st?.avatarInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{st?.name}</span>
                        <span className="text-xs text-gray-500">{st?.rollNumber}</span>
                      </div>
                      <div className="text-xs text-gray-500">CGPA {st?.cgpa} · {st?.branch}</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-lg ${reg.isEligible ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
                      {reg.isEligible ? 'Eligible' : 'Ineligible'}
                    </div>
                    <RegStatusBadge status={reg.status} />
                    <div className="flex gap-2">
                      {reg.status === 'applied' && reg.isEligible && (
                        <button className="text-xs bg-emerald-700/30 text-emerald-400 border border-emerald-700/40 px-2 py-1 rounded-lg hover:bg-emerald-700/50 transition-colors">
                          Shortlist
                        </button>
                      )}
                      {reg.status === 'applied' && (
                        <button className="text-xs bg-red-700/20 text-red-400 border border-red-700/30 px-2 py-1 rounded-lg hover:bg-red-700/40 transition-colors">
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
