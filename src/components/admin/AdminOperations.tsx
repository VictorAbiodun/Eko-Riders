import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Bike,
  Banknote,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { formatNaira } from '../../data/mockData'
import { StatusBadge } from '../ui/StatusBadge'
import type { Order } from '../../data/types'

interface AdminOperationsProps {
  onNavigate: (tabId: string) => void
  onSelectOrder: (orderId: string) => void
}

/* ─── Stat Card ─── */

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  onClick,
}: {
  label: string
  value: string | number
  icon: typeof Package
  accent?: 'brand' | 'success' | 'info' | 'danger' | 'warning' | 'accent'
  onClick?: () => void
}) {
  const accentClasses: Record<
    string,
    { bg: string; icon: string; ring: string }
  > = {
    brand: { bg: 'bg-brand-50', icon: 'text-brand-600', ring: 'ring-brand/10' },
    success: {
      bg: 'bg-status-success-bg',
      icon: 'text-status-success',
      ring: 'ring-status-success/10',
    },
    info: {
      bg: 'bg-status-info-bg',
      icon: 'text-status-info',
      ring: 'ring-status-info/10',
    },
    danger: {
      bg: 'bg-status-danger-bg',
      icon: 'text-status-danger',
      ring: 'ring-status-danger/10',
    },
    warning: {
      bg: 'bg-status-warning-bg',
      icon: 'text-status-warning',
      ring: 'ring-status-warning/10',
    },
    accent: {
      bg: 'bg-accent-50',
      icon: 'text-accent-600',
      ring: 'ring-accent/10',
    },
  }
  const a = accentClasses[accent ?? 'brand']

  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm ring-1 ${a.ring} ${
        onClick
          ? 'cursor-pointer transition-colors hover:bg-neutral-50 active:bg-neutral-100 text-left'
          : ''
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${a.bg}`}
      >
        <Icon className={`h-5 w-5 ${a.icon}`} strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {label}
        </p>
        <p className="mt-0.5 font-data text-2xl font-bold tabular-nums text-ink">
          {value}
        </p>
      </div>
    </Wrapper>
  )
}

/* ─── Time formatter ─── */

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

/* ─── Orders Table ─── */

function OrdersTable({
  orders,
  onSelectOrder,
}: {
  orders: Order[]
  onSelectOrder: (id: string) => void
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Order ID
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Seller
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Customer / Route
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Rider
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => {
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
                  <td className="px-4 py-3 font-data font-bold text-ink">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {order.sellerName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-neutral-700">
                      {order.customerName}
                    </span>
                    <span className="ml-1 text-neutral-400">
                      → {dropoffArea}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {order.riderName ?? (
                      <span className="italic text-neutral-400">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-500">
                    {timeAgo(order.createdAt)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-neutral-100">
        {orders.map((order) => {
          const dropoffMatch = order.customerAddress.match(/([^,]+),\s*Lagos$/i)
          const dropoffArea = dropoffMatch ? dropoffMatch[1].trim() : 'Lagos'

          return (
            <button
              key={order.id}
              type="button"
              onClick={() => onSelectOrder(order.id)}
              className="flex w-full flex-col gap-2 px-4 py-3.5 text-left transition-colors active:bg-neutral-50"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-data text-sm font-bold text-ink">
                  {order.id}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>
                  {order.customerName} → {dropoffArea}
                </span>
                <span>{timeAgo(order.createdAt)}</span>
              </div>
              <div className="text-xs text-neutral-400">
                {order.sellerName}
                {order.riderName && <span> · {order.riderName}</span>}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ─── Main Operations Screen ─── */

export function AdminOperations({
  onNavigate,
  onSelectOrder,
}: AdminOperationsProps) {
  const { orders, riders } = useAppData()

  // Stats
  const today = new Date().toDateString()
  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  )
  const delivered = orders.filter((o) => o.status === 'DELIVERED').length
  const inTransit = orders.filter((o) =>
    ['PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
  ).length
  const failed = orders.filter((o) => o.status === 'FAILED').length
  const returned = orders.filter((o) => o.status === 'RETURNED').length
  const activeRiders = riders.filter((r) => r.status !== 'offline').length

  // COD totals
  const codCollected = orders
    .filter((o) => o.status === 'DELIVERED' && o.codAmount > 0)
    .reduce((sum, o) => sum + o.codAmount, 0)
  const codPending = orders
    .filter(
      (o) =>
        !['DELIVERED', 'FAILED', 'RETURNED'].includes(o.status) &&
        o.codAmount > 0,
    )
    .reduce((sum, o) => sum + o.codAmount, 0)

  // Recent orders for table (sorted by recency)
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10)

  return (
    <div className="p-5 md:p-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Operations Center
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Platform-wide overview · Real-time data
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Orders Today"
          value={ordersToday.length}
          icon={Package}
          accent="brand"
          onClick={() => onNavigate('orders')}
        />
        <StatCard
          label="Delivered"
          value={delivered}
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard
          label="In Transit"
          value={inTransit}
          icon={Truck}
          accent="info"
        />
        <StatCard
          label="Failed"
          value={failed}
          icon={AlertTriangle}
          accent="danger"
        />
        <StatCard
          label="Returns"
          value={returned}
          icon={RotateCcw}
          accent="warning"
          onClick={() => onNavigate('returns')}
        />
        <StatCard
          label="Riders"
          value={`${activeRiders}/${riders.length}`}
          icon={Bike}
          accent="accent"
          onClick={() => onNavigate('riders')}
        />
      </div>

      {/* ── COD Summary ── */}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-status-success-bg">
            <Banknote
              className="h-6 w-6 text-status-success"
              strokeWidth={1.75}
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              COD Collected
            </p>
            <p className="mt-0.5 font-data text-2xl font-bold tabular-nums text-ink">
              {formatNaira(codCollected)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-status-warning-bg">
            <Clock className="h-6 w-6 text-status-warning" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Pending Settlement
            </p>
            <p className="mt-0.5 font-data text-2xl font-bold tabular-nums text-ink">
              {formatNaira(codPending)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-base font-bold text-ink flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-neutral-400" />
            Recent Orders
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          <OrdersTable
            orders={recentOrders}
            onSelectOrder={(id) => {
              onSelectOrder(id)
              onNavigate('orders')
            }}
          />
        </div>
      </div>
    </div>
  )
}
