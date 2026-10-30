import {
  Truck,
  Store,
  MapPin,
  LayoutGrid,
  ArrowRight,
  LogOut,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface DemoCard {
  title: string
  description: string
  icon: LucideIcon
  href: string
  accent: string
  accentBg: string
  accentBorder: string
  tag: string
}

const DEMOS: DemoCard[] = [
  {
    title: 'Rider App',
    description:
      'Accept deliveries, navigate to pickups, collect COD, and complete orders with OTP verification.',
    icon: Truck,
    href: '/rider',
    accent: 'text-emerald-700',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    tag: 'Mobile',
  },
  {
    title: 'Seller Dashboard',
    description:
      'Create orders, track shipments, manage payments, and monitor delivery performance.',
    icon: Store,
    href: '/seller',
    accent: 'text-violet-700',
    accentBg: 'bg-violet-50',
    accentBorder: 'border-violet-200',
    tag: 'Responsive',
  },
  {
    title: 'Order Tracking',
    description:
      'Real-time tracking page shared with customers via link — stepper, rider info, and ETA.',
    icon: MapPin,
    href: '/track/ORD-000003',
    accent: 'text-sky-700',
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-200',
    tag: 'Public',
  },
  {
    title: 'Admin Shell',
    description:
      'Internal design system reference, order overview, and reusable shell states.',
    icon: LayoutGrid,
    href: '/admin',
    accent: 'text-amber-700',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    tag: 'Internal',
  },
]

function DemoCardItem({ card }: { card: DemoCard }) {
  const Icon = card.icon

  return (
    <a
      href={card.href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
    >
      {/* Accent stripe */}
      <div className={`h-1.5 w-full ${card.accentBg}`} />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Icon + tag row */}
        <div className="flex items-start justify-between">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.accentBg} ${card.accent}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${card.accent} ${card.accentBg} ${card.accentBorder}`}
          >
            {card.tag}
          </span>
        </div>

        {/* Text */}
        <h3 className="mt-4 font-heading text-lg font-bold text-ink">
          {card.title}
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-neutral-500">
          {card.description}
        </p>

        {/* CTA */}
        <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-brand-700">
          Open demo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </a>
  )
}

export function LandingPage() {
  const { user, profile, signOut } = useAuth()

  return (
    <div className="min-h-dvh bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
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
              <p className="text-xs font-medium text-neutral-400">
                Last-mile delivery for Nigerian businesses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-ink">
                    {profile?.full_name ?? user.email}
                  </p>
                  <p className="text-[10px] uppercase font-semibold text-brand tracking-wider">
                    {profile?.role ?? 'User'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="flex min-h-touch items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:border-status-danger-border hover:bg-status-danger-bg hover:text-status-danger"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="flex min-h-touch items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 text-xs font-bold text-ink shadow-2xs transition-colors hover:border-brand hover:bg-neutral-50"
              >
                Sign in
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-4xl px-5 pt-10 pb-4 sm:px-8 sm:pt-14">
        <p className="text-xs font-bold uppercase tracking-widest text-brand">
          Interactive Demo
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Choose a perspective
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-500 sm:text-base">
          Each view shows the same delivery ecosystem from a different role.
          Pick one to explore.
        </p>
      </div>

      {/* Cards grid */}
      <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {DEMOS.map((card) => (
            <DemoCardItem key={card.href} card={card} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mx-auto max-w-4xl px-5 py-8 text-center sm:px-8">
        <p className="text-xs text-neutral-400">
          Built with React · Tailwind · Vite
        </p>
      </footer>
    </div>
  )
}
