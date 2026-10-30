import { useEffect, useState } from 'react'
import { AlertTriangle, RotateCcw, Loader2 } from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import type { Order, OrderStatus } from '../../data/types'
import { MapGraphic } from '../ui/MapGraphic'
import { TrackingStepper } from '../orders/TrackingStepper'
import { RiderCard } from './RiderCard'
import { OrderSummaryCard } from './OrderSummaryCard'
import { EmptyState } from '../ui/EmptyState'
import { navigate } from '../../lib/navigation'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

/* ─── Helpers ─── */

const TERMINAL_STATUSES: OrderStatus[] = ['FAILED', 'RETURNED']

/** Show rider card for these statuses */
const RIDER_VISIBLE_STATUSES: OrderStatus[] = [
  'ASSIGNED',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
]

function getEstimatedArrival(createdAt: string): {
  start: string
  end: string
} {
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
    <header
      className="bg-white px-5 py-4"
      style={{
        boxShadow: '0 1px 8px -2px rgba(30, 28, 26, 0.06)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/icons/icon-512.png"
            alt="Eko Riders"
            className="h-7 w-7 rounded-md object-cover"
          />
          <span className="font-heading text-base font-bold tracking-tight text-ink">
            Eko Riders
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-neutral-500 hover:text-ink transition-colors"
        >
          Home
        </button>
      </div>
    </header>
  )
}

function FailedStatusCard({ status }: { status: OrderStatus }) {
  const isFailed = status === 'FAILED'

  return (
    <div className="mx-5 mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isFailed ? 'bg-status-danger-bg' : 'bg-status-warning-bg'
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
    <div className="p-6 text-center">
      <EmptyState
        title="Order not found"
        description={`We couldn't find an order matching "${orderId}". Please check the tracking link or order number and try again.`}
      />
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-brand-600"
      >
        Track another order
      </button>
    </div>
  )
}

function TrackingFooter() {
  return (
    <footer className="border-t border-neutral-100 px-5 py-6 text-center">
      <p className="text-xs text-neutral-400">
        Powered by{' '}
        <span className="font-semibold text-neutral-500">Eko Riders</span>
      </p>
      <p className="mt-0.5 text-xs text-neutral-400">
        Fast, dependable last-mile delivery across Lagos
      </p>
    </footer>
  )
}

/* ─── Main page ─── */

interface TrackingPageProps {
  orderId: string
}

export function TrackingPage({ orderId }: TrackingPageProps) {
  const { orders, riders } = useAppData()
  const localOrder = orders.find((o) => o.id === orderId)

  const [remoteOrder, setRemoteOrder] = useState<Order | null>(null)
  const [searchingRemote, setSearchingRemote] = useState(false)

  // Direct remote fetch if not found in local cache
  useEffect(() => {
    let active = true

    async function fetchRemote() {
      if (!localOrder && supabase && isSupabaseConfigured) {
        setSearchingRemote(true)
        try {
          const { data, error } = await supabase.rpc('get_tracking_order', {
            p_query: orderId,
          })
          if (active && !error && data && (data as any[]).length > 0) {
            const row = (data as any[])[0]
            setRemoteOrder({
              id: row.order_number,
              status: row.status as OrderStatus,
              sellerName: row.seller_business_name,
              customerName: row.customer_name,
              customerAddress: row.dropoff_address,
              riderName: row.rider_name ?? null,
              productDescription: row.product_description,
              codAmount: Math.round((row.cod_amount_kobo || 0) / 100),
              deliveryFee: Math.round((row.delivery_fee_kobo || 0) / 100),
              createdAt: row.created_at,
            })
          }
        } catch (err) {
          console.warn('Could not query remote order:', err)
        } finally {
          if (active) setSearchingRemote(false)
        }
      }
    }

    fetchRemote()

    return () => {
      active = false
    }
  }, [localOrder, orderId])

  const order = localOrder ?? remoteOrder

  const isTerminal = order ? TERMINAL_STATUSES.includes(order.status) : false

  const rider = order?.riderName
    ? (riders.find((r) => r.name === order.riderName) ?? null)
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

        {searchingRemote ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="mt-3 text-xs font-semibold text-neutral-500">
              Retrieving live parcel status…
            </p>
          </div>
        ) : !order ? (
          <OrderNotFound orderId={orderId} />
        ) : (
          <>
            {/* ── Map card ── */}
            <div className="px-5 pt-5">
              <MapGraphic status={order.status} className="h-[180px]" />
            </div>

            {/* ── Order ID hero (centered) ── */}
            <div className="px-5 pt-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Order ID
              </p>
              <h1 className="mt-1 font-data text-2xl font-bold tabular-nums tracking-tight text-ink">
                {order.id}
              </h1>
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
                <RiderCard rider={rider} estimatedArrival={estimatedArrival} />
              </div>
            )}

            {/* ── Order summary ── */}
            <div className="mt-2 mb-6">
              <OrderSummaryCard order={order} />
            </div>
          </>
        )}

        <div className="mt-auto">
          <TrackingFooter />
        </div>
      </div>
    </div>
  )
}
