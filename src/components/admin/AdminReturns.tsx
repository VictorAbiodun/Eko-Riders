import { useState } from 'react'
import { RotateCcw, ArrowLeft, Package, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { EmptyState } from '../ui/EmptyState'
import { DanfoLoader } from '../ui/DanfoLoader'

type ReturnStatus = 'pending' | 'processing' | 'completed'

interface ReturnItem {
  id: string
  orderId: string
  sellerName: string
  reason: string
  status: ReturnStatus
  resolution: string
}

// Generate return items from orders that have RETURNED or FAILED status
function generateReturns(orders: { id: string; sellerName: string; status: string; productDescription: string }[]): ReturnItem[] {
  return orders
    .filter((o) => o.status === 'RETURNED' || o.status === 'FAILED')
    .map((o, i) => ({
      id: `RTN-${String(i + 1).padStart(4, '0')}`,
      orderId: o.id,
      sellerName: o.sellerName,
      reason: o.status === 'FAILED' ? 'Delivery failed — customer unavailable' : `Wrong item: ${o.productDescription}`,
      status: o.status === 'RETURNED' ? 'completed' as ReturnStatus : 'pending' as ReturnStatus,
      resolution: o.status === 'RETURNED' ? 'Returned to seller' : 'Awaiting pickup',
    }))
}

function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  const styles: Record<ReturnStatus, string> = {
    pending: 'bg-status-warning text-white',
    processing: 'bg-status-info text-white',
    completed: 'bg-status-success text-white',
  }
  const labels: Record<ReturnStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export function AdminReturns() {
  const { orders } = useAppData()
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null)

  const returns = generateReturns(orders)

  const selected = selectedReturn ? returns.find((r) => r.id === selectedReturn) : null

  if (selected) {
    const order = orders.find((o) => o.id === selected.orderId)

    return (
      <div className="p-5 md:p-8">
        <button
          type="button"
          onClick={() => setSelectedReturn(null)}
          className="mb-6 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          ← Back to returns
        </button>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm max-w-2xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Return ID</p>
              <p className="mt-0.5 font-data text-xl font-bold text-ink">{selected.id}</p>
            </div>
            <ReturnStatusBadge status={selected.status} />
          </div>

          <div className="space-y-4 text-sm border-t border-neutral-100 pt-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-500">Order ID</p>
                <p className="font-data font-bold text-ink">{selected.orderId}</p>
              </div>
              <div>
                <p className="text-neutral-500">Seller</p>
                <p className="font-semibold text-ink">{selected.sellerName}</p>
              </div>
            </div>
            <div>
              <p className="text-neutral-500">Reason</p>
              <p className="font-medium text-ink">{selected.reason}</p>
            </div>
            <div>
              <p className="text-neutral-500">Resolution</p>
              <p className="font-medium text-ink">{selected.resolution}</p>
            </div>
            {order && (
              <div>
                <p className="text-neutral-500">Product</p>
                <p className="font-medium text-ink">{order.productDescription}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (returns.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-neutral-200 bg-white px-5 py-5 md:px-8">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">Returns</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          {/* Use the shared okada bike illustration for empty state */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
              <RotateCcw className="h-10 w-10 text-neutral-300" strokeWidth={1.5} />
            </div>
            <h2 className="font-heading text-lg font-bold text-ink">No returns yet</h2>
            <p className="mt-1 text-sm text-neutral-500 max-w-[260px] mx-auto">
              Failed and returned orders will appear here for resolution.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-200 bg-white px-5 py-5 md:px-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">Returns</h1>
        <p className="mt-1 text-sm text-neutral-500">{returns.length} returns to process</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr className="border-b border-neutral-200 text-left">
                <th className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Return ID</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Order ID</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Seller</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Reason</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 pr-8">Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {returns.map((ret) => (
                <tr
                  key={ret.id}
                  onClick={() => setSelectedReturn(ret.id)}
                  className="cursor-pointer transition-colors hover:bg-neutral-50"
                >
                  <td className="px-8 py-3.5 font-data font-bold text-ink">{ret.id}</td>
                  <td className="px-4 py-3.5 font-data text-neutral-700">{ret.orderId}</td>
                  <td className="px-4 py-3.5 text-neutral-700">{ret.sellerName}</td>
                  <td className="px-4 py-3.5 text-neutral-600 max-w-[200px] truncate">{ret.reason}</td>
                  <td className="px-4 py-3.5"><ReturnStatusBadge status={ret.status} /></td>
                  <td className="px-4 py-3.5 text-neutral-600 pr-8">{ret.resolution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-neutral-100 bg-white">
          {returns.map((ret) => (
            <button
              key={ret.id}
              type="button"
              onClick={() => setSelectedReturn(ret.id)}
              className="flex w-full flex-col gap-2 px-5 py-4 text-left active:bg-neutral-50"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-data text-sm font-bold text-ink">{ret.id}</span>
                <ReturnStatusBadge status={ret.status} />
              </div>
              <p className="text-xs text-neutral-600 line-clamp-1">{ret.reason}</p>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{ret.orderId}</span>
                <span>·</span>
                <span>{ret.sellerName}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
