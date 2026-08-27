import { useState } from 'react'
import { Home, Package, Banknote, User as UserIcon } from 'lucide-react'
import { MobileShell, type TabItem } from '../shell/MobileShell'
import { useAppData } from '../../context/AppContext'
import { EmptyState } from '../ui/EmptyState'

// Screens
import { RiderHome } from './RiderHome'
import { RiderDeliveriesList } from './RiderDeliveriesList'
import { RiderDeliveryDetail } from './RiderDeliveryDetail'
import { RiderEarnings } from './RiderEarnings'

const RIDER_TABS: TabItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'deliveries', label: 'Deliveries', icon: Package },
  { id: 'earnings', label: 'Earnings', icon: Banknote },
  { id: 'profile', label: 'Profile', icon: UserIcon },
]

export function RiderApp() {
  const { riders } = useAppData()
  // Mock login: always use Ibrahim for this demo
  const mockRider = riders.find((r) => r.name === 'Ibrahim Musa')

  const [activeTab, setActiveTab] = useState('home')
  
  // Drill-down state for Delivery Details
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  if (!mockRider) return null

  // If viewing a specific order detail, hide the shell/tabs and show detail full-screen
  if (selectedOrderId) {
    return (
      <RiderDeliveryDetail
        orderId={selectedOrderId}
        onBack={() => setSelectedOrderId(null)}
      />
    )
  }

  const titles: Record<string, string> = {
    home: 'Home',
    deliveries: 'My Deliveries',
    earnings: 'Earnings',
    profile: 'Profile',
  }

  return (
    <MobileShell
      title={titles[activeTab] ?? 'Rider App'}
      tabs={RIDER_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'home' && (
        <RiderHome
          rider={mockRider}
          onNavigateToDeliveries={() => setActiveTab('deliveries')}
          onNavigateToEarnings={() => setActiveTab('earnings')}
        />
      )}
      
      {activeTab === 'deliveries' && (
        <RiderDeliveriesList
          rider={mockRider}
          onSelectOrder={setSelectedOrderId}
        />
      )}
      
      {activeTab === 'earnings' && <RiderEarnings rider={mockRider} />}
      
      {activeTab === 'profile' && (
        <div className="p-4">
          <EmptyState
            title="Profile"
            description="Manage your rider account, vehicle details, and settings here."
          />
        </div>
      )}
    </MobileShell>
  )
}
