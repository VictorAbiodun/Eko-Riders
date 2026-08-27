interface SkeletonProps {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-neutral-200 ${className}`}
      aria-hidden="true"
    />
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex gap-3 border-b border-neutral-200 px-4 py-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  )
}

interface LoadingSkeletonProps {
  count?: number
}

export function LoadingSkeleton({ count = 5 }: LoadingSkeletonProps) {
  return (
    <div role="status" aria-label="Loading content">
      {Array.from({ length: count }, (_, i) => (
        <ListItemSkeleton key={i} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-4 p-4" role="status" aria-label="Loading page">
      <Skeleton className="h-8 w-2/5" />
      <Skeleton className="h-4 w-3/5" />
      <div className="space-y-3 pt-2">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
