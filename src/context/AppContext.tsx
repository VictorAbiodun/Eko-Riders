import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { mockOrders, mockRiders, mockSellers } from '../data/mockData'
import type { Order, Rider, Seller } from '../data/types'

interface AppContextValue {
  orders: Order[]
  riders: Rider[]
  sellers: Seller[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

const AppContext = createContext<AppContextValue | null>(null)

const STORAGE_KEY = 'shipfast_demo_orders'

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // ignore parse error
      }
    }
    return mockOrders
  })

  // Sync to local storage whenever orders change in this tab
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue))
        } catch {
          // ignore parse error
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const value = useMemo(
    () => ({
      orders,
      riders: mockRiders,
      sellers: mockSellers,
      setOrders,
    }),
    [orders],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useAppData must be used within AppProvider')
  }
  return ctx
}
