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
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-neutral-200 bg-white"
      aria-label="Main navigation"
    >
      <div
        className="mx-auto flex max-w-[480px] items-stretch justify-around px-1"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors ${
                isActive ? 'text-ink' : 'text-neutral-400'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active pill behind icon */}
              <span
                className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                  isActive ? 'bg-brand-100' : ''
                }`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
              </span>
              <span
                className={`text-xs ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {/* Active underline bar — wide & visible */}
              {isActive && (
                <span className="absolute top-0 h-[3px] w-12 rounded-b-full bg-brand" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

