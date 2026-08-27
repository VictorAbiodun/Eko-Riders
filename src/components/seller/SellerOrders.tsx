import { useState } from 'react'
import { ChevronRight, Package, MapPin } from 'lucide-react'
import type { Seller } from '../../data/types'
import { useAppData } from '../../context/AppContext'
import { StatusBadge } from '../ui/StatusBadge'
import { EmptyState } from '../ui/EmptyState'
import { formatNaira } from '../../data/mockData'

interface SellerOrdersProps {
  seller: Seller
  onSelectOrder: (orderId: string) => void
}

type FilterTab = 'ALL' | 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'RETURNED'

export function SellerOrders({ seller, onSelectOrder }: SellerOrdersProps) {
  const { orders } = useAppData()
  const [filter, setFilter] = useState<FilterTab>('ALL')

  const sellerOrders = orders
    .filter((o) => o.sellerName === seller.name)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filteredOrders = sellerOrders.filter((order) => {
    if (filter === 'ALL') return true
    if (filter === 'PENDING') return ['NEW', 'CONFIRMED', 'ASSIGNED'].includes(order.status)
    if (filter === 'IN_TRANSIT') return ['PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.status)
    return order.status === filter
  })

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'IN_TRANSIT', label: 'In Transit' },
    { id: 'DELIVERED', label: 'Delivered' },
    { id: 'FAILED', label: 'Failed' },
    { id: 'RETURNED', label: 'Returned' },
  ]

  return (
    <div className="flex h-full flex-col bg-neutral-50 md:p-8 md:max-w-6xl md:mx-auto w-full">
      <div className="md:hidden px-5 py-4 bg-white border-b border-neutral-200">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          Orders
        </h1>
      </div>

      {/* ── Filter Chips ── */}
      <div className="bg-white border-b border-neutral-200 px-5 py-3 md:rounded-t-xl md:border-x md:border-t">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
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

      {/* ── Order List ── */}
      <div className="flex-1 overflow-y-auto bg-white md:rounded-b-xl md:border-x md:border-b md:border-neutral-200">
        {filteredOrders.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={Package}
              title="No orders found"
              description="You don't have any orders matching this filter."
            />
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {filteredOrders.map((order) => {
              const dropoffMatch = order.customerAddress.match(/([^,]+),\s*Lagos$/i)
              const dropoffArea = dropoffMatch ? dropoffMatch[1].trim() : 'Lagos'
              const pickupArea = seller.area

              return (
                <li key={order.id}>
                  <button
                    type="button"
                    onClick={() => onSelectOrder(order.id)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-data text-sm font-bold text-ink">
                          {order.id}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                        <span className="truncate">
                          {pickupArea} <span className="text-neutral-400">→</span> {dropoffArea}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        {order.codAmount > 0 ? (
                          <span className="inline-flex items-center rounded bg-status-warning-bg px-1.5 py-0.5 text-xs font-semibold text-status-warning">
                            COD {formatNaira(order.codAmount)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded bg-brand-50 px-1.5 py-0.5 text-xs font-semibold text-brand-700">
                            Prepaid
                          </span>
                        )}
                        <span className="text-xs text-neutral-400 truncate">
                          &bull; {order.customerName}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
