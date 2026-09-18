import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserPlus,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { getAdminDashboard } from '../../services/adminDashboardService'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validateForm(): boolean {
    let valid = true

    setEmailError('')
    setPasswordError('')

    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      setEmailError('Email address is required.')
      valid = false
    } else if (normalizedEmail.length > 254) {
      setEmailError('Email address is too long.')
      valid = false
    } else if (!EMAIL_REGEX.test(normalizedEmail)) {
      setEmailError('Please enter a valid email address.')
      valid = false
    }

    if (!password) {
      setPasswordError('Password is required.')
      valid = false
    } else if (password.length > 128) {
      setPasswordError('Password cannot exceed 128 characters.')
      valid = false
    }

    return valid
  }

  function handleEmailChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setEmail(event.target.value)
    setEmailError('')
    setError('')
  }

  function handlePasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setPassword(event.target.value)
    setPasswordError('')
    setError('')
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setError('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const accessToken = await login({
        email: email.trim().toLowerCase(),
        password,
      })

      /*
       * The backend's Admin API is protected by IsCash4UsAdmin.
       * We use the real endpoint to determine whether this
       * authenticated account has administrator access.
       */
      try {
        await getAdminDashboard(accessToken)

        navigate('/admin', { replace: true })
        return
      } catch {
        /*
         * A normal authenticated member cannot access the
         * Admin API, so they continue to the member dashboard.
         */
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please check your credentials and try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-[#0F172A] lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#0F766E]/30 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#22C55E]/20 blur-3xl" />
          </div>

          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-10 xl:p-14">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E] text-white">
                <UserPlus size={21} />
              </div>

              <span className="text-2xl font-bold tracking-tight text-white">
                Cash<span className="text-[#22C55E]">4Us</span>
              </span>
            </div>

            <div className="max-w-xl">
              <div className="mb-5 inline-flex rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4ADE80]">
                  Gifting Community
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Welcome back to your
                <br />
                <span className="text-[#4ADE80]">
                  Cash4Us community.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 xl:text-lg">
                Manage your packages, payments, wallet, referrals,
                rewards and community activities from one secure
                dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-400">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F766E]/20">
                <ShieldCheck className="h-5 w-5 text-[#4ADE80]" />
              </div>

              <span>Secure member access</span>
            </div>
          </div>
        </section>

        {/* Login */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E] text-white">
                <UserPlus size={20} />
              </div>

              <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
                Cash<span className="text-[#0F766E]">4Us</span>
              </span>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#0F766E]">
                Member login
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Sign in to access your Cash4Us account.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              <Input
                id="email"
                name="email"
                label="Email address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
                maxLength={254}
                icon={<Mail size={18} />}
                error={emailError}
                aria-invalid={Boolean(emailError)}
                required
              />

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  maxLength={128}
                  icon={<LockKeyhole size={18} />}
                  error={passwordError}
                  aria-invalid={Boolean(passwordError)}
                  className="pr-14"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  disabled={isSubmitting}
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  className="absolute right-2 top-[30px] rounded-lg p-2.5 text-slate-400 hover:bg-slate-100 hover:text-[#0F766E] disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                  className="h-12 shadow-lg shadow-[#0F766E]/15"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#0F766E] hover:text-[#115E59]"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}