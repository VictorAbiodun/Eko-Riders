import { ChevronLeft } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface AppHeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: {
    icon: LucideIcon
    label: string
    onClick: () => void
  }
}

export function AppHeader({
  title,
  showBack,
  onBack,
  rightAction,
}: AppHeaderProps) {
  const RightIcon = rightAction?.icon

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white shadow-header">
      <div
        className="flex h-14 items-center gap-2 px-2"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="flex w-11 shrink-0 justify-start">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex min-h-touch min-w-touch items-center justify-center rounded-lg text-neutral-700 transition-colors active:bg-neutral-100"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
          )}
        </div>

        <h1 className="flex-1 truncate text-center font-heading text-base font-semibold text-neutral-900">
          {title}
        </h1>

        <div className="flex w-11 shrink-0 justify-end">
          {rightAction && RightIcon && (
            <button
              type="button"
              onClick={rightAction.onClick}
              className="flex min-h-touch min-w-touch items-center justify-center rounded-lg text-neutral-700 transition-colors active:bg-neutral-100"
              aria-label={rightAction.label}
            >
              <RightIcon className="h-5 w-5" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export type { AppHeaderProps }
