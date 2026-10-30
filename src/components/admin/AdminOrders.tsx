import { useState } from 'react'
import { ArrowLeft, Package, MapPin } from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { formatNaira } from '../../data/mockData'
import type { Order } from '../../data/types'
import { StatusBadge } from '../ui/StatusBadge'
import { EmptyState } from '../ui/EmptyState'
import { SellerOrderDetail } from '../seller/SellerOrderDetail'

interface AdminOrdersProps {
  selectedOrderId: string | null
  onSelectOrder: (id: string) => void
  onBack: () => void
}

type FilterTab =
  'ALL' | 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'RETURNED'

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'IN_TRANSIT', label: 'In Transit' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'FAILED', label: 'Failed' },
  { id: 'RETURNED', label: 'Returned' },
]

function timeAgo(dateStr: string) {
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now.getTime() - then.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDays = Math.floor(diffHr / 24)
  return `${diffDays}d ago`
}

function filterOrders(orders: Order[], filter: FilterTab): Order[] {
  if (filter === 'ALL') return orders
  if (filter === 'PENDING')
    return orders.filter((o) =>
      ['NEW', 'CONFIRMED', 'ASSIGNED'].includes(o.status),
    )
  if (filter === 'IN_TRANSIT')
    return orders.filter((o) =>
      ['PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
    )
  return orders.filter((o) => o.status === filter)
}

export function AdminOrders({
  selectedOrderId,
  onSelectOrder,
  onBack,
}: AdminOrdersProps) {
  const { orders } = useAppData()
  const [filter, setFilter] = useState<FilterTab>('ALL')

  // If an order is selected, show the shared detail view
  if (selectedOrderId) {
    return (
      <div className="flex flex-col h-full">
        {/* Back header */}
        <div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3 md:px-8">
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="font-heading text-sm font-semibold text-ink">
            Order {selectedOrderId}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SellerOrderDetail orderId={selectedOrderId} canDispatch />
        </div>
      </div>
    )
  }

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const filteredOrders = filterOrders(sortedOrders, filter)

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="border-b border-neutral-200 bg-white px-5 py-5 md:px-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          All Orders
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {orders.length} total orders across all sellers
        </p>
      </div>

      {/* Filter chips */}
      <div className="border-b border-neutral-200 bg-white px-5 py-3 md:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === tab.id
                  ? 'bg-ink text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="py-16">
            <EmptyState
              icon={Package}
              title="No orders found"
              description="No orders match this filter."
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-neutral-50">
                  <tr className="border-b border-neutral-200 text-left">
                    <th className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Seller
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Rider
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right">
                      COD
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right pr-8">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {filteredOrders.map((order) => {
                    const dropoffMatch =
                      order.customerAddress.match(/([^,]+),\s*Lagos$/i)
                    const dropoffArea = dropoffMatch
                      ? dropoffMatch[1].trim()
                      : 'Lagos'

                    return (
                      <tr
                        key={order.id}
                        onClick={() => onSelectOrder(order.id)}
                        className="cursor-pointer transition-colors hover:bg-neutral-50 active:bg-neutral-100"
                      >
                        <td className="px-8 py-3.5 font-data font-bold text-ink">
                          {order.id}
                        </td>
                        <td className="px-4 py-3.5 text-neutral-700">
                          {order.sellerName}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="text-neutral-700">
                            {order.customerName}
                          </div>
                          <div className="text-xs text-neutral-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {dropoffArea}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-neutral-700">
                          {order.riderName ?? (
                            <span className="italic text-neutral-400">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right font-data tabular-nums text-neutral-700">
                          {order.codAmount > 0
                            ? formatNaira(order.codAmount)
                            : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-right text-neutral-500 pr-8">
                          {timeAgo(order.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-neutral-100 bg-white">
              {filteredOrders.map((order) => {
                const dropoffMatch =
                  order.customerAddress.match(/([^,]+),\s*Lagos$/i)
                const dropoffArea = dropoffMatch
                  ? dropoffMatch[1].trim()
                  : 'Lagos'

                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => onSelectOrder(order.id)}
                    className="flex w-full flex-col gap-2 px-5 py-4 text-left transition-colors active:bg-neutral-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-data text-sm font-bold text-ink">
                        {order.id}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                      <MapPin className="h-3 w-3 shrink-0 text-neutral-400" />
                      <span className="truncate">
                        {order.customerName} → {dropoffArea}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>
                        {order.sellerName}
                        {order.riderName && ` · ${order.riderName}`}
                      </span>
                      <span>
                        {order.codAmount > 0 && (
                          <span className="font-data font-semibold text-ink mr-2">
                            {formatNaira(order.codAmount)}
                          </span>
                        )}
                        {timeAgo(order.createdAt)}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
