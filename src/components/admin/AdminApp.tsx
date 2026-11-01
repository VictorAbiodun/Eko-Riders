import { useState } from 'react'
import {
  Activity,
  Package,
  Bike,
  Store,
  CreditCard,
  RotateCcw,
  LogOut,
  Shield,
  ShieldAlert,
} from 'lucide-react'
import { ResponsiveShell } from '../shell/ResponsiveShell'
import type { TabItem } from '../shell/TabBar'
import { useAuth } from '../../context/AuthContext'
import { navigate } from '../../lib/navigation'
import { AdminOperations } from './AdminOperations'
import { AdminOrders } from './AdminOrders'
import { AdminRiders } from './AdminRiders'
import { AdminSellers } from './AdminSellers'
import { AdminPayments } from './AdminPayments'
import { AdminReturns } from './AdminReturns'
import { useDanfoTransition } from '../../hooks/useDanfoTransition'

const ADMIN_TABS: TabItem[] = [
  { id: 'operations', label: 'Ops', icon: Activity },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'riders', label: 'Riders', icon: Bike },
  { id: 'sellers', label: 'Sellers', icon: Store },
  { id: 'payments', label: 'Pay', icon: CreditCard },
  { id: 'returns', label: 'Returns', icon: RotateCcw },
]

const TITLES: Record<string, string> = {
  operations: 'Operations',
  orders: 'Orders',
  riders: 'Riders',
  sellers: 'Sellers',
  payments: 'Payments',
  returns: 'Returns',
}

export function AdminApp() {
  const { user, profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('operations')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const loader = useDanfoTransition(
    selectedOrderId ? `order:${selectedOrderId}` : activeTab,
  )

  const handleNav = (id: string) => {
    setSelectedOrderId(null)
    setActiveTab(id)
  }

  // Gate 1: Not signed in
  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-neutral-50 p-6 text-center">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-200/90 bg-white p-7 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-800">
            <Shield className="h-7 w-7 text-brand" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-black text-ink">
            Admin Access Required
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            Sign in with an authorized Eko-Riders administrator account to oversee fleet dispatch, active Lagos orders, and COD settlements.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/login/admin')}
              className="flex w-full min-h-touch items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-brand-600"
            >
              Admin Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup/admin')}
              className="flex w-full min-h-touch items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Register Admin Account
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-1 text-xs font-medium text-neutral-400 hover:text-ink transition-colors"
            >
              ← Back to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Gate 2: Signed in but non-admin role
  if (profile && profile.role !== 'admin' && profile.role !== 'ops') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-neutral-50 p-6 text-center">
        <div className="w-full max-w-sm rounded-2xl border border-status-danger-border bg-white p-7 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-status-danger-bg text-status-danger">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-black text-ink">
            Access Restricted
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            You are signed in as a <strong className="uppercase text-ink">{profile.role}</strong> ({user.email}). Administrator permissions are required to access this portal.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => navigate(profile.role === 'rider' ? '/rider' : '/seller')}
              className="flex w-full min-h-touch items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-brand-600"
            >
              Open {profile.role === 'rider' ? 'Rider' : 'Seller'} Dashboard
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              className="flex w-full min-h-touch items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  const sidebarFooter = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-700">
          {profile?.full_name
            ? profile.full_name.slice(0, 2).toUpperCase()
            : 'OA'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">
            {profile?.full_name ?? 'Ops Admin'}
          </p>
          <p className="truncate text-xs text-neutral-500">
            {user?.email ?? 'admin@ekoriders.ng'}
          </p>
        </div>
      </div>
      {user ? (
        <button
          type="button"
          onClick={() => signOut()}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-ink hover:bg-neutral-100 transition-colors"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      ) : (
        <a
          href="/login/admin"
          onClick={(e) => {
            e.preventDefault()
            navigate('/login/admin')
          }}
          className="text-xs font-semibold text-accent hover:underline"
        >
          Sign in
        </a>
      )}
    </div>
  )

  return (
    <>
      {loader}
      <ResponsiveShell
        title={
          selectedOrderId
            ? `Order ${selectedOrderId}`
            : (TITLES[activeTab] ?? 'Admin')
        }
        tabs={ADMIN_TABS}
        activeTab={selectedOrderId ? 'orders' : activeTab}
        onTabChange={handleNav}
        centerTabId="operations"
        sidebarFooter={sidebarFooter}
        showBack={!!selectedOrderId}
        onBack={() => setSelectedOrderId(null)}
      >
        {activeTab === 'operations' && (
          <AdminOperations
            onNavigate={handleNav}
            onSelectOrder={(id) => {
              setSelectedOrderId(id)
              setActiveTab('orders')
            }}
          />
        )}
        {activeTab === 'orders' && (
          <AdminOrders
            selectedOrderId={selectedOrderId}
            onSelectOrder={setSelectedOrderId}
            onBack={() => setSelectedOrderId(null)}
          />
        )}
        {activeTab === 'riders' && <AdminRiders />}
        {activeTab === 'sellers' && <AdminSellers />}
        {activeTab === 'payments' && <AdminPayments />}
        {activeTab === 'returns' && <AdminReturns />}
      </ResponsiveShell>
    </>
  )
}
