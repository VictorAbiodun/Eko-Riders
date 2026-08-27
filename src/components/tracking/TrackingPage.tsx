import { AlertTriangle, RotateCcw, Package } from 'lucide-react'
import { mockOrders, mockRiders } from '../../data/mockData'
import type { OrderStatus } from '../../data/types'
import { StatusBadge } from '../ui/StatusBadge'
import { TrackingStepper } from './TrackingStepper'
import { RiderCard } from './RiderCard'
import { OrderSummaryCard } from './OrderSummaryCard'

/* ─── Demo order links ─── */

const DEMO_ORDERS = [
  { id: 'ORD-000006', tag: 'New' },
  { id: 'ORD-000004', tag: 'Assigned' },
  { id: 'ORD-000003', tag: 'Picked up' },
  { id: 'ORD-000002', tag: 'En route' },
  { id: 'ORD-000001', tag: 'Delivered' },
  { id: 'ORD-000007', tag: 'Failed' },
  { id: 'ORD-000008', tag: 'Returned' },
]

/* ─── Helpers ─── */

const TERMINAL_STATUSES: OrderStatus[] = ['FAILED', 'RETURNED']

/** Show rider card for these statuses */
const RIDER_VISIBLE_STATUSES: OrderStatus[] = [
  'ASSIGNED',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
]

function getEstimatedArrival(
  createdAt: string,
): { start: string; end: string } {
  const base = new Date(createdAt)
  // Out-for-delivery happens at +71 min (matches stepper offsets)
  const outTime = base.getTime() + 71 * 60_000
  const start = new Date(outTime + 25 * 60_000)
  const end = new Date(outTime + 50 * 60_000)

  const fmt = (d: Date) =>
    d.toLocaleTimeString('en-NG', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

  return { start: fmt(start), end: fmt(end) }
}

/* ─── Sub-components ─── */

function TrackingHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white px-5 py-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand">
          <Package className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-heading text-base font-bold tracking-tight text-ink">
          ShipFast
        </span>
      </div>
    </header>
  )
}

function FailedStatusCard({ status }: { status: OrderStatus }) {
  const isFailed = status === 'FAILED'

  return (
    <div
      className={`mx-5 mt-5 rounded-xl border p-5 ${
        isFailed
          ? 'border-status-danger-border bg-status-danger-bg'
          : 'border-status-warning-border bg-status-warning-bg'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isFailed ? 'bg-red-100' : 'bg-amber-100'
          }`}
        >
          {isFailed ? (
            <AlertTriangle
              className="h-5 w-5 text-status-danger"
              strokeWidth={2}
            />
          ) : (
            <RotateCcw
              className="h-5 w-5 text-status-warning"
              strokeWidth={2}
            />
          )}
        </div>
        <div>
          <h3
            className={`font-heading text-base font-bold ${
              isFailed ? 'text-status-danger' : 'text-status-warning'
            }`}
          >
            {isFailed ? 'Delivery failed' : 'Package returned'}
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            {isFailed
              ? 'We were unable to complete this delivery. The package is being returned to the seller. Please contact support if you have questions.'
              : 'This package has been returned to the seller. If this was unexpected, please reach out to the seller or our support team.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function OrderNotFound({ orderId }: { orderId: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
        <Package className="h-7 w-7 text-neutral-400" strokeWidth={1.75} />
      </div>
      <h2 className="font-heading text-lg font-bold text-ink">
        Order not found
      </h2>
      <p className="mt-1 max-w-[260px] text-sm text-neutral-500">
        We couldn't find an order with ID{' '}
        <span className="font-data font-semibold text-ink">{orderId}</span>.
        Please check the link and try again.
      </p>
    </div>
  )
}

function TrackingFooter() {
  return (
    <footer className="border-t border-neutral-100 px-5 py-6 text-center">
      <p className="text-xs text-neutral-400">
        Powered by{' '}
        <span className="font-semibold text-neutral-500">ShipFast</span>
      </p>
      <p className="mt-0.5 text-xs text-neutral-400">
        Last-mile delivery for Nigerian businesses
      </p>
    </footer>
  )
}

function DemoNav({ currentId }: { currentId: string }) {
  return (
    <div className="mx-5 mt-6 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        Demo — try other orders
      </p>
      <div className="flex flex-wrap gap-1.5">
        {DEMO_ORDERS.map((o) => {
          const isActive = o.id === currentId
          return (
            <a
              key={o.id}
              href={`/track/${o.id}`}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'border-brand bg-brand-100 text-brand-800'
                  : 'border-neutral-200 bg-white text-neutral-600 active:bg-neutral-50'
              }`}
            >
              {o.tag}
            </a>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Main page ─── */

interface TrackingPageProps {
  orderId: string
}

export function TrackingPage({ orderId }: TrackingPageProps) {
  const order = mockOrders.find((o) => o.id === orderId)

  const isTerminal = order
    ? TERMINAL_STATUSES.includes(order.status)
    : false

  const rider =
    order?.riderName
      ? mockRiders.find((r) => r.name === order.riderName) ?? null
      : null

  const showRider =
    rider && order && RIDER_VISIBLE_STATUSES.includes(order.status)

  const estimatedArrival =
    order?.status === 'OUT_FOR_DELIVERY'
      ? getEstimatedArrival(order.createdAt)
      : null

  return (
    <div className="min-h-dvh bg-neutral-50 md:flex md:items-start md:justify-center md:bg-neutral-100 md:py-10">
      <div className="flex w-full flex-col md:max-w-[440px] md:overflow-hidden md:rounded-2xl md:border md:border-neutral-200 md:bg-neutral-50 md:shadow-sm">
        <TrackingHeader />

        {!order ? (
          <>
            <OrderNotFound orderId={orderId} />
            <DemoNav currentId={orderId} />
          </>
        ) : (
          <>
            {/* ── Order ID hero ── */}
            <div className="px-5 pt-6 pb-2">
              <p className="text-sm text-neutral-500">Tracking order</p>
              <div className="mt-1 flex items-center gap-3">
                <h1 className="font-data text-2xl font-bold tabular-nums tracking-tight text-ink">
                  {order.id}
                </h1>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-1.5 text-sm text-neutral-500">
                {order.customerName} · {order.sellerName}
              </p>
            </div>

            {/* ── Stepper or terminal card ── */}
            {isTerminal ? (
              <FailedStatusCard status={order.status} />
            ) : (
              <TrackingStepper
                status={order.status}
                createdAt={order.createdAt}
              />
            )}

            {/* ── Rider card ── */}
            {showRider && rider && (
              <div className="mt-2 mb-5">
                <RiderCard
                  rider={rider}
                  estimatedArrival={estimatedArrival}
                />
              </div>
            )}

            {/* ── Order summary ── */}
            <div className="mt-2 mb-6">
              <OrderSummaryCard order={order} />
            </div>

            {/* ── Demo navigation ── */}
            <DemoNav currentId={orderId} />
          </>
        )}

        <div className="mt-auto">
          <TrackingFooter />
        </div>
      </div>
    </div>
  )
}
