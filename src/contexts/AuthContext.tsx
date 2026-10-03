// Auth Context – mock authentication for demo
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, Student, UserRole } from '@/types';
import { users, students } from '@/lib/mockData';

interface AuthContextValue {
  user: User | null;
  student: Student | null;
  login: (userId: string) => void;
  logout: () => void;
  isRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null, student: null,
  login: () => {}, logout: () => {}, isRole: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userId: string) => {
    const found = [...users, ...students].find(u => u.id === userId) ?? null;
    setUser(found);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const student = user?.role === 'student'
    ? students.find(s => s.id === user.id) ?? null
    : null;

  const isRole = useCallback((...roles: UserRole[]) =>
    !!user && roles.includes(user.role), [user]);

  return (
    <AuthContext.Provider value={{ user, student, login, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
