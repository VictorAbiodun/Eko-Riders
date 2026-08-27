import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { TabBar, type TabItem } from './TabBar'

interface MobileShellProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: {
    icon: import('lucide-react').LucideIcon
    label: string
    onClick: () => void
  }
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  children: ReactNode
}

const TAB_BAR_HEIGHT = 56

export function MobileShell({
  title,
  showBack,
  onBack,
  rightAction,
  tabs,
  activeTab,
  onTabChange,
  children,
}: MobileShellProps) {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-[480px] flex-col bg-neutral-50 md:max-w-none md:border-x md:border-neutral-200">
      <AppHeader
        title={title}
        showBack={showBack}
        onBack={onBack}
        rightAction={rightAction}
      />

      <main
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{
          paddingBottom: `calc(${TAB_BAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        {children}
      </main>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}

export type { MobileShellProps, TabItem }
