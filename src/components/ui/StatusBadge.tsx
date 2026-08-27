import type { OrderStatus } from '../../data/types'
import { ORDER_STATUS_LABELS, ORDER_STATUS_SEMANTIC } from '../../data/types'

export const STATUS_BADGE_CLASSES: Record<
  'pending' | 'info' | 'success' | 'danger' | 'warning',
  string
> = {
  pending: 'text-status-pending bg-status-pending-bg border-status-pending-border',
  info: 'text-status-info bg-status-info-bg border-status-info-border',
  success: 'text-status-success bg-status-success-bg border-status-success-border',
  danger: 'text-status-danger bg-status-danger-bg border-status-danger-border',
  warning: 'text-status-warning bg-status-warning-bg border-status-warning-border',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const semantic = ORDER_STATUS_SEMANTIC[status]
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-semibold leading-none ${STATUS_BADGE_CLASSES[semantic]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}
