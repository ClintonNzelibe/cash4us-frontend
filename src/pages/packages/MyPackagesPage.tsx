import {
  ArrowRight,
  PackageOpen,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function MyPackagesPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-[#0B1F33] px-6 py-8 text-white sm:px-8">
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <Sparkles size={14} />
            Membership
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Packages
          </h1>

          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            View and manage your Cash4Us membership packages.
          </p>
        </div>

        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#0F766E]/40 blur-3xl" />
      </section>

      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#0F766E]">
          <PackageOpen size={30} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          No active package
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          You don't have an active membership package yet.
          Explore the available packages to get started.
        </p>

        <button
          onClick={() => navigate('/packages')}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          Explore Packages
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  )
}