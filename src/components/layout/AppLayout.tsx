import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/packages': 'Packages',
  '/packages/my': 'My Packages',
  '/wallet': 'My Wallet',
  '/transactions': 'Transactions',
  '/referrals': 'Referrals',
  '/tasks': 'Daily Tasks',
  '/withdrawals': 'Withdrawals',
  '/community': 'Community',
  '/notifications': 'Notifications',
  '/profile': 'Profile & Settings',
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.includes('/packages/') ? 'Package' : 'Cash4Us')

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex min-h-screen">

        {/* Desktop sidebar / mobile drawer */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-[#E2E8F0] bg-white/95 px-4 backdrop-blur sm:px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="mr-3 rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <h1 className="text-lg font-semibold text-[#0F172A]">
              {title}
            </h1>
          </header>

          {/* Page content */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  )
}