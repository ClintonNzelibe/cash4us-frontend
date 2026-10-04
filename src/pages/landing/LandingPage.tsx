import { useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Compass,
  Gift,
  HandCoins,
  Layers3,
  Menu,
  ShieldCheck,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: Layers3,
    title: 'Packages',
    copy: 'Explore available package options and follow your membership journey in one place.',
  },
  {
    icon: ClipboardCheck,
    title: 'Daily Tasks',
    copy: 'Find your assigned activity, review the instructions, and submit proof with confidence.',
  },
  {
    icon: UsersRound,
    title: 'Referral Rewards',
    copy: 'Share your referral link and keep track of qualified referrals from your dashboard.',
  },
  {
    icon: WalletCards,
    title: 'Wallet & earnings',
    copy: 'See wallet activity, transaction history, and your available balance clearly.',
  },
  {
    icon: Compass,
    title: 'Community',
    copy: 'Stay connected through community updates, resources, and shared opportunities.',
  },
  {
    icon: HandCoins,
    title: 'Withdrawals',
    copy: 'Review eligible funds and submit withdrawal requests from your member portal.',
  },
]

const steps = [
  ['01', 'Create your account', 'Register and access your personal Cash4Us member space.'],
  ['02', 'Choose a package', 'Review the available package details and complete your payment process.'],
  ['03', 'Stay active', 'Manage tasks, referrals, updates, and your account activity in one portal.'],
  ['04', 'Track your progress', 'Follow verified activity, wallet records, and withdrawal eligibility.'],
]

const faqs = [
  ['What is Cash4Us?', 'Cash4Us is a member platform that brings packages, daily activities, referrals, wallet records, community updates, and support together in one secure portal.'],
  ['How do I join?', 'Select Get Started to create an account using the existing Cash4Us registration flow.'],
  ['Where can I see my activity?', 'After signing in, the member dashboard provides access to packages, tasks, referrals, wallet activity, transactions, and more.'],
  ['How are tasks reviewed?', 'Task submissions follow the platform’s configured verification and review process. Where review is needed, an administrator can assess the submitted proof.'],
]

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Cash4Us home">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0F766E] text-sm font-black text-white shadow-lg shadow-emerald-950/20">C4</span>
      <span className="text-xl font-bold tracking-tight text-[#0F172A]">Cash<span className="text-[#0F766E]">4Us</span></span>
    </Link>
  )
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8fbfa] text-[#0F172A]">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10" aria-label="Main navigation">
          <Brand />
          <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#home" className="transition hover:text-[#0F766E]">Home</a>
            <a href="#how-it-works" className="transition hover:text-[#0F766E]">How It Works</a>
            <a href="#benefits" className="transition hover:text-[#0F766E]">Benefits</a>
            <a href="#faq" className="transition hover:text-[#0F766E]">FAQ</a>
          </div>
          <Link to="/login" className="hidden rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-[#115E59] md:inline-flex">Sign in</Link>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg p-2 text-[#0F172A] md:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-xl md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 text-sm font-medium text-slate-700">
              {[['Home', '#home'], ['How It Works', '#how-it-works'], ['Benefits', '#benefits'], ['FAQ', '#faq']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 hover:bg-emerald-50 hover:text-[#0F766E]">{label}</a>)}
              <Link to="/login" onClick={() => setMenuOpen(false)} className="mt-2 rounded-xl bg-[#0F766E] px-4 py-3 text-center font-semibold text-white">Sign in</Link>
            </div>
          </div>
        )}
      </header>

      <section id="home" className="relative isolate overflow-hidden bg-[#f8fbfa]">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(ellipse_at_75%_25%,rgba(34,197,94,0.16),transparent_46%),radial-gradient(ellipse_at_15%_15%,rgba(13,148,136,0.12),transparent_42%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24 lg:grid-cols-[1.03fr_.97fr] lg:px-10 lg:pt-28">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.13em] text-[#0F766E]"><BadgeCheck size={15} /> Your member experience, all together</div>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">A clearer way to manage your <span className="text-[#0F766E]">Cash4Us</span> journey.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Cash4Us gives members one thoughtful place to manage packages, daily activities, referral progress, wallet records, community updates, and support.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-6 text-sm font-semibold text-white shadow-xl shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-[#115E59]">Get started <ArrowRight size={17} /></Link>
              <Link to="/login" className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-[#0F766E]">Sign in to your account</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600"><span className="flex items-center gap-2"><ShieldCheck className="text-[#0F766E]" size={18} /> Secure member access</span><span className="flex items-center gap-2"><Bell className="text-[#0F766E]" size={18} /> Clear activity updates</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/60 via-teal-100/50 to-white blur-2xl" />
            <div className="rounded-[1.75rem] border border-white/80 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:p-5">
              <div className="rounded-[1.25rem] bg-[#0F172A] p-5 text-white sm:p-6">
                <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Member overview</p><p className="mt-1 text-lg font-semibold">Welcome back</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><WalletCards size={20} className="text-emerald-300" /></span></div>
                <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/10 bg-white/[0.07] p-4"><p className="text-xs text-slate-400">Wallet</p><div className="mt-3 h-2 w-20 rounded-full bg-emerald-400/80" /><p className="mt-3 text-xs text-slate-400">View your activity</p></div><div className="rounded-xl border border-white/10 bg-white/[0.07] p-4"><p className="text-xs text-slate-400">Daily task</p><div className="mt-3 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /><span className="text-sm font-medium">Available today</span></div><p className="mt-3 text-xs text-slate-400">Review instructions</p></div></div>
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.07] p-4"><div className="flex items-center justify-between"><p className="text-sm font-medium">Your activity</p><span className="text-xs text-emerald-300">Updated</span></div><div className="mt-4 flex h-16 items-end gap-2">{[35, 55, 42, 68, 52, 76, 90].map((height, index) => <span key={index} className="flex-1 rounded-t bg-gradient-to-t from-[#0F766E] to-[#4ADE80] opacity-90" style={{ height: `${height}%` }} />)}</div></div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-[#0F766E]"><ClipboardCheck size={18} /></span><div><p className="text-sm font-semibold">Tasks</p><p className="text-xs text-slate-500">Submit proof with ease</p></div></div></div><div className="rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-50 text-[#0F766E]"><UsersRound size={18} /></span><div><p className="text-sm font-semibold">Referrals</p><p className="text-xs text-slate-500">Share and track progress</p></div></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.15em] text-[#0F766E]">Built around membership</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Everything important, within reach.</h2><p className="mt-4 leading-7 text-slate-600">Use one focused portal to stay informed and move through each part of your membership with clarity.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, copy }) => <article key={title} className="group rounded-2xl border border-slate-200 bg-[#fbfefd] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-[#0F766E] transition group-hover:bg-[#0F766E] group-hover:text-white"><Icon size={21} /></span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p></article>)}</div></div>
      </section>

      <section id="how-it-works" className="py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-bold uppercase tracking-[0.15em] text-[#0F766E]">How Cash4Us works</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Simple steps. A connected member experience.</h2><p className="mt-5 max-w-md leading-7 text-slate-600">Each step is designed to keep your account activity understandable and easy to follow.</p><Link to="/register" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] hover:text-[#115E59]">Create your account <ArrowRight size={17} /></Link></div><ol className="grid gap-4 sm:grid-cols-2">{steps.map(([number, title, copy]) => <li key={number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><span className="text-sm font-black tracking-widest text-[#0F766E]">{number}</span><h3 className="mt-7 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p></li>)}</ol></div></div></section>

      <section id="benefits" className="bg-[#0F172A] py-20 text-white sm:py-28"><div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-10"><div><p className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-300">Why Cash4Us</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A member portal that keeps the details connected.</h2><p className="mt-5 max-w-xl leading-7 text-slate-300">From the first sign-in to daily account management, Cash4Us brings important tools and records into a consistent, easy-to-navigate experience.</p></div><div className="grid gap-4 sm:grid-cols-2">{[[ShieldCheck, 'Clear records', 'Keep wallet and transaction activity easy to review.'], [Gift, 'Meaningful activity', 'Manage configured tasks and referrals from your dashboard.'], [CircleDollarSign, 'One place', 'Access account tools without switching between systems.'], [UsersRound, 'Connected community', 'Find updates, resources, and support when you need them.']].map(([Icon, title, copy]) => { const BenefitIcon = Icon as typeof ShieldCheck; return <div key={title as string} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"><BenefitIcon className="text-emerald-300" size={23} /><h3 className="mt-5 font-bold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{copy as string}</p></div>})}</div></div></section>

      <section className="py-20 sm:py-28"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0F766E] to-[#115E59] px-7 py-12 text-center text-white shadow-2xl shadow-teal-950/20 sm:px-12 sm:py-16"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#4ADE80]/15 blur-2xl" /><div className="relative"><p className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-200">Ready when you are</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Step into a more connected Cash4Us experience.</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-emerald-50/85">Create your account to explore the member portal, or sign in to continue where you left off.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#0F766E] transition hover:-translate-y-0.5 hover:bg-emerald-50">Get started <ArrowRight size={17} /></Link><Link to="/login" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-sm font-bold text-white transition hover:bg-white/10">Sign in</Link></div></div></div></div></section>

      <section id="faq" className="border-t border-slate-200 bg-white py-20 sm:py-28"><div className="mx-auto max-w-3xl px-5 sm:px-8"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.15em] text-[#0F766E]">FAQ</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A few helpful answers.</h2></div><div className="mt-10 space-y-3">{faqs.map(([question, answer]) => <details key={question} className="group rounded-xl border border-slate-200 bg-[#fbfefd] px-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-sm font-bold text-slate-800"><span>{question}</span><ChevronDown size={19} className="shrink-0 text-[#0F766E] transition group-open:rotate-180" /></summary><p className="max-w-2xl pb-5 text-sm leading-6 text-slate-600">{answer}</p></details>)}</div></div></section>

      <footer className="bg-[#0b1224] py-12 text-slate-400"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-9 md:flex-row"><div><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0F766E] text-xs font-black text-white">C4</span><span className="text-xl font-bold text-white">Cash<span className="text-[#4ADE80]">4Us</span></span></div><p className="mt-4 max-w-sm text-sm leading-6">A connected space for Cash4Us members to manage their account activity and community experience.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm"><a href="#how-it-works" className="hover:text-white">How It Works</a><a href="#benefits" className="hover:text-white">Benefits</a><a href="#faq" className="hover:text-white">FAQ</a><Link to="/login" className="hover:text-white">Sign in</Link></div></div><p className="pt-7 text-xs">© {new Date().getFullYear()} Cash4Us. All rights reserved.</p></div></footer>
    </main>
  )
}
