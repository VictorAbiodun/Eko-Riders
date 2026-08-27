export type OrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED'

export interface Order {
  id: string
  status: OrderStatus
  sellerName: string
  customerName: string
  customerAddress: string
  riderName: string | null
  productDescription: string
  codAmount: number
  deliveryFee: number
  createdAt: string
}

export interface Seller {
  id: string
  name: string
  businessName: string
  phone: string
  area: string
  totalOrders: number
}

export interface Rider {
  id: string
  name: string
  phone: string
  vehicleType: 'bike' | 'bicycle' | 'van'
  status: 'available' | 'on_delivery' | 'offline'
  currentZone: string
  completedToday: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  address: string
  area: string
}

export type StatusSemantic = 'pending' | 'info' | 'success' | 'danger' | 'warning'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'New',
  CONFIRMED: 'Confirmed',
  ASSIGNED: 'Assigned',
  PICKED_UP: 'Picked up',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
  RETURNED: 'Returned',
}

export const ORDER_STATUS_SEMANTIC: Record<OrderStatus, StatusSemantic> = {
  NEW: 'pending',
  CONFIRMED: 'pending',
  ASSIGNED: 'info',
  PICKED_UP: 'info',
  OUT_FOR_DELIVERY: 'info',
  DELIVERED: 'success',
  FAILED: 'danger',
  RETURNED: 'warning',
}
