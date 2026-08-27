import type { OrderStatus } from '../../data/types'
import { StatusBadge } from '../ui/StatusBadge'

function Swatch({
  label,
  className,
  hex,
}: {
  label: string
  className: string
  hex?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-10 w-10 shrink-0 rounded-lg border border-neutral-200 ${className}`} />
      <div>
        <p className="text-sm font-medium text-neutral-800">{label}</p>
        {hex && <p className="font-mono text-xs text-neutral-500">{hex}</p>}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-neutral-200 px-4 py-6 last:border-b-0">
      <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h2>
      {children}
    </section>
  )
}

const BRAND_SWATCHES = [
  { label: 'Brand 500 (primary)', class: 'bg-brand', hex: '#E8BB18' },
  { label: 'Brand 100', class: 'bg-brand-100', hex: '#FFF8DC' },
  { label: 'Brand 700', class: 'bg-brand-700', hex: '#A67C0A' },
]

const ACCENT_SWATCHES = [
  { label: 'Accent 500', class: 'bg-accent', hex: '#C75C1A' },
  { label: 'Accent 100', class: 'bg-accent-100', hex: '#FCE6D8' },
  { label: 'Accent 700', class: 'bg-accent-700', hex: '#853C10' },
]

const NEUTRAL_SWATCHES = [
  { label: 'Neutral 50', class: 'bg-neutral-50', hex: '#FFFAF0' },
  { label: 'Neutral 200', class: 'bg-neutral-200', hex: '#F0EBE0' },
  { label: 'Neutral 400', class: 'bg-neutral-400', hex: '#A8A196' },
  { label: 'Neutral 600', class: 'bg-neutral-600', hex: '#5C564E' },
  { label: 'Neutral 800', class: 'bg-neutral-800', hex: '#292524' },
  { label: 'Neutral 900', class: 'bg-neutral-900', hex: '#1C1917' },
]

const STATUS_SWATCHES = [
  { label: 'Pending', text: 'text-status-pending', bg: 'bg-status-pending-bg', border: 'border-status-pending-border' },
  { label: 'In transit (info)', text: 'text-status-info', bg: 'bg-status-info-bg', border: 'border-status-info-border' },
  { label: 'Delivered (success)', text: 'text-status-success', bg: 'bg-status-success-bg', border: 'border-status-success-border' },
  { label: 'Failed (danger)', text: 'text-status-danger', bg: 'bg-status-danger-bg', border: 'border-status-danger-border' },
  { label: 'Returned (warning)', text: 'text-status-warning', bg: 'bg-status-warning-bg', border: 'border-status-warning-border' },
]

const TYPE_SAMPLES = [
  { cls: 'text-2xl font-heading font-bold', label: 'text-2xl — Page title' },
  { cls: 'text-xl font-heading font-semibold', label: 'text-xl — Section heading' },
  { cls: 'text-lg font-heading font-semibold', label: 'text-lg — Card title' },
  { cls: 'text-base font-body', label: 'text-base — Body default' },
  { cls: 'text-sm font-body text-neutral-600', label: 'text-sm — Secondary text' },
  { cls: 'text-xs font-body text-neutral-500', label: 'text-xs — Caption / meta' },
]

const SPACING_SAMPLES = [
  { size: '1', px: '4px' },
  { size: '2', px: '8px' },
  { size: '3', px: '12px' },
  { size: '4', px: '16px' },
  { size: '6', px: '24px' },
  { size: '8', px: '32px' },
]

const ALL_STATUSES: OrderStatus[] = [
  'NEW',
  'CONFIRMED',
  'ASSIGNED',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED',
  'RETURNED',
]

/* StatusBadge imported from ../ui/StatusBadge */

export function DesignSystemReference() {
  return (
    <div className="bg-white">
      <div className="border-b border-neutral-200 px-4 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-brand">ShipFast</p>
        <h2 className="mt-1 font-heading text-xl font-bold text-neutral-900">
          Design tokens
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Reference sheet — confirm visual direction before building screens.
        </p>
      </div>

      <Section title="Brand">
        <div className="space-y-3">
          {BRAND_SWATCHES.map((s) => (
            <Swatch key={s.label} label={s.label} className={s.class} hex={s.hex} />
          ))}
        </div>
      </Section>

      <Section title="Accent">
        <div className="space-y-3">
          {ACCENT_SWATCHES.map((s) => (
            <Swatch key={s.label} label={s.label} className={s.class} hex={s.hex} />
          ))}
        </div>
      </Section>

      <Section title="Neutrals">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {NEUTRAL_SWATCHES.map((s) => (
            <Swatch key={s.label} label={s.label} className={s.class} hex={s.hex} />
          ))}
        </div>
      </Section>

      <Section title="Order status semantics">
        <div className="space-y-3">
          {STATUS_SWATCHES.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${s.text} ${s.bg} ${s.border}`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_STATUSES.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-4">
          {TYPE_SAMPLES.map((t) => (
            <div key={t.label}>
              <p className={t.cls}>The quick brown fox</p>
              <p className="mt-0.5 font-mono text-xs text-neutral-400">{t.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing (4px grid)">
        <div className="space-y-3">
          {SPACING_SAMPLES.map((s) => (
            <div key={s.size} className="flex items-center gap-3">
              <div
                className="h-4 rounded bg-brand-200"
                style={{ width: `${Number(s.size) * 4}px` }}
              />
              <span className="font-mono text-xs text-neutral-600">
                spacing-{s.size} · {s.px}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="UI primitives">
        <div className="space-y-4">
          <button
            type="button"
            className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white active:bg-brand-600"
          >
            Primary action
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-800 active:bg-neutral-50"
          >
            Secondary action
          </button>
          <button
            type="button"
            className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white active:bg-accent-600"
          >
            Accent CTA
          </button>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium text-neutral-800">Flat card</p>
            <p className="mt-1 text-sm text-neutral-500">
              1px border, no heavy shadow — data-dense layouts.
            </p>
          </div>
        </div>
      </Section>
    </div>
  )
}
