import { useState } from 'react'
import type { Seller } from '../../data/types'
import { useAppData } from '../../context/AppContext'
import { EmptyState } from '../ui/EmptyState'
import { OrderListRow } from '../orders/OrderListRow'

interface SellerOrdersProps {
  seller: Seller
  onSelectOrder: (orderId: string) => void
}

type FilterTab = 'ALL' | 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'RETURNED'

export function SellerOrders({ seller, onSelectOrder }: SellerOrdersProps) {
  const { orders } = useAppData()
  const [filter, setFilter] = useState<FilterTab>('ALL')

  const sellerOrders = orders
    .filter((o) => o.sellerName === seller.businessName)
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
    <div className="flex h-full w-full flex-col bg-neutral-50 md:mx-auto md:max-w-6xl md:p-8">
      <div className="border-b border-neutral-200 bg-white px-4 py-4 md:hidden">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">Orders</h1>
      </div>

      <div className="border-b border-neutral-200 bg-white px-4 py-3 md:rounded-t-xl md:border-x md:border-t">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`min-h-touch whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${
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

      <div className="flex-1 overflow-y-auto bg-white md:rounded-b-xl md:border-x md:border-b md:border-neutral-200">
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="You don't have any orders matching this filter."
          />
        ) : (
          <ul className="divide-y divide-neutral-100">
            {filteredOrders.map((order) => (
              <OrderListRow
                key={order.id}
                order={order}
                pickupLabel={seller.area}
                onClick={() => onSelectOrder(order.id)}
                meta={order.customerName}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
