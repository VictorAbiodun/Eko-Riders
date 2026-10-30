import type { OrderStatus } from '../../data/types'

const TRACKING_STEPS = [
  { label: 'Received', description: 'Pickup has confirmed your order' },
  { label: 'Picked Up', description: 'Rider has your package' },
  { label: 'In Transit', description: 'Your package is on its way to you' },
  { label: 'Delivered', description: 'Package delivered successfully' },
]

/** Maps each order status to the completed-step count (0–4). */
export const STATUS_TO_STEP: Record<OrderStatus, number> = {
  NEW: 0,
  CONFIRMED: 0,
  ASSIGNED: 1,
  PICKED_UP: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
  FAILED: -1,
  RETURNED: -1,
}

type StepperVariant = 'default' | 'compact' | 'onBrand'

interface TrackingStepperProps {
  status: OrderStatus
  createdAt?: string
  variant?: StepperVariant
  showTitle?: boolean
  showDescription?: boolean
}

/**
 * Canonical order-progress stepper — used on Tracking, Rider, Seller, and Admin.
 */
export function TrackingStepper({
  status,
  variant = 'default',
  showTitle,
  showDescription,
}: TrackingStepperProps) {
  const progress = STATUS_TO_STEP[status]
  const isOnBrand = variant === 'onBrand'
  const isCompact = variant === 'compact' || isOnBrand
  const titleVisible = showTitle ?? variant === 'default'
  const descVisible = showDescription ?? variant === 'default'

  const completedLine = isOnBrand ? 'bg-white' : 'bg-brand'
  const dashedLine = isOnBrand
    ? 'repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 4px, transparent 4px, transparent 8px)'
    : 'repeating-linear-gradient(90deg, #D9D4C8 0px, #D9D4C8 4px, transparent 4px, transparent 8px)'
  const upcomingDot = isOnBrand
    ? 'border-2 border-white/40 bg-transparent'
    : 'border-2 border-neutral-300 bg-white'
  const filledDot = isOnBrand ? 'bg-white' : 'bg-brand'
  const innerDot = isOnBrand ? 'bg-brand' : 'bg-white'
  const labelActive = isOnBrand ? 'font-bold text-white' : 'font-bold text-ink'
  const labelMuted = isOnBrand
    ? 'font-medium text-white/50'
    : 'font-medium text-neutral-400'

  return (
    <div
      className={
        variant === 'default' ? 'px-5 py-6' : isOnBrand ? 'px-1' : 'px-1 pt-3'
      }
    >
      {titleVisible && (
        <h2 className="mb-5 font-heading text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Delivery progress
        </h2>
      )}

      <div className="flex items-start justify-between">
        {TRACKING_STEPS.map((step, i) => {
          const stepIndex = i + 1
          const isCompleted = progress >= stepIndex
          const isCurrent = progress === i && progress > 0
          const isFirst = i === 0 && progress >= 0
          const isLast = i === TRACKING_STEPS.length - 1
          const filled = isCompleted || (isFirst && progress >= 0) || isCurrent
          const lineAfterFilled = isCompleted && progress > stepIndex

          return (
            <div
              key={step.label}
              className="flex flex-1 flex-col items-center"
              style={
                variant === 'default'
                  ? {
                      animation: 'fade-in-up 0.35s ease-out both',
                      animationDelay: `${i * 80}ms`,
                    }
                  : undefined
              }
            >
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div
                    className={`h-0.5 flex-1 ${isCompleted ? completedLine : ''}`}
                    style={
                      !isCompleted
                        ? {
                            backgroundImage: dashedLine,
                            backgroundSize: '8px 2px',
                            backgroundRepeat: 'repeat-x',
                            backgroundPosition: 'center',
                          }
                        : undefined
                    }
                  />
                )}
                <div
                  className={`relative flex shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isCompact ? 'h-3.5 w-3.5' : 'h-5 w-5'
                  } ${filled ? filledDot : upcomingDot}`}
                  style={
                    isCurrent
                      ? { animation: 'dot-pulse 2s ease-in-out infinite' }
                      : undefined
                  }
                >
                  {filled && (
                    <span
                      className={`rounded-full ${isCompact ? 'h-1.5 w-1.5' : 'h-2 w-2'} ${innerDot}`}
                    />
                  )}
                  {!filled && (
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`h-0.5 flex-1 ${lineAfterFilled ? completedLine : ''}`}
                    style={
                      !lineAfterFilled
                        ? {
                            backgroundImage: dashedLine,
                            backgroundSize: '8px 2px',
                            backgroundRepeat: 'repeat-x',
                            backgroundPosition: 'center',
                          }
                        : undefined
                    }
                  />
                )}
              </div>
              <span
                className={`mt-1.5 w-full px-0.5 text-center text-xs leading-tight ${
                  filled ? labelActive : labelMuted
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {descVisible && progress >= 0 && progress < TRACKING_STEPS.length && (
        <p className="mt-4 text-center text-sm font-medium text-accent-700">
          {
            TRACKING_STEPS[Math.min(progress, TRACKING_STEPS.length - 1)]
              ?.description
          }
        </p>
      )}
    </div>
  )
}
