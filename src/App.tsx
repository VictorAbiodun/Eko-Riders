import { useState, useCallback, useSyncExternalStore } from 'react'
import {
  LayoutGrid,
  Package,
  Palette,
  Search,
  Settings,
  Truck,
} from 'lucide-react'
import { DesignSystemReference } from './components/design-system/DesignSystemReference'
import { MobileShell, type TabItem } from './components/shell/MobileShell'
import { EmptyState } from './components/ui/EmptyState'
import { LoadingSkeleton } from './components/ui/LoadingSkeleton'
import { DanfoLoader } from './components/ui/DanfoLoader'
import { StatusBadge } from './components/ui/StatusBadge'
import { TrackingPage } from './components/tracking/TrackingPage'
import { RiderApp } from './components/rider/RiderApp'
import { SellerApp } from './components/seller/SellerApp'
import { AdminApp } from './components/admin/AdminApp'
import { AppProvider, useAppData } from './context/AppContext'
import { LandingPage } from './components/LandingPage'
import { formatNaira } from './data/mockData'
import type { OrderStatus } from './data/types'

/* ─── Lightweight pathname router ─── */

function subscribeToPath(cb: () => void) {
  window.addEventListener('popstate', cb)
  return () => window.removeEventListener('popstate', cb)
}

function getPath() {
  return window.location.pathname
}

function usePath() {
  return useSyncExternalStore(subscribeToPath, getPath)
}

const TABS: TabItem[] = [
  { id: 'tokens', label: 'Tokens', icon: Palette },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'shell', label: 'Shell', icon: LayoutGrid },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function OrdersPreview() {
  const { orders, riders, sellers } = useAppData()

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="p-4">
      <p className="text-sm text-neutral-500">
        Mock data loaded in memory — {orders.length} orders, {riders.length} riders,{' '}
        {sellers.length} sellers.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {Object.entries(byStatus).map(([status, count]) => (
          <div
            key={status}
            className="rounded-lg border border-neutral-200 bg-white p-3"
          >
            <StatusBadge status={status as OrderStatus} />
            <p className="mt-2 font-heading text-2xl font-bold text-neutral-900">
              {count}
            </p>
          </div>
        ))}
      </div>

      <h3 className="mt-6 font-heading text-sm font-semibold text-neutral-700">
        Recent orders
      </h3>
      <ul className="mt-2 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {orders.slice(0, 5).map((order) => (
          <li key={order.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-800">
                  {order.customerName}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {order.customerAddress}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
              <span className="font-mono">{order.id}</span>
              <span>{formatNaira(order.codAmount)} COD</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ShellDemo() {
  const [view, setView] = useState<'empty' | 'loading'>('empty')

  return (
    <div className="p-4">
      <p className="mb-4 text-sm text-neutral-500">
        Reusable empty and loading states for every screen.
      </p>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setView('empty')}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            view === 'empty'
              ? 'bg-brand text-white'
              : 'border border-neutral-300 bg-white text-neutral-700'
          }`}
        >
          Empty state
        </button>
        <button
          type="button"
          onClick={() => setView('loading')}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            view === 'loading'
              ? 'bg-brand text-white'
              : 'border border-neutral-300 bg-white text-neutral-700'
          }`}
        >
          Loading skeleton
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {view === 'empty' ? (
          <EmptyState
            icon={Truck}
            title="No deliveries yet"
            description="Orders assigned to riders will show up here once dispatch begins."
            action={
              <button
                type="button"
                className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white"
              >
                Create order
              </button>
            }
          />
        ) : (
          <LoadingSkeleton count={4} />
        )}
      </div>
    </div>
  )
}

function SettingsPlaceholder() {
  return (
    <EmptyState
      title="Settings"
      description="App configuration screens will live here in a later step."
    />
  )
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('tokens')

  const titles: Record<string, string> = {
    tokens: 'Design System',
    orders: 'Orders',
    shell: 'Shell States',
    settings: 'Settings',
  }

  return (
    <MobileShell
      title={titles[activeTab] ?? 'ShipFast'}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      rightAction={
        activeTab === 'orders'
          ? { icon: Search, label: 'Search orders', onClick: () => {} }
          : undefined
      }
    >
      {activeTab === 'tokens' && <DesignSystemReference />}
      {activeTab === 'orders' && <OrdersPreview />}
      {activeTab === 'shell' && <ShellDemo />}
      {activeTab === 'settings' && <SettingsPlaceholder />}
    </MobileShell>
  )
}

/* ─── Loading gate — shows DanfoLoader on initial mount ─── */

const LOADER_MESSAGES = [
  'Getting your delivery ready\u2026',
  'Warming up the engine\u2026',
  'Loading your dashboard\u2026',
  'Almost there\u2026',
]

function LoadingGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const handleFinish = useCallback(() => setLoading(false), [])

  if (loading) {
    return (
      <DanfoLoader
        message={LOADER_MESSAGES[Math.floor(Math.random() * LOADER_MESSAGES.length)]}
        durationMs={700}
        onFinish={handleFinish}
      />
    )
  }

  return <>{children}</>
}

export default function App() {
  const path = usePath()

  // /track/ORD-XXXXXX → standalone tracking page
  const trackMatch = path.match(/^\/track\/(ORD-\d+)$/i)
  if (trackMatch) {
    return (
      <AppProvider>
        <LoadingGate>
          <TrackingPage orderId={trackMatch[1].toUpperCase()} />
        </LoadingGate>
      </AppProvider>
    )
  }

  // /rider → Rider App
  if (path.startsWith('/rider')) {
    return (
      <AppProvider>
        <LoadingGate>
          <RiderApp />
        </LoadingGate>
      </AppProvider>
    )
  }

  // /seller → Seller Dashboard
  if (path.startsWith('/seller')) {
    return (
      <AppProvider>
        <LoadingGate>
          <SellerApp />
        </LoadingGate>
      </AppProvider>
    )
  }

  // /admin — internal admin shell
  if (path.startsWith('/admin')) {
    return (
      <AppProvider>
        <LoadingGate>
          <AdminApp />
        </LoadingGate>
      </AppProvider>
    )
  }

  // Default: landing page (demo picker)
  return <LandingPage />
}
