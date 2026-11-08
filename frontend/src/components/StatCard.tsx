interface StatCardProps {
  label: string
  value: string
  subtitle?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gray'
  className?: string
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-900',
  green: 'bg-green-50 border-green-200 text-green-900',
  purple: 'bg-purple-50 border-purple-200 text-purple-900',
  orange: 'bg-orange-50 border-orange-200 text-orange-900',
  gray: 'bg-gray-50 border-gray-200 text-gray-900',
}

export function StatCard({ label, value, subtitle, color = 'gray', className = '' }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${colorClasses[color]} ${className}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subtitle && <p className="mt-1 text-sm opacity-75">{subtitle}</p>}
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
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  }

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <div className="mt-2 space-y-1">
        <div>
          <p className="text-xl font-bold">{primaryValue}</p>
        </div>
        <div className="text-sm opacity-75">
          {secondaryLabel}: <span className="font-medium">{secondaryValue}</span>
        </div>
      </div>
    </div>
  )
}
