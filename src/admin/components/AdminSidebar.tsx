import {
  Bell,
  ChevronLeft,
  ClipboardCheck,
  FileText,
  Gift,
  History,
  LayoutDashboard,
  Megaphone,
  Package,
  Users,
  Wallet,
  ArrowLeftRight,
  Trophy,
  Building2,
  Headphones,
  Landmark,
  HandCoins,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Members', path: '/admin/members', icon: Users },
  { label: 'Packages', path: '/admin/packages', icon: Package },
  { label: 'Payments', path: '/admin/payments', icon: HandCoins },
  { label: 'Withdrawals', path: '/admin/withdrawals', icon: ArrowLeftRight },
  { label: 'Tasks', path: '/admin/tasks', icon: ClipboardCheck },
  { label: 'Wallets', path: '/admin/wallets', icon: Wallet },
  { label: 'Transactions', path: '/admin/transactions', icon: History },
  { label: 'Referrals', path: '/admin/referrals', icon: Users },
  { label: 'Rewards', path: '/admin/rewards', icon: Trophy },
  { label: 'Advertising', path: '/admin/advertising', icon: Megaphone },
  { label: 'Community', path: '/admin/community', icon: Gift },
  { label: 'Support', path: '/admin/support', icon: Headphones },
  { label: 'Resources', path: '/admin/resources', icon: FileText },
  { label: 'Partners', path: '/admin/partners', icon: Building2 },
  { label: 'Notifications', path: '/admin/notifications', icon: Bell },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: Landmark },
]

export default function AdminSidebar({
  isOpen,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
          <NavLink
            to="/admin"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-white">
              <LayoutDashboard size={20} />
            </div>

            <div>
              <p className="text-base font-bold text-slate-900">
                Cash4Us
              </p>

              <p className="text-xs font-medium text-[#0F766E]">
                Admin Portal
              </p>
            </div>
          </NavLink>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Administration
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[#0F766E] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F766E]'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0F766E]"
          >
            <ChevronLeft size={18} />
            <span>Back to Member Portal</span>
          </NavLink>
        </div>
      </aside>
    </>
  )
}