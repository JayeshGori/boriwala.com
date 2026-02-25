'use client';

import { createContext, useContext } from 'react';

interface AdminUser {
  userId: string;
  email: string;
  role: string;
}

interface AdminContextType {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AdminContext = createContext<AdminContextType>({
  user: null,
  token: null,
  login: async () => false,
  logout: async () => {},
  isLoading: true,
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setStoredToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token);
  }
}

export function removeStoredToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminFetch(url: string, options: RequestInit = {}) {
  const headers = {
    ...getAuthHeaders(),
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  
  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete (headers as Record<string, string>)['Content-Type'];
  }

  const res = await fetch(url, { ...options, headers });
  return res.json();
}

export async function adminUpload(files: File[]) {
  const formData = new FormData();
  files.forEach((f) => formData.append('files', f));

  const token = getStoredToken();
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return res.json();
}
