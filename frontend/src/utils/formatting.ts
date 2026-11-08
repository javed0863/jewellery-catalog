// Custom date formatting without external dependency

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatWeight(weight: number): string {
  const formatted = weight.toFixed(1)
  return formatted.replace(/\.0$/, '') + ' g'
}

export function formatCarat(carat: number | null): string {
  if (carat === null) return '-'
  return carat.toString() + 'K'
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  } catch {
    return '-'
  }
}

export function truncate(text: string | null, length: number = 30): string {
  if (!text) return '-'
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
