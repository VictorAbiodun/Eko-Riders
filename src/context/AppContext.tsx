import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  mockOrders,
  mockRiders,
  mockSellers,
  nextOrderId,
} from '../data/mockData'
import type { Order, Rider, Seller, OrderStatus } from '../data/types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface CreateOrderParams {
  customerName: string
  customerPhone: string
  customerAddress: string
  dropoffArea?: string
  productDescription: string
  packageValue?: number
  codAmount: number
  deliveryFee?: number
  sellerName?: string
}

interface AppContextValue {
  orders: Order[]
  riders: Rider[]
  sellers: Seller[]
  loading: boolean
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  createOrder: (
    params: CreateOrderParams,
  ) => Promise<{ error: Error | null; orderId?: string }>
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    failureReason?: string,
  ) => Promise<{ error: Error | null }>
  refreshOrders: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

const STORAGE_KEY = 'eko_riders_demo_orders'

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

  const [loading, setLoading] = useState(false)

  // Map Supabase DB order row to UI Order
  const mapDbOrderToUi = (row: any): Order => ({
    id: row.order_number || row.id,
    status: row.status as OrderStatus,
    sellerName: row.sellers?.business_name ?? 'Seller',
    customerName: row.customers?.name ?? 'Customer',
    customerAddress:
      row.dropoff_address || row.customers?.address || 'Lagos, Nigeria',
    riderName: row.riders?.profiles?.full_name ?? null,
    productDescription: row.product_description,
    codAmount: Math.round((row.cod_amount_kobo || 0) / 100),
    deliveryFee: Math.round((row.delivery_fee_kobo || 0) / 100),
    createdAt: row.created_at,
  })

  // Fetch live orders from Supabase
  const fetchOrders = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          id,
          order_number,
          tracking_token,
          seller_id,
          customer_id,
          rider_id,
          status,
          product_description,
          cod_amount_kobo,
          delivery_fee_kobo,
          dropoff_address,
          dropoff_area,
          created_at,
          sellers ( id, business_name, phone ),
          customers ( id, name, phone, address ),
          riders ( id, profile_id, profiles:profile_id ( full_name, phone ) )
        `,
        )
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        const liveOrders = data.map(mapDbOrderToUi)
        setOrders(liveOrders)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(liveOrders))
      }
    } catch (err) {
      console.warn(
        'Could not fetch live Supabase orders, using local state:',
        err,
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // Sync to local storage whenever orders change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  // Initial fetch and Realtime subscription
  useEffect(() => {
    fetchOrders()

    if (!supabase || !isSupabaseConfigured) return

    const channel = supabase
      .channel('public:orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders()
        },
      )
      .subscribe()

    return () => {
      if (supabase) {
        supabase.removeChannel(channel)
      }
    }
  }, [fetchOrders])

  // Listen for changes from other browser tabs
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

  // Create order via Supabase RPC or direct insert
  const createOrder = async (params: CreateOrderParams) => {
    if (supabase && isSupabaseConfigured) {
      try {
        // Attempt atomic DB creation via RPC
        const { data, error } = await supabase.rpc('create_seller_order', {
          p_customer_name: params.customerName,
          p_customer_phone: params.customerPhone,
          p_customer_address: params.customerAddress,
          p_dropoff_area: params.dropoffArea || 'Ikeja',
          p_product_description: params.productDescription,
          p_cod_amount_kobo: (params.codAmount || 0) * 100,
          p_delivery_fee_kobo: (params.deliveryFee ?? 1500) * 100,
        })

        if (!error && data) {
          const generatedNumber = (data as any).order_number
          await fetchOrders()
          return { error: null, orderId: generatedNumber }
        }
      } catch (err) {
        console.warn('RPC create_seller_order error, using fallback:', err)
      }
    }

    // Local / immediate optimistic fallback
    const fallbackId = nextOrderId(orders.map((o) => o.id))
    const fallbackOrder: Order = {
      id: fallbackId,
      status: 'NEW',
      sellerName: params.sellerName || 'My Store',
      customerName: params.customerName,
      customerAddress: params.customerAddress,
      riderName: null,
      productDescription: params.productDescription,
      codAmount: params.codAmount,
      deliveryFee: params.deliveryFee ?? 1500,
      createdAt: new Date().toISOString(),
    }

    setOrders((prev) => [fallbackOrder, ...prev])
    return { error: null, orderId: fallbackId }
  }

  // Update order status (with Supabase sync)
  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    failureReason?: string,
  ) => {
    // 1. Optimistic local update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    )

    // 2. Persist to Supabase if connected
    if (supabase && isSupabaseConfigured) {
      try {
        // Check if orderId is order_number or UUID
        const isOrderNumber = orderId.startsWith('ORD-')
        const filterColumn = isOrderNumber ? 'order_number' : 'id'

        await supabase
          .from('orders')
          .update({
            status: newStatus as any,
            failure_reason: failureReason ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq(filterColumn, orderId)
      } catch (err) {
        console.warn('Failed to update order status in Supabase:', err)
      }
    }

    return { error: null }
  }

  const value = useMemo(
    () => ({
      orders,
      riders: mockRiders,
      sellers: mockSellers,
      loading,
      setOrders,
      createOrder,
      updateOrderStatus,
      refreshOrders: fetchOrders,
    }),
    [orders, loading, fetchOrders, createOrder, updateOrderStatus],
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
