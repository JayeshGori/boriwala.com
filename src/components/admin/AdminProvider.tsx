'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminContext, getStoredToken, setStoredToken, removeStoredToken } from '@/lib/admin-auth';

interface AdminUser {
  userId: string;
  email: string;
  role: string;
}

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) {
      setIsLoading(false);
      if (pathname !== '/admin/login') router.push('/admin/login');
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${stored}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setToken(stored);
      } else {
        removeStoredToken();
        if (pathname !== '/admin/login') router.push('/admin/login');
      }
    } catch {
      removeStoredToken();
      if (pathname !== '/admin/login') router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
        setStoredToken(data.data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setToken(null);
    removeStoredToken();
    router.push('/admin/login');
  };

  return (
    <AdminContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}
