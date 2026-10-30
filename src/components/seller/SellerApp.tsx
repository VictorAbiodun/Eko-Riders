import { useState } from 'react'
import {
  Home,
  Package,
  PlusCircle,
  CreditCard,
  Settings,
  User,
  LogOut,
} from 'lucide-react'
import { ResponsiveShell } from '../shell/ResponsiveShell'
import type { TabItem } from '../shell/TabBar'
import { useAppData } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { navigate } from '../../lib/navigation'

// Screens
import { SellerHome } from './SellerHome'
import { SellerCreateOrder } from './SellerCreateOrder'
import { SellerOrders } from './SellerOrders'
import { SellerOrderDetail } from './SellerOrderDetail'
import { SellerPayments } from './SellerPayments'

const SELLER_TABS: TabItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'create', label: 'Create', icon: PlusCircle },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function SellerApp() {
  const { sellers } = useAppData()
  const { user, profile, seller, signOut } = useAuth()

  // Fallback mock if not logged in
  const mockSeller = sellers.find((s) => s.name === 'Adunni Okafor')

  const sellerBusinessName =
    seller?.business_name ?? mockSeller?.businessName ?? 'Seller Dashboard'

  const [activeTab, setActiveTab] = useState('home')

  // Drill-down state for Order Details
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  if (!mockSeller) return null

  // If viewing a specific order detail, hide the shell/tabs and show detail full-screen on mobile,
  // or inside the shell on desktop? The prompt says "swap the bottom tab bar for a left sidebar nav".
  // For simplicity, we can render SellerOrderDetail inside the shell.
  // Wait, in Rider app, Detail is full screen. Let's make it consistent, but for Seller, desktop sidebar is always visible.
  // We can just render the detail view inside the shell.

  const titles: Record<string, string> = {
    home: mockSeller.businessName,
    orders: 'Orders',
    create: 'Create Order',
    payments: 'Payments',
    settings: 'Settings',
  }

  const handleCreateOrderSuccess = () => {
    setActiveTab('home')
  }

  const sidebarFooter = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">
            {sellerBusinessName}
          </p>
          <div className="mt-0.5 inline-block rounded bg-status-success-bg px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-status-success">
            {user ? 'Live Supabase' : 'Growth Plan'}
          </div>
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
          href="/login"
          onClick={(e) => {
            e.preventDefault()
            navigate('/login')
          }}
          className="text-xs font-semibold text-brand hover:underline"
        >
          Sign in
        </a>
      )}
    </div>
  )

  return (
    <ResponsiveShell
      title={
        selectedOrderId
          ? `Order ${selectedOrderId}`
          : (titles[activeTab] ?? 'Dashboard')
      }
      tabs={SELLER_TABS}
      activeTab={selectedOrderId ? 'orders' : activeTab} // Keep orders active if drilling down
      onTabChange={(id) => {
        setSelectedOrderId(null)
        setActiveTab(id)
      }}
      centerTabId="create"
      sidebarFooter={sidebarFooter}
      showBack={!!selectedOrderId}
      onBack={() => setSelectedOrderId(null)}
    >
      {selectedOrderId ? (
        <SellerOrderDetail orderId={selectedOrderId} />
      ) : (
        <>
          {activeTab === 'home' && (
            <SellerHome
              seller={mockSeller}
              onNavigateToCreate={() => setActiveTab('create')}
              onSelectOrder={setSelectedOrderId}
            />
          )}

          {activeTab === 'orders' && (
            <SellerOrders
              seller={mockSeller}
              onSelectOrder={setSelectedOrderId}
            />
          )}

          {activeTab === 'create' && (
            <SellerCreateOrder
              seller={mockSeller}
              onSuccess={handleCreateOrderSuccess}
            />
          )}

          {activeTab === 'payments' && <SellerPayments seller={mockSeller} />}

          {activeTab === 'settings' && (
            <div className="p-4 md:p-8 max-w-lg space-y-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
                <h3 className="font-heading text-base font-bold text-ink">
                  Account & Security
                </h3>
                <div className="mt-3 space-y-2 text-sm text-neutral-600">
                  <p>
                    <span className="font-medium text-neutral-400">
                      Account:
                    </span>{' '}
                    {profile?.full_name ?? mockSeller.name}
                  </p>
                  <p>
                    <span className="font-medium text-neutral-400">Email:</span>{' '}
                    {user?.email ?? 'adunni@example.com'}
                  </p>
                  <p>
                    <span className="font-medium text-neutral-400">
                      Session:
                    </span>{' '}
                    {user
                      ? 'Authenticated with Supabase'
                      : 'Demo Local Session'}
                  </p>
                </div>
                {user ? (
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="mt-4 flex w-full min-h-touch items-center justify-center gap-2 rounded-xl border border-status-danger-border bg-white text-sm font-bold text-status-danger shadow-xs transition-colors hover:bg-status-danger-bg"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                ) : (
                  <a
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/login')
                    }}
                    className="mt-4 flex w-full min-h-touch items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-ink shadow-xs transition-colors hover:bg-brand-600"
                  >
                    <span>Sign in with live account</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </ResponsiveShell>
  )
}
