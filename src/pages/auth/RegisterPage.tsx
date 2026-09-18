import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  UserPlus,
} from 'lucide-react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { register } from '../../services/authService'

interface RegisterForm {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  confirm_password: string
  referral_code: string
}

type FieldErrors = Partial<Record<keyof RegisterForm, string>>

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/
const USERNAME_REGEX = /^[A-Za-z0-9_.-]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const referralFromUrl =
    searchParams.get('ref')?.trim().toUpperCase() || ''

  const [form, setForm] = useState<RegisterForm>({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    referral_code: referralFromUrl,
  })

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (fieldErrors[name as keyof RegisterForm]) {
      setFieldErrors((previous) => ({
        ...previous,
        [name]: '',
      }))
    }

    if (error) {
      setError('')
    }

    if (success) {
      setSuccess('')
    }
  }

  function validateForm(): FieldErrors {
    const errors: FieldErrors = {}

    const firstName = form.first_name.trim()
    const lastName = form.last_name.trim()
    const username = form.username.trim()
    const email = form.email.trim()
    const password = form.password
    const confirmPassword = form.confirm_password
    const referralCode = form.referral_code.trim()

    if (!firstName) {
      errors.first_name = 'First name is required.'
    } else if (firstName.length < 2) {
      errors.first_name = 'First name must be at least 2 characters.'
    } else if (firstName.length > 100) {
      errors.first_name = 'First name cannot exceed 100 characters.'
    } else if (!NAME_REGEX.test(firstName)) {
      errors.first_name =
        'First name can only contain letters, spaces, hyphens and apostrophes.'
    }

    if (!lastName) {
      errors.last_name = 'Last name is required.'
    } else if (lastName.length < 2) {
      errors.last_name = 'Last name must be at least 2 characters.'
    } else if (lastName.length > 100) {
      errors.last_name = 'Last name cannot exceed 100 characters.'
    } else if (!NAME_REGEX.test(lastName)) {
      errors.last_name =
        'Last name can only contain letters, spaces, hyphens and apostrophes.'
    }

    if (!username) {
      errors.username = 'Username is required.'
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters.'
    } else if (username.length > 100) {
      errors.username = 'Username cannot exceed 100 characters.'
    } else if (!USERNAME_REGEX.test(username)) {
      errors.username =
        'Username can only contain letters, numbers, underscores, dots and hyphens.'
    }

    if (!email) {
      errors.email = 'Email address is required.'
    } else if (email.length > 254) {
      errors.email = 'Email address is too long.'
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please enter a valid email address.'
    }

    if (!password) {
      errors.password = 'Password is required.'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.'
    } else if (password.length > 128) {
      errors.password = 'Password cannot exceed 128 characters.'
    } else if (!/[A-Z]/.test(password)) {
      errors.password =
        'Password must contain at least one uppercase letter.'
    } else if (!/[a-z]/.test(password)) {
      errors.password =
        'Password must contain at least one lowercase letter.'
    } else if (!/\d/.test(password)) {
      errors.password = 'Password must contain at least one number.'
    }

    if (!confirmPassword) {
      errors.confirm_password = 'Please confirm your password.'
    } else if (password !== confirmPassword) {
      errors.confirm_password = 'Passwords do not match.'
    }

    if (referralCode.length > 8) {
      errors.referral_code =
        'Referral code cannot exceed 8 characters.'
    }

    return errors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setError('')
    setSuccess('')

    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      await register({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        referral_code: form.referral_code.trim() || undefined,
      })

      setSuccess(
        'Account created successfully. Redirecting you to login...',
      )

      window.setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1200)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create your account. Please try again.',
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
                  Join Cash4Us
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Build connections.
                <br />
                <span className="text-[#4ADE80]">
                  Grow together.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 xl:text-lg">
                Create your Cash4Us account and become part of a
                community built around participation, rewards and
                opportunities.
              </p>
            </div>

            <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/20 text-[#4ADE80]">
                  <User size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    Start your journey
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Your account gives you access to your Cash4Us
                    member dashboard and community features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl">

            {/* Mobile logo */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-white">
                <UserPlus size={19} />
              </div>

              <span className="text-2xl font-bold text-[#0F172A]">
                Cash<span className="text-[#0F766E]">4Us</span>
              </span>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#0F766E]">
                Create account
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
                Join Cash4Us
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Fill in your details to create your member account.
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

            {success && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700"
              >
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  id="first_name"
                  name="first_name"
                  label="First name"
                  type="text"
                  value={form.first_name}
                  onChange={handleChange}
                  autoComplete="given-name"
                  placeholder="First name"
                  disabled={isSubmitting}
                  maxLength={100}
                  error={fieldErrors.first_name}
                  aria-invalid={Boolean(fieldErrors.first_name)}
                  required
                />

                <Input
                  id="last_name"
                  name="last_name"
                  label="Last name"
                  type="text"
                  value={form.last_name}
                  onChange={handleChange}
                  autoComplete="family-name"
                  placeholder="Last name"
                  disabled={isSubmitting}
                  maxLength={100}
                  error={fieldErrors.last_name}
                  aria-invalid={Boolean(fieldErrors.last_name)}
                  required
                />
              </div>

              <Input
                id="username"
                name="username"
                label="Username"
                type="text"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Choose a username"
                disabled={isSubmitting}
                maxLength={100}
                icon={<User size={18} />}
                error={fieldErrors.username}
                aria-invalid={Boolean(fieldErrors.username)}
                required
              />

              <Input
                id="email"
                name="email"
                label="Email address"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
                maxLength={254}
                icon={<Mail size={18} />}
                error={fieldErrors.email}
                aria-invalid={Boolean(fieldErrors.email)}
                required
              />

              <div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    disabled={isSubmitting}
                    maxLength={128}
                    icon={<LockKeyhole size={18} />}
                    error={fieldErrors.password}
                    aria-invalid={Boolean(fieldErrors.password)}
                    className="pr-14"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    disabled={isSubmitting}
                    className="absolute right-2 top-[30px] rounded-lg p-2.5 text-slate-400 hover:bg-slate-100 hover:text-[#0F766E]"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  At least 8 characters, including uppercase,
                  lowercase and a number.
                </p>
              </div>

              <div className="relative">
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  label="Confirm password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirm_password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  disabled={isSubmitting}
                  icon={<LockKeyhole size={18} />}
                  error={fieldErrors.confirm_password}
                  aria-invalid={Boolean(fieldErrors.confirm_password)}
                  className="pr-14"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  disabled={isSubmitting}
                  className="absolute right-2 top-[30px] rounded-lg p-2.5 text-slate-400 hover:bg-slate-100 hover:text-[#0F766E]"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password confirmation'
                      : 'Show password confirmation'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <Input
                id="referral_code"
                name="referral_code"
                label={
                  <>
                    Referral code{' '}
                    <span className="font-normal text-slate-400">
                      (optional)
                    </span>
                  </>
                }
                type="text"
                value={form.referral_code}
                onChange={handleChange}
                placeholder="Enter referral code"
                disabled={isSubmitting}
                maxLength={8}
                error={fieldErrors.referral_code}
                aria-invalid={Boolean(fieldErrors.referral_code)}
              />

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
                      Creating account...
                    </span>
                  ) : (
                    'Create account'
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-7 pb-2 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#0F766E] hover:text-[#115E59]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}