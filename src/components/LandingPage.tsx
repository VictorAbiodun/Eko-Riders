import { useState, type FormEvent } from 'react'
import {
  Store,
  Bike,
  Shield,
  ArrowRight,
  LogOut,
  Search,
  Package,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { navigate } from '../lib/navigation'

export function LandingPage() {
  const { user, role, signOut } = useAuth()
  const [trackingInput, setTrackingInput] = useState('')
  const [trackingError, setTrackingError] = useState<string | null>(null)

  const handleTrackSubmit = (e: FormEvent) => {
    e.preventDefault()
    const cleanId = trackingInput.trim().toUpperCase()
    if (!cleanId) {
      setTrackingError('Please enter an Order ID or Tracking Token.')
      return
    }

    setTrackingError(null)
    // Supports ORD-000001 or raw order ID
    const formatted = cleanId.startsWith('ORD-') ? cleanId : `ORD-${cleanId}`
    navigate(`/track/${formatted}`)
  }

  const userDashboardUrl =
    role === 'rider' ? '/rider' : role === 'admin' ? '/admin' : '/seller'

  return (
    <div className="min-h-dvh bg-neutral-50 flex flex-col justify-between">
      {/* ── Header ── */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/icons/icon-512.png"
              alt="Eko Riders"
              className="h-10 w-10 rounded-xl shadow-sm object-cover"
            />
            <div>
              <h1 className="font-heading text-xl font-black tracking-tight text-ink">
                Eko Riders
              </h1>
              <p className="text-[11px] font-medium text-neutral-400 hidden sm:block">
                Lagos Last-Mile Dispatch & COD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(userDashboardUrl)}
                  className="flex min-h-touch items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-brand-600"
                >
                  <span>Open {role ? role.toUpperCase() : 'Dashboard'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="flex min-h-touch items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:border-status-danger-border hover:bg-status-danger-bg hover:text-status-danger"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex min-h-touch items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 text-xs font-bold text-ink shadow-2xs transition-colors hover:border-brand hover:bg-neutral-50"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="flex min-h-touch items-center gap-1.5 rounded-xl bg-brand px-3.5 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-brand-600"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 pt-12 pb-16 sm:px-8 sm:pt-16 sm:pb-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-800">
                <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                Lagos Delivery Solved
              </div>

              <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-ink sm:text-5xl sm:leading-[1.15]">
                Fast, dependable delivery for Nigerian businesses.
              </h2>

              <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
                On-demand dispatch riders across Ikeja, the Mainland, and the
                Island. Automated order creation, live GPS parcel tracking, and
                seamless Cash-on-Delivery (COD) reconciliation.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="flex min-h-touch items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-ink shadow-md transition-all hover:bg-brand-600 active:scale-[0.98]"
                >
                  <span>Start Shipping as a Seller</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex min-h-touch items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-bold text-ink shadow-xs transition-colors hover:border-brand hover:bg-neutral-50"
                >
                  <span>Sign In</span>
                </button>
              </div>

              {/* Trust stats */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-neutral-200/80 pt-6">
                <div>
                  <p className="font-heading text-2xl font-black text-ink">
                    Same-Day
                  </p>
                  <p className="text-xs font-medium text-neutral-500">
                    Ikeja & Lagos Zones
                  </p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-black text-ink">
                    100% COD
                  </p>
                  <p className="text-xs font-medium text-neutral-500">
                    Safe Cash Collection
                  </p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-black text-ink">
                    Live
                  </p>
                  <p className="text-xs font-medium text-neutral-500">
                    Customer Tracking
                  </p>
                </div>
              </div>
            </div>

            {/* Right card: Live Customer Order Tracker */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-ink">
                      Track a Delivery
                    </h3>
                    <p className="text-xs font-medium text-neutral-500">
                      No account required for customers
                    </p>
                  </div>
                </div>

                <form onSubmit={handleTrackSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="trackId"
                      className="block text-xs font-bold uppercase tracking-wider text-neutral-600"
                    >
                      Order Number or Tracking Token
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                        <Search className="h-4 w-4" />
                      </div>
                      <input
                        id="trackId"
                        type="text"
                        value={trackingInput}
                        onChange={(e) => {
                          setTrackingInput(e.target.value)
                          if (trackingError) setTrackingError(null)
                        }}
                        placeholder="e.g. ORD-000001"
                        className="block w-full min-h-touch rounded-xl border border-neutral-300 bg-white pl-10 pr-3.5 text-sm font-medium text-ink placeholder-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-data"
                      />
                    </div>
                    {trackingError && (
                      <p className="mt-1.5 text-xs font-medium text-status-danger">
                        {trackingError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="flex w-full min-h-touch items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
                  >
                    <span>Track Parcel Status</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="mt-6 border-t border-neutral-100 pt-5">
                  <p className="text-xs font-medium text-neutral-500">
                    💡 Tracking an order? Enter the 6-digit order number from
                    your SMS or WhatsApp notification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works / Value Props ── */}
        <section className="border-t border-neutral-200 bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand">
                Built For Lagos Commerce
              </h3>
              <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                One platform connecting businesses, riders, and customers.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Pillar 1: Sellers */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
                    <Store className="h-6 w-6" />
                  </div>
                  <h4 className="mt-5 font-heading text-lg font-bold text-ink">
                    For SME Merchants
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    Book pickups in under 30 seconds. Protect your margins with
                    low, transparent delivery fees and guaranteed COD
                    remittance.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-neutral-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                      <span>Instant rider dispatch</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                      <span>Automated tracking link generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                      <span>Clear settlement reports</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="mt-6 flex items-center gap-1.5 text-xs font-bold text-ink hover:text-brand-700 transition-colors"
                >
                  Create seller account <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Pillar 2: Riders */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    <Bike className="h-6 w-6" />
                  </div>
                  <h4 className="mt-5 font-heading text-lg font-bold text-ink">
                    For Dispatch Riders
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    Join a professional fleet in Ikeja and beyond. Reliable
                    delivery batches, fair rates, and prompt payouts directly to
                    your bank.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-neutral-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                      <span>Zone-optimized routes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                      <span>Earn per successful delivery</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                      <span>Zero deductions on tips</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="mt-6 flex items-center gap-1.5 text-xs font-bold text-ink hover:text-brand-700 transition-colors"
                >
                  Register as a rider <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Pillar 3: Realtime Operations */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h4 className="mt-5 font-heading text-lg font-bold text-ink">
                    Safe & Transparent
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    Every package is tracked from merchant pickup to doorstep
                    handover with complete status audit trails.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-neutral-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                      <span>No account needed for buyers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                      <span>OTP & signature handover</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-status-success shrink-0" />
                      <span>Strict COD reconciliation</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-neutral-400">
                  Operated in Lagos, Nigeria
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:px-8 sm:text-left">
          <div className="flex items-center gap-2.5">
            <img
              src="/icons/icon-512.png"
              alt="Eko Riders"
              className="h-6 w-6 rounded-lg object-cover"
            />
            <span className="font-heading text-sm font-black text-ink">
              Eko Riders
            </span>
            <span className="text-xs text-neutral-400">
              © {new Date().getFullYear()} Eko Riders Logistics Ltd.
            </span>
          </div>

          <p className="text-xs text-neutral-500">
            Pilot Zone: Ikeja, Lagos · Same-day delivery across Lagos State
          </p>
        </div>
      </footer>
    </div>
  )
}
