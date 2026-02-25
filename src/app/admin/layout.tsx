'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminProvider from '@/components/admin/AdminProvider';
import Sidebar from '@/components/admin/Sidebar';
import { FiMenu } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <AdminProvider>
        <Toaster position="top-right" />
        {children}
      </AdminProvider>
    );
  }

  return (
    <AdminProvider>
      <Toaster position="top-right" />
      <div className="flex h-screen bg-slate-100">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-800"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800">Admin Panel</h1>
          </header>
          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
