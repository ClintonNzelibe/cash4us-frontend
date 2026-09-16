import { useState } from 'react'
import type { ReactNode } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'

interface DashboardLayoutProps {
  children: ReactNode
  unreadCount?: number
}

export default function DashboardLayout({
  children,
  unreadCount = 0,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          />
        )}

        <div className="min-w-0 flex-1">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            unreadCount={unreadCount}
          />

          <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}