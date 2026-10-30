import { useState } from 'react'
import {
  Activity,
  Package,
  Bike,
  Store,
  CreditCard,
  RotateCcw,
  LogOut,
} from 'lucide-react'
import { ResponsiveShell } from '../shell/ResponsiveShell'
import type { TabItem } from '../shell/TabBar'
import { useAuth } from '../../context/AuthContext'
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
