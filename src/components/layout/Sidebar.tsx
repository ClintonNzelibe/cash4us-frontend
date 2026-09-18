import {
  Bell,
  BookOpen,
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  Gift,
  Headphones,
  Home,
  LogOut,
  Package,
  Settings,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: Home,
  },
  {
    label: 'Packages',
    path: '/packages',
    icon: Package,
  },
  {
    label: 'My Wallet',
    path: '/wallet',
    icon: Wallet,
  },
  {
    label: 'Transactions',
    path: '/transactions',
    icon: CreditCard,
  },
  {
    label: 'Referrals',
    path: '/referrals',
    icon: Users,
  },
  {
    label: 'Daily Tasks',
    path: '/tasks',
    icon: ClipboardCheck,
  },
  {
  label: 'Resources',
  path: '/resources',
  icon: BookOpen,
  },
  {
  label: 'Partners',
  path: '/partners',
  icon: Building2,
},
  {
    label: 'Withdrawals',
    path: '/withdrawals',
    icon: CircleDollarSign,
  },
  {
    label: 'Community',
    path: '/community',
    icon: Gift,
  },
  {
  label: 'Support',
  path: '/support',
  icon: Headphones,
},
  {
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
  },
]

export default function Sidebar({
  isOpen = true,
  onClose,
}: SidebarProps) {
  const { logout } = useAuth()

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#071521] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
        <div>
          <h1 className="text-xl font-bold">
            Cash<span className="text-[#22C55E]">4</span>Us
          </h1>

          <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">
            Member Portal
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#0F766E] text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <NavLink
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
        >
          <Settings size={19} />
          Profile & Settings
        </NavLink>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  )
}