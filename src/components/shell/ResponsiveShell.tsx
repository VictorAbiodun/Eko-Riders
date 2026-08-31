import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { TabBar, type TabItem } from './TabBar'
import { Package } from 'lucide-react'

interface ResponsiveShellProps {
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
  /** Which tab gets the elevated center FAB treatment on mobile */
  centerTabId?: string
  children: ReactNode
  
  // Sidebar specific
  sidebarHeader?: ReactNode
  sidebarFooter?: ReactNode
}

const TAB_BAR_HEIGHT = 56

export function ResponsiveShell({
  title,
  showBack,
  onBack,
  rightAction,
  tabs,
  activeTab,
  onTabChange,
  centerTabId,
  children,
  sidebarHeader,
  sidebarFooter,
}: ResponsiveShellProps) {
  return (
    <div className="flex h-dvh w-full bg-neutral-50">
      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <aside className="hidden w-64 flex-col border-r border-neutral-200 bg-white md:flex fixed inset-y-0 left-0 z-20">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-black tracking-tight text-ink">
              ShipFast
            </span>
          </div>
        </div>
        
        {sidebarHeader && <div className="px-6 py-4">{sidebarHeader}</div>}

        <nav className="flex-1 space-y-1 px-3 py-4">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-ink'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? 'text-brand-700' : 'text-neutral-400'
                  }`}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {sidebarFooter && (
          <div className="border-t border-neutral-200 p-4">
            {sidebarFooter}
          </div>
        )}
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Mobile Header (hidden on desktop generally, but we can keep it or hide it. Let's hide it on md since sidebar has branding, unless we want the title. Actually, a desktop header is nice for the page title.) */}
        <div className="md:hidden">
          <AppHeader
            title={title}
            showBack={showBack}
            onBack={onBack}
            rightAction={rightAction}
          />
        </div>

        {/* Desktop Header just for title/actions */}
        <div className="hidden h-16 items-center justify-between border-b border-neutral-200 bg-white px-8 md:flex">
          <div className="flex items-center gap-4">
            {showBack && onBack && (
              <button
                onClick={onBack}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                &larr;
              </button>
            )}
            <h1 className="font-heading text-lg font-bold text-ink">{title}</h1>
          </div>
          {rightAction && (
            <button
              onClick={rightAction.onClick}
              className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-medium text-ink hover:bg-neutral-200"
            >
              <rightAction.icon className="h-4 w-4" />
              {rightAction.label}
            </button>
          )}
        </div>

        <main
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{
            paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + var(--mobile-pb, ${TAB_BAR_HEIGHT}px))`,
          }}
        >
          {/* We'll use a media query trick or just generic class for padding.
              Actually, React style doesn't easily conditionally apply based on screen size, 
              so we'll wrap the padding logic in a class or just rely on a wrapper div. */}
          <div className="md:pb-6">{children}</div>
        </main>

        {/* Mobile Tab Bar */}
        <div className="md:hidden">
          <TabBar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} centerTabId={centerTabId} />
        </div>
      </div>
      
      {/* Dynamic style for mobile padding */}
      <style>{`
        @media (min-width: 768px) {
          main { --mobile-pb: 0px !important; }
        }
      `}</style>
    </div>
  )
}
