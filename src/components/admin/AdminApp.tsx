import { useState } from 'react'
import {
  Activity,
  Package,
  Bike,
  Store,
  CreditCard,
  RotateCcw,
} from 'lucide-react'
import { ResponsiveShell } from '../shell/ResponsiveShell'
import type { TabItem } from '../shell/TabBar'
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
  const [activeTab, setActiveTab] = useState('operations')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const loader = useDanfoTransition(selectedOrderId ? `order:${selectedOrderId}` : activeTab)

  const handleNav = (id: string) => {
    setSelectedOrderId(null)
    setActiveTab(id)
  }

  const sidebarFooter = (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-700">
        OA
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">Ops Admin</p>
        <p className="truncate text-xs text-neutral-500">admin@shipfast.ng</p>
      </div>
    </div>
  )

  return (
    <>
      {loader}
      <ResponsiveShell
        title={selectedOrderId ? `Order ${selectedOrderId}` : TITLES[activeTab] ?? 'Admin'}
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
