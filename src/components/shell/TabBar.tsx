import type { LucideIcon } from 'lucide-react'

export interface TabItem {
  id: string
  label: string
  icon: LucideIcon
}

interface TabBarProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  /** Which tab gets the elevated circular FAB treatment */
  centerTabId?: string
}

/**
 * Bottom navigation bar matching the reference UI:
 * - Icons with small labels for regular tabs
 * - One center tab elevated as a floating circular FAB with brand fill
 * - Rounded top corners, subtle shadow instead of hard border
 */
export function TabBar({ tabs, activeTab, onTabChange, centerTabId }: TabBarProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 bg-white"
      style={{
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 20px -4px rgba(30, 28, 26, 0.08)',
      }}
      aria-label="Main navigation"
    >
      <div
        className="mx-auto flex max-w-[480px] items-end justify-around px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          const isCenter = tab.id === centerTabId
          const Icon = tab.icon

          if (isCenter) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center pb-2"
                aria-current={isActive ? 'page' : undefined}
                aria-label={tab.label}
              >
                {/* Elevated FAB circle */}
                <div
                  className="shadow-fab -mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand transition-transform active:scale-95"
                >
                  <Icon
                    className="h-6 w-6 text-white"
                    strokeWidth={2.25}
                  />
                </div>
                <span className="mt-1 text-[10px] font-bold text-brand-700">
                  {tab.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="relative flex min-h-[60px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors"
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-ink' : 'text-neutral-400'
                }`}
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              <span
                className={`text-[10px] ${
                  isActive ? 'font-bold text-ink' : 'font-medium text-neutral-400'
                }`}
              >
                {tab.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-brand" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
