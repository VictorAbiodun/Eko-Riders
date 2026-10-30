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

  // Fallback mock if not logged in
  const mockRider = riders.find((r) => r.name === 'Ibrahim Musa') ?? riders[0]

  // Use logged-in rider data when authenticated, or fallback to mock in demo mode
  const activeRider = user
    ? {
        id: rider?.id ?? user.id,
        name: profile?.full_name ?? user.user_metadata?.full_name ?? 'Rider',
        phone: profile?.phone ?? user.user_metadata?.phone ?? '',
        vehicleType:
          (rider?.vehicle_type as 'bike' | 'bicycle' | 'van') ??
          user.user_metadata?.vehicle_type ??
          'bike',
        status:
          (rider?.status as 'available' | 'on_delivery' | 'offline') ??
          'available',
        currentZone: rider?.current_zone ?? user.user_metadata?.area ?? 'Ikeja',
        completedToday: 0,
        rating: 5.0,
      }
    : mockRider

  const [activeTab, setActiveTab] = useState('home')

  // Drill-down state for Delivery Details
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

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
          rider={activeRider}
          onNavigateToDeliveries={() => setActiveTab('deliveries')}
          onNavigateToEarnings={() => setActiveTab('earnings')}
        />
      )}

      {activeTab === 'deliveries' && (
        <RiderDeliveriesList
          rider={activeRider}
          onSelectOrder={setSelectedOrderId}
        />
      )}

      {activeTab === 'earnings' && <RiderEarnings rider={activeRider} />}

      {activeTab === 'profile' && (
        <div className="p-4 space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-base">
                {activeRider.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-bold text-ink truncate">
                  {activeRider.name}
                </h3>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email ?? activeRider.phone}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-neutral-100 pt-3 space-y-2 text-xs text-neutral-600">
              <div className="flex items-center justify-between">
                <span>Vehicle type</span>
                <span className="font-semibold uppercase text-ink">
                  {activeRider.vehicleType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active zone</span>
                <span className="font-semibold text-ink">
                  {activeRider.currentZone}
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
