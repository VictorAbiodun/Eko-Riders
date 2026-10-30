import { useState, useCallback, useSyncExternalStore } from 'react'
import { DesignSystemReference } from './components/design-system/DesignSystemReference'
import { DanfoLoader } from './components/ui/DanfoLoader'
import { TrackingPage } from './components/tracking/TrackingPage'
import { RiderApp } from './components/rider/RiderApp'
import { SellerApp } from './components/seller/SellerApp'
import { AdminApp } from './components/admin/AdminApp'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { LandingPage } from './components/LandingPage'
import { LoginPage } from './components/auth/LoginPage'
import { navigate } from './lib/navigation'

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

/* ─── Loading gate — shows DanfoLoader on initial mount ─── */

const LOADER_MESSAGES = [
  'Getting your delivery ready…',
  'Warming up the engine…',
  'Loading your dashboard…',
  'Almost there…',
]

function LoadingGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [message] = useState(
    () => LOADER_MESSAGES[Math.floor(Math.random() * LOADER_MESSAGES.length)],
  )
  const handleFinish = useCallback(() => setLoading(false), [])

  if (loading) {
    return (
      <DanfoLoader message={message} durationMs={700} onFinish={handleFinish} />
    )
  }

  return <>{children}</>
}

export default function App() {
  const path = usePath()

  return (
    <AuthProvider>
      <AppContent path={path} />
    </AuthProvider>
  )
}

function AppContent({ path }: { path: string }) {
  // /login → dedicated authentication page
  if (path.startsWith('/login')) {
    const roleParam = path.startsWith('/login/rider')
      ? 'rider'
      : path.startsWith('/login/admin')
        ? 'admin'
        : 'seller'

    return (
      <LoginPage
        initialRole={roleParam}
        onCancel={() => {
          navigate('/')
        }}
        onSuccess={() => {
          const target =
            roleParam === 'rider'
              ? '/rider'
              : roleParam === 'admin'
                ? '/admin'
                : '/seller'
          navigate(target)
        }}
      />
    )
  }

  // /dev/design-system → token reference sheet, development builds only
  if (import.meta.env.DEV && path.startsWith('/dev/design-system')) {
    return (
      <div className="mx-auto max-w-md">
        <DesignSystemReference />
      </div>
    )
  }

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
