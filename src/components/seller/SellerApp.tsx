import { useState } from 'react'
import { Home, Package, PlusCircle, CreditCard, Settings, User } from 'lucide-react'
import { ResponsiveShell } from '../shell/ResponsiveShell'
import type { TabItem } from '../shell/TabBar'
import { useAppData } from '../../context/AppContext'
import { EmptyState } from '../ui/EmptyState'

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
  // Mock login: always use Adunni Okafor / Adunni Fashion Hub
  const mockSeller = sellers.find((s) => s.name === 'Adunni Okafor')

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
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <User className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink">
          {mockSeller.businessName}
        </p>
        <div className="mt-0.5 inline-block rounded bg-status-success-bg px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-status-success">
          Growth Plan
        </div>
      </div>
    </div>
  )

  return (
    <ResponsiveShell
      title={selectedOrderId ? `Order ${selectedOrderId}` : titles[activeTab] ?? 'Dashboard'}
      tabs={SELLER_TABS}
      activeTab={selectedOrderId ? 'orders' : activeTab} // Keep orders active if drilling down
      onTabChange={(id) => {
        setSelectedOrderId(null)
        setActiveTab(id)
      }}
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
            <div className="p-4 md:p-8">
              <EmptyState
                title="Settings"
                description="Manage your business profile, subscription plan, and notification preferences."
              />
            </div>
          )}
        </>
      )}
    </ResponsiveShell>
  )
}
