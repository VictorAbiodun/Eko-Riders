import type { OrderStatus } from '../../data/types'
import { ORDER_STATUS_LABELS } from '../../data/types'

/**
 * Pixel-identical status pills everywhere.
 * Each order status maps to one token — never ad-hoc blues/grays.
 */
export const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  NEW: 'bg-status-pending text-white',
  CONFIRMED: 'bg-status-pending text-white',
  ASSIGNED: 'bg-accent text-white',
  PICKED_UP: 'bg-accent-700 text-white',
  OUT_FOR_DELIVERY: 'bg-brand text-ink',
  DELIVERED: 'bg-status-success text-white',
  FAILED: 'bg-status-danger text-white',
  RETURNED: 'bg-status-warning text-white',
}

const BADGE_SHAPE =
  'inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold leading-none'

interface StatusBadgeProps {
  status: OrderStatus
  /** Inverse pill for mustard hero cards */
  inverse?: boolean
}

export function StatusBadge({ status, inverse }: StatusBadgeProps) {
  return (
    <span
      className={`${BADGE_SHAPE} ${
        inverse ? 'bg-white/20 text-white' : STATUS_BADGE_CLASSES[status]
      }`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}
