import { formatNaira } from '../../data/mockData'
import type { Seller } from '../../data/types'
import { useAppData } from '../../context/AppContext'
import { PlusCircle, TrendingUp } from 'lucide-react'
import { EmptyState } from '../ui/EmptyState'
import { OrderListRow } from '../orders/OrderListRow'

interface SellerHomeProps {
  seller: Seller
  onNavigateToCreate: () => void
  onSelectOrder: (orderId: string) => void
}

export function SellerHome({
  seller,
  onNavigateToCreate,
  onSelectOrder,
}: SellerHomeProps) {
  const { orders } = useAppData()
  
  const sellerOrders = orders.filter((o) => o.sellerName === seller.businessName)
  const sortedOrders = [...sellerOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const recentOrders = sortedOrders.slice(0, 5)

  const active = sellerOrders.filter((o) =>
    ['NEW', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
  ).length
  const delivered = sellerOrders.filter((o) => o.status === 'DELIVERED').length
  const returns = sellerOrders.filter((o) => o.status === 'RETURNED').length
  const total = sellerOrders.length

  // Mock pending COD
  const pendingCodOrders = sellerOrders.filter(
    (o) => o.codAmount > 0 && o.status !== 'DELIVERED' && o.status !== 'FAILED' && o.status !== 'RETURNED',
  )
  const pendingCod = pendingCodOrders.reduce((sum, o) => sum + o.codAmount, 0)

  // Delivery usage mock
  const limit = 100
  const used = Math.min(total, limit)
  const progressPercent = (used / limit) * 100

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 md:max-w-6xl md:mx-auto w-full">
      {/* ── Mobile Header ── */}
      <div className="md:hidden">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          {seller.businessName}
        </h1>
        <div className="mt-2 inline-block rounded bg-status-success-bg px-2 py-1 text-xs font-bold uppercase tracking-wider text-status-success">
          Growth Plan
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column (Desktop) / Top Section (Mobile) */}
        <div className="flex flex-col gap-6 md:col-span-2">
          
          {/* ── Delivery Usage ── */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink">Plan Usage</h2>
              <span className="text-sm font-medium text-neutral-500">
                {used} / {limit} Deliveries
              </span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              Resets in 12 days
            </p>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Orders
              </p>
              <p className="mt-1 font-data text-2xl font-bold text-ink">
                {total}
              </p>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand-50 p-3 text-center shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
                Active
              </p>
              <p className="mt-1 font-data text-2xl font-bold text-brand-700">
                {active}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-status-success">
                Delivered
              </p>
              <p className="mt-1 font-data text-2xl font-bold text-ink">
                {delivered}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-status-danger">
                Returns
              </p>
              <p className="mt-1 font-data text-2xl font-bold text-ink">
                {returns}
              </p>
            </div>
          </div>

          {/* ── Recent Orders ── */}
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="text-sm font-bold text-ink">Recent Orders</h2>
            </div>
            {recentOrders.length === 0 ? (
              <EmptyState
                title="No orders yet"
                description="Create your first delivery to see it here."
                actionLabel="Create order"
                onAction={onNavigateToCreate}
              />
            ) : (
              <ul className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
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

        {/* Right Column (Desktop) / Bottom Section (Mobile) */}
        <div className="flex flex-col gap-6">
          {/* ── COD Summary ── */}
          <div className="rounded-xl bg-ink p-6 text-white shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-neutral-400" />
              <p className="text-sm font-medium text-neutral-300">
                Awaiting Settlement
              </p>
            </div>
            <p className="mt-3 font-data text-3xl font-bold tracking-tight">
              {formatNaira(pendingCod)}
            </p>
            <p className="mt-2 text-xs text-neutral-400">
              COD collected from active deliveries.
            </p>
          </div>

          {/* ── Create Order CTA ── */}
          <button
            type="button"
            onClick={onNavigateToCreate}
            className="flex min-h-touch w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-4 text-base font-bold text-white shadow-sm hover:bg-brand-600 transition-colors active:scale-[0.98]"
          >
            <PlusCircle className="h-5 w-5" />
            Create New Order
          </button>
        </div>
      </div>
    </div>
  )
}
