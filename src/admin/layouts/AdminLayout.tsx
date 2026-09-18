import { Menu, ShieldCheck } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

import AdminSidebar from '../components/AdminSidebar'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  const displayName =
    user?.first_name ||
    user?.username ||
    user?.email ||
    'Administrator'

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open admin navigation"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#0F766E]">
                Cash4Us
              </p>
              <h1 className="text-lg font-bold text-slate-900">
                Administration
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 sm:flex">
              <ShieldCheck
                size={17}
                className="text-[#0F766E]"
              />
              <span className="text-sm font-semibold text-[#0F766E]">
                Administrator
              </span>
            </div>

            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}