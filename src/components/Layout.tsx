// Shared Layout with sidebar navigation
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠', roles: ['student','faculty','placement_officer','placement_head','admin'] },
  { label: 'My Profile', href: '/student/profile', icon: '👤', roles: ['student'] },
  { label: 'Readiness', href: '/student/readiness', icon: '📊', roles: ['student'] },
  { label: 'Drives', href: '/drives', icon: '🏢', roles: ['student','placement_officer','placement_head'] },
  { label: 'Gap Analysis', href: '/student/gaps', icon: '🎯', roles: ['student'] },
  { label: 'Prep Plan', href: '/student/plan', icon: '📅', roles: ['student'] },
  { label: 'Evidence', href: '/student/evidence', icon: '📋', roles: ['student'] },
  { label: 'Assessments', href: '/student/assessments', icon: '✍️', roles: ['student'] },
  { label: 'Verification Queue', href: '/faculty/verify', icon: '✅', roles: ['faculty'] },
  { label: 'Mock Interviews', href: '/faculty/interviews', icon: '🎙️', roles: ['faculty'] },
  { label: 'Student Overview', href: '/officer/students', icon: '👥', roles: ['placement_officer','placement_head'] },
  { label: 'Manage Drives', href: '/officer/drives', icon: '📌', roles: ['placement_officer','placement_head'] },
  { label: 'Batch Analytics', href: '/officer/analytics', icon: '📈', roles: ['placement_officer','placement_head'] },
  { label: 'Recruiter Access', href: '/head/recruiter-access', icon: '🔑', roles: ['placement_head'] },
  { label: 'Access Logs', href: '/head/access-logs', icon: '🔒', roles: ['placement_head','admin'] },
  { label: 'Skill Taxonomy', href: '/admin/taxonomy', icon: '🌳', roles: ['admin','placement_head'] },
  { label: 'Recruiter Portal', href: '/recruiter', icon: '🔍', roles: ['recruiter'] },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredNav = navItems.filter(item =>
    user ? item.roles.includes(user.role) : false
  );

  const roleColors: Record<string, string> = {
    student: 'from-violet-600 to-purple-700',
    faculty: 'from-blue-600 to-cyan-700',
    placement_officer: 'from-emerald-600 to-teal-700',
    placement_head: 'from-orange-600 to-amber-700',
    recruiter: 'from-rose-600 to-pink-700',
    admin: 'from-slate-600 to-gray-700',
  };

  const gradientClass = user ? roleColors[user.role] : 'from-violet-600 to-purple-700';

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300`}>
        {/* Logo / Brand */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-gray-800 bg-gradient-to-r ${gradientClass}`}>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg flex-shrink-0">🎓</div>
          {sidebarOpen && (
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">PlacementIQ</div>
              <div className="text-xs text-white/60 truncate capitalize">{user?.role?.replace('_', ' ') || 'Guest'}</div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(v => !v)} className="ml-auto text-white/60 hover:text-white flex-shrink-0 text-xs">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {filteredNav.map(item => {
            const active = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  active
                    ? 'bg-violet-600/30 text-violet-300 font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}>
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        {user && (
          <div className="p-3 border-t border-gray-800">
            <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                {user.avatarInitials}
              </div>
              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{user.name}</div>
                  <button onClick={() => { logout(); router.push('/'); }} className="text-xs text-gray-500 hover:text-red-400 transition-colors">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
