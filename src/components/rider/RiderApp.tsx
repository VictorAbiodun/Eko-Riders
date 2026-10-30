import { useState } from 'react'
import { Home, Package, Banknote, User as UserIcon, LogOut } from 'lucide-react'
import { MobileShell, type TabItem } from '../shell/MobileShell'
import { useAppData } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { navigate } from '../../lib/navigation'

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
  const { user, profile, rider, signOut } = useAuth()
  // Mock fallback
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
      centerTabId="deliveries"
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
        <div className="p-4 space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-base">
                {profile?.full_name ? profile.full_name[0] : 'I'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-bold text-ink truncate">
                  {profile?.full_name ?? mockRider.name}
                </h3>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email ?? mockRider.phone}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-neutral-100 pt-3 space-y-2 text-xs text-neutral-600">
              <div className="flex items-center justify-between">
                <span>Vehicle type</span>
                <span className="font-semibold uppercase text-ink">
                  {rider?.vehicle_type ?? mockRider.vehicleType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active zone</span>
                <span className="font-semibold text-ink">
                  {rider?.current_zone ?? mockRider.currentZone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database session</span>
                <span className="font-semibold text-status-success uppercase text-[10px]">
                  {user ? 'Live Supabase' : 'Demo Mode'}
                </span>
              </div>
            </div>
          </div>

          {user ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="flex w-full min-h-touch items-center justify-center gap-2 rounded-xl border border-status-danger-border bg-white text-sm font-bold text-status-danger shadow-xs transition-colors hover:bg-status-danger-bg"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          ) : (
            <a
              href="/login/rider"
              onClick={(e) => {
                e.preventDefault()
                navigate('/login/rider')
              }}
              className="flex w-full min-h-touch items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-ink shadow-xs transition-colors hover:bg-brand-600"
            >
              <span>Sign in with live account</span>
            </a>
          )}
        </div>
      )}
    </MobileShell>
  )
}
