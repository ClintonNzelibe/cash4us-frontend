import {
  Bell,
  Menu,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface HeaderProps {
  onMenuClick?: () => void
  unreadCount?: number
}

export default function Header({
  onMenuClick,
  unreadCount = 0,
}: HeaderProps) {
  const { user } = useAuth()

  const firstName =
    user?.first_name || user?.username || 'Member'

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      <div className="hidden sm:block">
        <p className="text-sm text-slate-500">
          Welcome back,
        </p>

        <h2 className="text-lg font-semibold text-slate-900">
          {firstName}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Notifications"
        >
          <Bell size={21} />

          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          {firstName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}