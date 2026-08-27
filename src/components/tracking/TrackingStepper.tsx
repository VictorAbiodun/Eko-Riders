import { Check } from 'lucide-react'
import type { OrderStatus } from '../../data/types'

/* ─── Tracking pipeline ─── */

const TRACKING_STEPS = [
  { label: 'Order received', description: 'Pickup has confirmed your order' },
  { label: 'Rider assigned', description: 'A dispatch rider is headed to pick up' },
  { label: 'Package picked up', description: 'Rider has your package' },
  { label: 'Out for delivery', description: 'Your package is on its way to you' },
  { label: 'Delivered', description: 'Package delivered successfully' },
]

/** Maps each order status to the step index it represents */
const STATUS_TO_STEP: Record<OrderStatus, number> = {
  NEW: 0,
  CONFIRMED: 0,
  ASSIGNED: 1,
  PICKED_UP: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
  FAILED: -1,
  RETURNED: -1,
}

/** Cumulative minutes after order creation for each step's completion time */
const STEP_OFFSETS_MIN = [0, 22, 48, 71, 105]

/* ─── Time formatting ─── */

function formatStepTime(date: Date): string {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const time = date.toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  if (isToday) return `Today, ${time}`
  if (isYesterday) return `Yesterday, ${time}`

  return (
    date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) +
    `, ${time}`
  )
}

/* ─── Component ─── */

interface TrackingStepperProps {
  status: OrderStatus
  createdAt: string
}

export function TrackingStepper({ status, createdAt }: TrackingStepperProps) {
  const activeIndex = STATUS_TO_STEP[status]
  const isDelivered = status === 'DELIVERED'
  const baseTime = new Date(createdAt)

  return (
    <div className="px-5 py-6">
      <h2 className="mb-5 font-heading text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Delivery progress
      </h2>

      <div>
        {TRACKING_STEPS.map((step, i) => {
          const isCompleted =
            i < activeIndex || (i === activeIndex && isDelivered)
          const isCurrent = i === activeIndex && !isDelivered
          const isLast = i === TRACKING_STEPS.length - 1

          const timestamp =
            isCompleted || isCurrent
              ? formatStepTime(
                new Date(
                  baseTime.getTime() + STEP_OFFSETS_MIN[i] * 60_000,
                ),
              )
              : null

          return (
            <div
              key={step.label}
              className="flex gap-4"
              style={{
                animation: 'fade-in-up 0.35s ease-out both',
                animationDelay: `${i * 80}ms`,
              }}
            >
              {/* ── Left: circle + connecting line ── */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300 ${isCompleted
                    ? 'border-brand bg-brand'
                    : isCurrent
                      ? 'border-brand bg-brand-50'
                      : 'border-neutral-300 bg-white'
                    }`}
                >
                  {isCompleted && (
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  )}
                  {isCurrent && (
                    <>
                      <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
                      <span
                        className="absolute inset-0 rounded-xl"
                        style={{
                          animation: 'step-pulse 2s ease-in-out infinite',
                        }}
                      />
                    </>
                  )}
                  {!isCompleted && !isCurrent && (
                    <span className="h-2 w-2 rounded-full bg-neutral-300" />
                  )}
                </div>

                {!isLast && (
                  <div
                    className={`my-1 w-0.5 transition-colors duration-300 ${isCompleted ? 'bg-brand' : 'bg-neutral-200'
                      }`}
                    style={{ minHeight: '28px' }}
                  />
                )}
              </div>

              {/* ── Right: label + timestamp ── */}
              <div className={`${isLast ? 'pb-0' : 'pb-5'} pt-0.5`}>
                <p
                  className={`text-sm font-semibold leading-tight ${isCompleted || isCurrent ? 'text-ink' : 'text-neutral-400'
                    }`}
                >
                  {step.label}
                </p>
                {timestamp && (
                  <p className="mt-0.5 text-sm text-neutral-500">{timestamp}</p>
                )}
                {isCurrent && (
                  <p className="mt-1 text-sm font-medium text-accent-700">
                    {step.description}
                  </p>
                )}
                {isCompleted && i === activeIndex && isDelivered && (
                  <p className="mt-1 text-sm font-medium text-status-success">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
