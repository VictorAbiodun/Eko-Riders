import type { OrderStatus } from '../../data/types'

const FLOW_STATUSES: OrderStatus[] = [
  'NEW',
  'CONFIRMED',
  'ASSIGNED',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

const SHORT_LABELS: Record<OrderStatus, string> = {
  NEW: 'New',
  CONFIRMED: 'Confirmed',
  ASSIGNED: 'Assigned',
  PICKED_UP: 'Picked up',
  OUT_FOR_DELIVERY: 'En route',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
  RETURNED: 'Returned',
}

interface OrderStatusStepperProps {
  currentStatus: OrderStatus
}

export function OrderStatusStepper({ currentStatus }: OrderStatusStepperProps) {
  const flowIndex = FLOW_STATUSES.indexOf(currentStatus)
  const activeIndex = flowIndex >= 0 ? flowIndex : 0
  const displayLabel = SHORT_LABELS[currentStatus]

  return (
    <div className="w-full">
      <p className="mb-3 text-sm font-medium text-neutral-600">
        Status:{' '}
        <span className="font-semibold text-ink">{displayLabel}</span>
      </p>

      <div
        className="-mx-1 flex gap-0 overflow-x-auto overscroll-x-contain px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Order progress"
      >
        {FLOW_STATUSES.map((status, index) => {
          const isComplete = index < activeIndex
          const isCurrent = index === activeIndex
          const isUpcoming = index > activeIndex

          return (
            <div
              key={status}
              role="listitem"
              className="flex min-w-[58px] shrink-0 flex-col items-center"
            >
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isComplete || isCurrent ? 'bg-brand-500' : 'bg-neutral-300'
                    }`}
                  />
                )}
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    isCurrent
                      ? 'border-ink bg-brand-400'
                      : isComplete
                        ? 'border-brand-600 bg-brand-500'
                        : 'border-neutral-300 bg-white'
                  }`}
                >
                  {isComplete && (
                    <span className="block h-2 w-2 rounded-full bg-ink" />
                  )}
                  {isCurrent && (
                    <span className="block h-2.5 w-2.5 rounded-full bg-ink" />
                  )}
                  {isUpcoming && (
                    <span className="block h-1.5 w-1.5 rounded-full bg-neutral-300" />
                  )}
                </div>
                {index < FLOW_STATUSES.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isComplete ? 'bg-brand-500' : 'bg-neutral-300'
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-1.5 w-full truncate px-0.5 text-center text-sm leading-tight ${
                  isCurrent ? 'font-semibold text-ink' : 'font-medium text-neutral-500'
                }`}
              >
                {SHORT_LABELS[status]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
