import { useState, type FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Store,
  Bike,
  Shield,
  Loader2,
  ChevronLeft,
  User as UserIcon,
  Phone,
  Building2,
  MapPin,
} from 'lucide-react'
import type { UserRole } from '../../data/database.types'

interface LoginPageProps {
  initialRole?: UserRole
  initialMode?: 'signin' | 'signup'
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

const LAGOS_AREAS = [
  'Ikeja',
  'Lekki Phase 1',
  'Yaba',
  'Victoria Island',
  'Surulere',
  'Maryland',
  'Oshodi',
  'Ikoyi',
  'Gbagada',
  'Festac',
  'Ajah',
  'Alaba / Trade Fair',
]

export function LoginPage({
  initialRole = 'seller',
  initialMode = 'signin',
  onSuccess,
  onCancel,
}: LoginPageProps) {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInDemo,
    error: authError,
  } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    initialRole === 'admin' ? 'seller' : initialRole,
  )

  // Shared fields
  const [email, setEmail] = useState(() => {
    const defaultAcc = DEMO_ACCOUNTS.find((a) => a.role === initialRole)
    return defaultAcc?.email ?? 'adunni@example.com'
  })
  const [password, setPassword] = useState('Password123!')

  // Sign up fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [area, setArea] = useState('Ikeja')
  const [vehicleType, setVehicleType] = useState<'bike' | 'bicycle' | 'van'>(
    'bike',
  )

  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setLocalError(null)
    setSuccessMessage(null)
    const acc = DEMO_ACCOUNTS.find((a) => a.role === role)
    if (acc && mode === 'signin') {
      setEmail(acc.email)
      setPassword('Password123!')
    }
  }

  const handleModeSwitch = (newMode: 'signin' | 'signup') => {
    setMode(newMode)
    setLocalError(null)
    setSuccessMessage(null)
    if (newMode === 'signup' && selectedRole === 'admin') {
      setSelectedRole('seller')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setSuccessMessage(null)

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password.')
      return
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setLocalError('Please enter your full name.')
        setLoading(false)
        return
      }
      if (!phone.trim()) {
        setLocalError('Please enter your phone number.')
        setLoading(false)
        return
      }

      const roleToRegister = selectedRole === 'rider' ? 'rider' : 'seller'
      const { error, needsEmailConfirmation } = await signUpWithEmail({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        phone: phone.trim(),
        role: roleToRegister,
        businessName: businessName.trim() || undefined,
        area,
        vehicleType,
      })

      setLoading(false)

      if (error) {
        if (
          error.message.toLowerCase().includes('rate limit') ||
          error.message.toLowerCase().includes('email')
        ) {
          setLocalError(
            'Email rate limit reached (Supabase default mailer is capped at ~3 emails/hour). In your Supabase Dashboard -> Authentication -> Providers -> Email, turn OFF "Confirm email" to allow unlimited instant signups!',
          )
        } else {
          setLocalError(error.message)
        }
      } else if (needsEmailConfirmation) {
        setSuccessMessage(
          'Account registered! Please check your email inbox to confirm your account and sign in.',
        )
      } else {
        // Logged in immediately
        onSuccess?.()
      }
    } else {
      // Sign In mode
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
  }

  const handleQuickDemo = async (acc: DemoAccount) => {
    setSelectedRole(acc.role)
    setEmail(acc.email)
    setPassword('Password123!')
    setLocalError(null)
    setSuccessMessage(null)
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
              {mode === 'signin'
                ? 'Sign in to your account'
                : 'Create your account'}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mt-5 grid grid-cols-2 rounded-xl bg-neutral-200/70 p-1">
          <button
            type="button"
            onClick={() => handleModeSwitch('signin')}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              mode === 'signin'
                ? 'bg-white text-ink shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('signup')}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white text-ink shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Role Pills */}
        <div className="mt-3 flex rounded-xl bg-neutral-200/50 p-1">
          {(mode === 'signup'
            ? (['seller', 'rider'] as UserRole[])
            : (['seller', 'rider', 'admin'] as UserRole[])
          ).map((r) => {
            const isCurrent = selectedRole === r
            const label =
              r === 'seller'
                ? 'Seller / SME'
                : r === 'rider'
                  ? 'Delivery Rider'
                  : 'Admin'
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold tracking-wide transition-all ${
                  isCurrent
                    ? 'bg-white text-ink shadow-xs'
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

          {successMessage && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-status-success-border bg-status-success-bg p-3.5 text-sm text-status-success">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="leading-snug">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Full Name
                  </label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Chidinma Adeleke"
                      className="block w-full min-h-touch rounded-xl border border-neutral-300 bg-white pl-10 pr-3.5 text-sm text-ink placeholder-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Phone Number
                  </label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0802 345 6789"
                      className="block w-full min-h-touch rounded-xl border border-neutral-300 bg-white pl-10 pr-3.5 text-sm text-ink placeholder-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                </div>

                {/* Seller Specific: Business Name */}
                {selectedRole === 'seller' && (
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
                    >
                      Business / Brand Name
                    </label>
                    <div className="relative mt-1.5">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <input
                        id="businessName"
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Lagos Glow Hub"
                        className="block w-full min-h-touch rounded-xl border border-neutral-300 bg-white pl-10 pr-3.5 text-sm text-ink placeholder-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Location / Area in Lagos */}
                <div>
                  <label
                    htmlFor="area"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    {selectedRole === 'seller'
                      ? 'Pickup Area'
                      : 'Primary Delivery Zone'}
                  </label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <select
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="block w-full min-h-touch rounded-xl border border-neutral-300 bg-white pl-10 pr-3.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    >
                      {LAGOS_AREAS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rider Specific: Vehicle Type */}
                {selectedRole === 'rider' && (
                  <div>
                    <label
                      htmlFor="vehicleType"
                      className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
                    >
                      Vehicle Type
                    </label>
                    <div className="relative mt-1.5">
                      <select
                        id="vehicleType"
                        value={vehicleType}
                        onChange={(e) =>
                          setVehicleType(
                            e.target.value as 'bike' | 'bicycle' | 'van',
                          )
                        }
                        className="block w-full min-h-touch rounded-xl border border-neutral-300 bg-white px-3.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      >
                        <option value="bike">
                          Motorcycle / Bike (Dispatch)
                        </option>
                        <option value="bicycle">Bicycle</option>
                        <option value="van">Delivery Van</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email Address */}
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

            {/* Password */}
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
                  autoComplete={
                    mode === 'signup' ? 'new-password' : 'current-password'
                  }
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full min-h-touch rounded-xl border border-neutral-300 bg-white pl-10 pr-3.5 text-sm text-ink placeholder-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
              {mode === 'signup' && (
                <p className="mt-1 text-[11px] text-neutral-400">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full min-h-touch items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-ink shadow-sm transition-all hover:bg-brand-600 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {mode === 'signup' ? 'Creating account…' : 'Signing in…'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signup'
                      ? 'Create Eko Riders Account'
                      : 'Sign In'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switch Helper */}
          <div className="mt-5 text-center">
            {mode === 'signin' ? (
              <p className="text-xs text-neutral-500">
                New to Eko Riders?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signup')}
                  className="font-bold text-brand hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-neutral-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signin')}
                  className="font-bold text-brand hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Logins (Shown in Sign In mode) */}
          {mode === 'signin' && (
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
          )}
        </div>
      </div>
    </div>
  )
}
