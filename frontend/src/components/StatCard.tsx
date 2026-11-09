interface StatCardProps {
  label: string
  value: string
  subtitle?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gray'
  className?: string
}

const accentBar = {
  blue: 'from-marigold-300 to-marigold-600',
  green: 'from-henna-500 to-henna-700',
  purple: 'from-maroon-500 to-maroon-800',
  orange: 'from-marigold-500 to-maroon-500',
  gray: 'from-ivory-300 to-ivory-400',
}

const dot = {
  blue: 'bg-marigold-500',
  green: 'bg-henna-600',
  purple: 'bg-maroon-600',
  orange: 'bg-marigold-600',
  gray: 'bg-ink-400',
}

export function StatCard({ label, value, subtitle, color = 'gray', className = '' }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-ivory-200 bg-ivory-50 p-5 shadow-card transition-shadow hover:shadow-lift ${className}`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentBar[color]}`} />
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-400">
        <span className={`h-1.5 w-1.5 rounded-full ${dot[color]}`} />
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-ink-400">{subtitle}</p>}
    </div>
  )
}

export function StatCardDouble({
  label,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  color = 'blue'
}: {
  label: string
  primaryValue: string
  secondaryLabel: string
  secondaryValue: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ivory-200 bg-ivory-50 p-5 shadow-card transition-shadow hover:shadow-lift">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentBar[color]}`} />
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-400">
        <span className={`h-1.5 w-1.5 rounded-full ${dot[color]}`} />
        {label}
      </p>
      <div className="mt-2 space-y-1">
        <div>
          <p className="font-display text-2xl font-semibold text-ink-900">{primaryValue}</p>
        </div>
        <div className="text-sm text-ink-400">
          {secondaryLabel}: <span className="font-semibold text-ink-700">{secondaryValue}</span>
        </div>
      </div>
    </div>
  )
}
