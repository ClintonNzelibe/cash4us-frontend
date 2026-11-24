import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { apiClient } from '../../api/client'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function PasswordResetPage({ confirm = false }: { confirm?: boolean }) {
  const { hash } = useLocation()
  const params = new URLSearchParams(hash.slice(1))
  const uid = params.get('uid')
  const token = params.get('token')
  const invalidLink = confirm && (!uid || !token)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting || invalidLink) return
    const fields = new FormData(event.currentTarget)
    const password = fields.get('password')
    setError('')
    if (confirm && password !== fields.get('confirmPassword')) {
      setError('Enter the same password in both fields.')
      return
    }
    setSubmitting(true)
    try {
      const response = await apiClient<{ detail: string }>(
        confirm ? '/users/password-reset/confirm/' : '/users/password-reset/',
        {
          method: 'POST',
          body: JSON.stringify(confirm ? { uid, token, password } : { email: fields.get('email') }),
        },
      )
      setMessage(response.detail)
      if (confirm) window.history.replaceState(window.history.state, '', window.location.pathname)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset your password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
        {message ? <p role="status">{message}</p> : invalidLink ? (
          <p role="alert">This reset link is invalid. <Link className="underline" to="/forgot-password">Request a new link</Link>.</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            {confirm ? (
              <>
                <Input id="password" name="password" label="New password" type="password" autoComplete="new-password" maxLength={128} required />
                <Input id="confirm-password" name="confirmPassword" label="Confirm new password" type="password" autoComplete="new-password" maxLength={128} required />
              </>
            ) : (
              <Input id="email" name="email" label="Email address" type="email" autoComplete="email" maxLength={254} required />
            )}
            <Button type="submit" variant="primary" fullWidth disabled={submitting}>
              {confirm ? 'Set new password' : 'Send reset link'}
            </Button>
          </form>
        )}
        <Link className="text-sm font-semibold text-[#0F766E] hover:underline" to="/login">Back to sign in</Link>
      </section>
    </main>
  )
}
