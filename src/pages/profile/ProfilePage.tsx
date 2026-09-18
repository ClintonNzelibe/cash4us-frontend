import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Check,
  Copy,
  Edit3,
  Mail,
  Save,
  User as UserIcon,
  X,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../services/authService'

export default function ProfilePage() {
  const { user, accessToken } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
  })

  useEffect(() => {
    if (!user) return

    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
    })
  }, [user])

  if (!user) {
    return null
  }

  const initials =
    `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()

  const joinedDate = new Date(user.date_joined).toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  )

  async function handleSave() {
    setError('')
    setSuccess('')

    if (!form.first_name.trim()) {
      setError('First name is required.')
      return
    }

    if (!form.last_name.trim()) {
      setError('Last name is required.')
      return
    }

    if (!form.username.trim()) {
      setError('Username is required.')
      return
    }

    if (!accessToken) {
      setError('Your session has expired. Please log in again.')
      return
    }

    try {
      setIsSaving(true)

      await updateProfile(
        {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          username: form.username.trim(),
        },
        accessToken,
      )

      setSuccess('Profile updated successfully.')
      setIsEditing(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update your profile.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  function handleCancel() {
    if (!user) return

    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
    })

    setError('')
    setSuccess('')
    setIsEditing(false)
  }

  async function copyReferralCode() {
    if (!user) return

    try {
        await navigator.clipboard.writeText(user.referral_code)

        setCopied(true)
        setError('')

        setTimeout(() => {
        setCopied(false)
        }, 1800)
    } catch {
        setError('Unable to copy referral code.')
    }
  }

  function handleInputChange(
    field: 'first_name' | 'last_name' | 'username',
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#0F766E]">
            Account
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
            Profile & Settings
          </h2>

          <p className="mt-1 text-sm text-[#64748B]">
            Manage your personal information and account details.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => {
              setError('')
              setSuccess('')
              setIsEditing(true)
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#115E59]"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />

              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <Check className="h-4 w-4" />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Profile Banner */}
        <div className="bg-gradient-to-r from-[#0F766E] to-[#115E59] px-5 py-6 sm:px-7">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-xl font-bold text-[#0F766E] shadow-sm">
              {initials || (
                <UserIcon className="h-7 w-7" />
              )}
            </div>

            {/* User Name */}
            <div className="min-w-0 text-white">
              <h3 className="truncate text-xl font-bold">
                {user.first_name} {user.last_name}
              </h3>

              <p className="mt-0.5 truncate text-sm text-white/80">
                @{user.username}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-5 sm:p-7">
          <div className="mb-5">
            <h3 className="font-semibold text-[#0F172A]">
              Personal Information
            </h3>

            <p className="mt-1 text-sm text-[#64748B]">
              Your basic account information.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* First Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                First Name
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(event) =>
                    handleInputChange(
                      'first_name',
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                />
              ) : (
                <div className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900">
                  {user.first_name}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Last Name
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(event) =>
                    handleInputChange(
                      'last_name',
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                />
              ) : (
                <div className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900">
                  {user.last_name}
                </div>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={form.username}
                  onChange={(event) =>
                    handleInputChange(
                      'username',
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                />
              ) : (
                <div className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900">
                  @{user.username}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />

                <span className="truncate">
                  {user.email}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Email address cannot be changed here.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Referral Code */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-[#0F172A]">
              Referral Code
            </h3>

            <p className="mt-1 text-sm text-[#64748B]">
              Share your code to invite new members.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-[#0F766E]/30 bg-[#0F766E]/5 px-4 py-3">
            <span className="font-mono text-base font-bold tracking-wider text-[#0F766E]">
              {user.referral_code}
            </span>

            <button
              type="button"
              onClick={copyReferralCode}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#0F766E] transition hover:bg-white"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-[#0F172A]">
              Account Information
            </h3>

            <p className="mt-1 text-sm text-[#64748B]">
              Basic information about your Cash4Us account.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#0F766E] shadow-sm">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Member since
              </p>

              <p className="text-sm font-semibold text-slate-900">
                {joinedDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}