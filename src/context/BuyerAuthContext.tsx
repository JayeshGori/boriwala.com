'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface BuyerUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  role: string;
  isApproved: boolean;
}

interface BuyerAuthContextType {
  buyer: BuyerUser | null;
  loading: boolean;
  isApproved: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const BuyerAuthContext = createContext<BuyerAuthContextType>({
  buyer: null,
  loading: true,
  isApproved: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  refresh: async () => {},
});

export function BuyerAuthProvider({ children }: { children: ReactNode }) {
  const [buyer, setBuyer] = useState<BuyerUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/buyer-me');
      const data = await res.json();
      if (data.success) {
        setBuyer(data.data);
      } else {
        setBuyer(null);
      }
    } catch {
      setBuyer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/buyer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setBuyer(data.data.user);
        await refresh();
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/buyer-logout', { method: 'POST' });
    } catch { /* ignore */ }
    setBuyer(null);
  };

  return (
    <BuyerAuthContext.Provider value={{ buyer, loading, isApproved: buyer?.isApproved || false, login, logout, refresh }}>
      {children}
    </BuyerAuthContext.Provider>
  );
}

export function useBuyerAuth() {
  return useContext(BuyerAuthContext);
}
