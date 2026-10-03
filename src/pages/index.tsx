// Login / Role-selection landing page
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { users, students } from '@/lib/mockData';
import type { User, Student } from '@/types';
import Head from 'next/head';

const allUsers = [...users, ...students];

const roleConfig: Record<string, { color: string; icon: string; desc: string }> = {
  student: { color: 'from-violet-600 to-purple-700', icon: '🎓', desc: 'View readiness, gaps & prep plan' },
  faculty: { color: 'from-blue-600 to-cyan-700', icon: '👩‍🏫', desc: 'Verify evidence, conduct interviews' },
  placement_officer: { color: 'from-emerald-600 to-teal-700', icon: '📋', desc: 'Manage drives & shortlists' },
  placement_head: { color: 'from-orange-600 to-amber-700', icon: '🏛️', desc: 'Full oversight & recruiter access' },
  recruiter: { color: 'from-rose-600 to-pink-700', icon: '🔍', desc: 'Search registered candidates (scoped)' },
  admin: { color: 'from-slate-600 to-gray-700', icon: '⚙️', desc: 'Skill taxonomy & configuration' },
};

export default function HomePage() {
  const { login } = useAuth();
  const router = useRouter();

  function handleLogin(userId: string) {
    login(userId);
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    const roleRoutes: Record<string, string> = {
      student: '/student/profile',
      faculty: '/faculty/verify',
      placement_officer: '/officer/students',
      placement_head: '/officer/analytics',
      recruiter: '/recruiter',
      admin: '/admin/taxonomy',
    };
    router.push(roleRoutes[user.role] ?? '/dashboard');
  }

  const grouped = allUsers.reduce<Record<string, (User | Student)[]>>((acc, u) => {
    (acc[u.role] = acc[u.role] || []).push(u);
    return acc;
  }, {});

  return (
    <>
      <Head>
        <title>PlacementIQ – Sign In</title>
      </Head>
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
        {/* Hero */}
        <div className="text-center mb-12 fade-in-up">
          <div className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-700/40 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-violet-400 pulse-dot"></span>
            P06 · Evidence-Based Placement Readiness Platform
          </div>
          <h1 className="text-5xl font-extrabold mb-3 gradient-text">PlacementIQ</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Skill gaps identified weeks before a drive. Targeted training, not generic.
            A defensible batch readiness picture for every placement cycle.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6 text-sm text-gray-500">
            {['Skill Taxonomy', 'Evidence Verification', 'Readiness Engine', 'Gap Analysis', 'Prep Planning', 'Recruiter Portal'].map(f => (
              <span key={f} className="bg-gray-900 border border-gray-800 rounded-full px-3 py-1">{f}</span>
            ))}
          </div>
        </div>

        {/* Role cards */}
        <div className="w-full max-w-5xl">
          <h2 className="text-center text-gray-400 text-sm font-medium uppercase tracking-wider mb-6">Select a demo account to explore</h2>
          <div className="space-y-6">
            {Object.entries(grouped).map(([role, roleUsers]) => {
              const cfg = roleConfig[role] || { color: 'from-gray-600 to-gray-700', icon: '👤', desc: '' };
              return (
                <div key={role} className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center text-xl`}>{cfg.icon}</div>
                    <div>
                      <div className="font-semibold capitalize">{role.replace('_', ' ')}</div>
                      <div className="text-xs text-gray-500">{cfg.desc}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {roleUsers.map(u => (
                      <button key={u.id} onClick={() => handleLogin(u.id)}
                        className="flex items-center gap-3 bg-gray-900/60 hover:bg-gray-800/80 border border-gray-700/50 hover:border-violet-500/50 rounded-xl p-3 text-left transition-all duration-200 group card-hover">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${cfg.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                          {u.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate group-hover:text-white">{u.name}</div>
                          {'rollNumber' in u && <div className="text-xs text-gray-500 truncate">{(u as Student).rollNumber} · {(u as Student).branch}</div>}
                          {'company' in u && u.company && <div className="text-xs text-gray-500 truncate">{u.company}</div>}
                          {'designation' in u && u.designation && <div className="text-xs text-gray-500 truncate">{u.designation}</div>}
                        </div>
                        <span className="ml-auto text-gray-600 group-hover:text-violet-400 transition-colors">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Design note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-700 max-w-lg mx-auto">
            Track J · Next.js + In-Memory Mock Database · No external DB required ·
            Eligibility and readiness are computed independently · Recruiter portal has scoped access with audit logging
          </p>
        </div>
      </div>
    </>
  );
}
