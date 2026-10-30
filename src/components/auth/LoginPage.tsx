import { useState, type FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Store,
  Bike,
  Shield,
  Loader2,
  ChevronLeft,
} from 'lucide-react'
import type { UserRole } from '../../data/database.types'

interface LoginPageProps {
  initialRole?: UserRole
  onSuccess?: () => void
  onCancel?: () => void
}

interface DemoAccount {
  name: string
  role: UserRole
  roleLabel: string
  email: string
  icon: typeof Store
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Adunni Okafor',
    role: 'seller',
    roleLabel: 'Seller (Fashion Hub)',
    email: 'adunni@example.com',
    icon: Store,
  },
  {
    name: 'Ibrahim Musa',
    role: 'rider',
    roleLabel: 'Rider (Yaba Zone)',
    email: 'ibrahim@example.com',
    icon: Bike,
  },
  {
    name: 'Ops Dispatch',
    role: 'admin',
    roleLabel: 'Admin / Operations',
    email: 'admin@example.com',
    icon: Shield,
  },
]

export function LoginPage({
  initialRole = 'seller',
  onSuccess,
  onCancel,
}: LoginPageProps) {
  const { signInWithEmail, signInDemo, error: authError } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole)
  const [email, setEmail] = useState(() => {
    const defaultAcc = DEMO_ACCOUNTS.find((a) => a.role === initialRole)
    return defaultAcc?.email ?? 'adunni@example.com'
  })
  const [password, setPassword] = useState('Password123!')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    const acc = DEMO_ACCOUNTS.find((a) => a.role === role)
    if (acc) {
      setEmail(acc.email)
      setPassword('Password123!')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password.')
      return
    }

    setLoading(true)
    const { error } = await signInWithEmail(email.trim(), password)
    setLoading(false)

    if (error) {
      const demoMatch = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
      )
      if (demoMatch && password === 'Password123!') {
        signInDemo(demoMatch.role, demoMatch.name, demoMatch.email)
        onSuccess?.()
      } else {
        setLocalError(error.message)
      }
    } else {
      onSuccess?.()
    }
  }

  const handleQuickDemo = async (acc: DemoAccount) => {
    setSelectedRole(acc.role)
    setEmail(acc.email)
    setPassword('Password123!')
    setLocalError(null)
    setLoading(true)
    const { error } = await signInWithEmail(acc.email, 'Password123!')
    setLoading(false)
    if (error) {
      signInDemo(acc.role, acc.name, acc.email)
      onSuccess?.()
    } else {
      onSuccess?.()
    }
  }

  const activeError = localError || authError

  return (
    <div className="flex min-h-dvh flex-col justify-center bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-ink transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to demo hub
          </button>
        )}

        <div className="flex items-center justify-center gap-3">
          <img
            src="/icons/icon-512.png"
            alt="Eko Riders"
            className="h-12 w-12 rounded-2xl shadow-sm object-cover"
          />
          <div>
            <h2 className="font-heading text-2xl font-black tracking-tight text-ink">
              Eko Riders
            </h2>
            <p className="text-xs font-medium text-neutral-500">
              Sign in to your account
            </p>
          </div>
        </div>

        {/* Role Pills */}
        <div className="mt-6 flex rounded-xl bg-neutral-200/60 p-1">
          {(['seller', 'rider', 'admin'] as UserRole[]).map((r) => {
            const isCurrent = selectedRole === r
            const label =
              r === 'seller' ? 'Seller' : r === 'rider' ? 'Rider' : 'Admin'
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold tracking-wide transition-all ${
                  isCurrent
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
          {activeError && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-status-danger-border bg-status-danger-bg p-3.5 text-sm text-status-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="leading-snug">{activeError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
              >
                Email address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full min-h-touch rounded-xl border border-neutral-300 bg-white pl-10 pr-3.5 text-sm text-ink placeholder-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full min-h-touch rounded-xl border border-neutral-300 bg-white pl-10 pr-3.5 text-sm text-ink placeholder-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full min-h-touch items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-ink shadow-sm transition-all hover:bg-brand-600 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 border-t border-neutral-100 pt-5">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-neutral-400">
              One-click demo sign in
            </p>
            <div className="mt-3 space-y-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const Icon = acc.icon
                return (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickDemo(acc)}
                    className="flex w-full min-h-touch items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-left text-xs font-medium text-ink transition-colors hover:border-brand hover:bg-white active:bg-neutral-100 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-xs">
                        <Icon className="h-3.5 w-3.5 text-brand" />
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{acc.name}</p>
                        <p className="text-[11px] text-neutral-500">
                          {acc.roleLabel}
                        </p>
                      </div>
                    </div>
                    <span className="font-data text-[10px] text-neutral-400">
                      Tap to test
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
