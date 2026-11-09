import { useState, useMemo } from 'react'
import { JewelleryItem, FilterParams, JewelleryType } from '../types'
import { formatCurrency, formatWeight, formatDate, truncate } from '../utils/formatting'

interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

interface ItemListProps {
  items: JewelleryItem[]
  onSave: (itemData: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>, id?: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

const TYPE_PILLS: { value: FilterParams['type']; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'GOLD', label: 'Gold' },
  { value: 'SILVER', label: 'Silver' },
  { value: 'OTHER', label: 'Other' },
]

const TYPE_CHIP: Record<JewelleryType, { chip: string; dot: string }> = {
  GOLD: { chip: 'border-marigold-300 bg-gradient-to-r from-marigold-100 to-marigold-50 text-marigold-800', dot: 'bg-marigold-500' },
  SILVER: { chip: 'border-slate-300 bg-slate-100 text-slate-700', dot: 'bg-slate-500' },
  OTHER: { chip: 'border-rose-300 bg-rose-50 text-rose-800', dot: 'bg-rose-500' },
}

export function ItemList({ items, onSave, onDelete }: ItemListProps) {
  const [filter, setFilter] = useState<FilterParams>({})
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'createdAt', direction: 'desc' })
  const [editingItem, setEditingItem] = useState<JewelleryItem | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const filteredItems = items
    .filter(item => {
      if (filter.type && filter.type !== 'ALL') {
        if (item.type !== filter.type) return false
      }
      if (filter.name && filter.name.trim()) {
        if (!item.name.toLowerCase().includes(filter.name.toLowerCase())) return false
      }
      if (filter.givenBy && filter.givenBy.trim()) {
        if (!item.givenBy || !item.givenBy.toLowerCase().includes(filter.givenBy.toLowerCase())) return false
      }
      if (filter.belongsTo && filter.belongsTo.trim()) {
        if (!item.belongsTo || !item.belongsTo.toLowerCase().includes(filter.belongsTo.toLowerCase())) return false
      }
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortConfig.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'weightGrams':
          comparison = a.weightGrams - b.weightGrams
          break
        case 'amountSpent':
          comparison = a.amountSpent - b.amountSpent
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'givenBy':
          comparison = (a.givenBy ?? '').localeCompare(b.givenBy ?? '')
          break
        case 'belongsTo':
          comparison = (a.belongsTo ?? '').localeCompare(b.belongsTo ?? '')
          break
        default:
          comparison = 0
      }
      return sortConfig.direction === 'desc' ? -comparison : comparison
    })

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const clearFilters = () => {
    setFilter({})
    setSortConfig({ field: 'createdAt', direction: 'desc' })
  }

  const givenByOptions = useMemo(() => {
    const values = new Set<string>()
    items.forEach(item => { if (item.givenBy) values.add(item.givenBy) })
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [items])

  const belongsToOptions = useMemo(() => {
    const values = new Set<string>()
    items.forEach(item => { if (item.belongsTo) values.add(item.belongsTo) })
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [items])

  const handleEdit = (item: JewelleryItem) => {
    setEditingItem(item)
  }

  const handleDelete = async () => {
    if (deleteConfirmId !== null) {
      try {
        await onDelete(deleteConfirmId)
      } catch (error: any) {
        console.error('Error deleting item:', error)
      } finally {
        setDeleteConfirmId(null)
      }
    }
  }

  const handleItemSubmit = async (
    itemData: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>,
    id?: number
  ) => {
    try {
      await onSave(itemData, id)
    } catch (error: any) {
      console.error('Error saving item:', error)
      throw error
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ivory-200 bg-ivory-50 p-4 shadow-card">
        <div className="flex items-center rounded-xl border border-ivory-200 bg-ivory-100 p-1">
          {TYPE_PILLS.map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => setFilter({ ...filter, type: pill.value })}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                (filter.type ?? 'ALL') === pill.value
                  ? 'bg-ivory-50 text-maroon-700 shadow-sm'
                  : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name..."
            value={filter.name ?? ''}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            className="field-search"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink-500">Belongs To:</span>
          <select
            value={filter.belongsTo ?? ''}
            onChange={(e) => setFilter({ ...filter, belongsTo: e.target.value || undefined })}
            className="field-select"
          >
            <option value="">Any</option>
            {belongsToOptions.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink-500">Given By:</span>
          <select
            value={filter.givenBy ?? ''}
            onChange={(e) => setFilter({ ...filter, givenBy: e.target.value || undefined })}
            className="field-select"
          >
            <option value="">Any</option>
            {givenByOptions.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {(filter.type || filter.name || filter.givenBy || filter.belongsTo) && (
          <button
            onClick={clearFilters}
            className="ml-auto rounded-lg bg-marigold-100 px-3 py-1.5 text-sm font-semibold text-marigold-800 transition-colors hover:bg-marigold-200"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Item Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-400">
          Showing <span className="font-semibold text-ink-700">{filteredItems.length}</span> of{' '}
          <span className="font-semibold text-ink-700">{items.length}</span> items
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-ivory-200 bg-ivory-50 shadow-card">
        <table className="min-w-full divide-y divide-ivory-200">
          <thead className="bg-ivory-100/70">
            <tr>
              {[
                { label: 'Name', field: 'name' },
                { label: 'Type', field: 'type' },
                { label: 'Weight (g)', field: 'weightGrams' },
                { label: 'Amount (S$)', field: 'amountSpent' },
                { label: 'Belongs To', field: 'belongsTo' },
                { label: 'Given By', field: 'givenBy' },
                { label: 'Remarks', field: 'remarks' },
                { label: 'Added', field: 'createdAt' },
              ].map((column) => (
                <th
                  key={column.field}
                  onClick={() => handleSort(column.field)}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-400 cursor-pointer select-none transition-colors hover:text-maroon-700"
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortConfig.field === column.field && (
                      <svg
                        className="h-3 w-3 text-marigold-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {sortConfig.direction === 'asc' ? (
                          <path d="M5 15l7-7 7 7" />
                        ) : (
                          <path d="M19 9l-7 7-7-7" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-200 bg-ivory-50">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ivory-100 ring-1 ring-ivory-200">
                    <svg className="h-12 w-12 text-marigold-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="32" cy="32" r="28" strokeOpacity="0.35" />
                      <circle cx="32" cy="32" r="19" strokeOpacity="0.55" />
                      <circle cx="32" cy="32" r="7" fill="currentColor" fillOpacity="0.35" />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                        <ellipse
                          key={angle}
                          cx="32"
                          cy="12"
                          rx="4.5"
                          ry="8"
                          strokeOpacity="0.6"
                          transform={`rotate(${angle} 32 32)`}
                        />
                      ))}
                    </svg>
                  </div>
                  <p className="font-display text-lg font-semibold text-ink-900">No items found</p>
                  <p className="mt-1 text-sm text-ink-400">Try adjusting your filters or add a new item</p>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-marigold-50/50">
                  <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-ink-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TYPE_CHIP[item.type].chip}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${TYPE_CHIP[item.type].dot}`} />
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-sm text-ink-500">
                    {formatWeight(item.weightGrams)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-sm font-semibold text-ink-900">
                    {formatCurrency(item.amountSpent)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-sm text-ink-500">
                    {item.belongsTo || <span className="text-ivory-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-sm text-ink-500">
                    {item.givenBy || <span className="text-ivory-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-sm text-ink-400">
                    {truncate(item.remarks, 30)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-sm text-ink-400">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        aria-label={`Edit ${item.name}`}
                        title="Edit"
                        className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-marigold-100 hover:text-marigold-700"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        aria-label={`Delete ${item.name}`}
                        title="Delete"
                        className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-rose-100 hover:text-rose-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-ink-900/50 p-4 backdrop-blur-sm">
          <div className="animate-rise-in relative w-full max-w-md rounded-2xl border border-ivory-200 bg-ivory-50 p-6 shadow-lift">
            <h3 className="font-display text-xl font-semibold text-ink-900">Confirm Delete</h3>
            <p className="mt-2 text-sm text-ink-500">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ivory-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-maroon-700 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-maroon-800 hover:shadow-lift"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleItemSubmit}
        />
      )}
    </div>
  )
}

interface EditItemModalProps {
  item: JewelleryItem
  onClose: () => void
  onSubmit: (itemData: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>, id?: number) => Promise<void>
}

const TYPE_RADIO_STYLE: Record<JewelleryType, { active: string; dot: string }> = {
  GOLD: { active: 'border-marigold-500 bg-marigold-50', dot: 'bg-marigold-500' },
  SILVER: { active: 'border-slate-400 bg-slate-50', dot: 'bg-slate-500' },
  OTHER: { active: 'border-rose-400 bg-rose-50', dot: 'bg-rose-500' },
}

function EditItemModal({ item, onClose, onSubmit }: EditItemModalProps) {
  const [formData, setFormData] = useState({
    name: item.name,
    type: item.type,
    weightGrams: item.weightGrams.toString(),
    amountSpent: item.amountSpent.toString(),
    remarks: item.remarks ?? '',
    givenBy: item.givenBy ?? '',
    belongsTo: item.belongsTo ?? ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.weightGrams) {
      newErrors.weightGrams = 'Weight is required'
    } else if (parseFloat(formData.weightGrams) <= 0) {
      newErrors.weightGrams = 'Weight must be greater than 0'
    }

    if (!formData.amountSpent) {
      newErrors.amountSpent = 'Amount is required'
    } else if (parseFloat(formData.amountSpent) < 0) {
      newErrors.amountSpent = 'Amount cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(
        {
          name: formData.name.trim(),
          type: formData.type,
          weightGrams: parseFloat(formData.weightGrams),
          amountSpent: parseFloat(formData.amountSpent),
          remarks: formData.remarks.trim() || null,
          givenBy: formData.givenBy.trim() || null,
          belongsTo: formData.belongsTo.trim() || null
        },
        item.id
      )
      onClose()
    } catch (error: any) {
      console.error('Error updating item:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-ink-900/50 p-4 backdrop-blur-sm">
      <div className="animate-rise-in relative w-full max-w-lg rounded-2xl border border-ivory-200 bg-ivory-50 shadow-lift">
        <div className="flex items-center justify-between border-b border-ivory-200 px-6 py-4">
          <h3 className="font-display text-xl font-semibold text-ink-900">Edit Item</h3>
          <button
            onClick={onClose}
            className="text-ink-400 transition-colors hover:text-ink-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div>
            <label className="field-label">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="field-input"
              placeholder="e.g., Bridal Kundan Set"
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div>
            <label className="field-label">
              Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['GOLD', 'SILVER', 'OTHER'] as const).map((type) => (
                <label
                  key={type}
                  className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 py-3 transition-all ${
                    formData.type === type
                      ? TYPE_RADIO_STYLE[type].active
                      : 'border-ivory-200 bg-white hover:border-ivory-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={() => setFormData({ ...formData, type })}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-ink-900">{type}</span>
                  {formData.type === type && (
                    <div className="absolute top-2 right-2">
                      <div className={`h-2 w-2 rounded-full ${TYPE_RADIO_STYLE[type].dot}`} />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">
              Weight (g) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.weightGrams}
              onChange={(e) => setFormData({ ...formData, weightGrams: e.target.value })}
              className="field-input"
              placeholder="e.g., 45.5"
              min="0.001"
            />
            {errors.weightGrams && <p className="field-error">{errors.weightGrams}</p>}
          </div>

          <div>
            <label className="field-label">
              Amount (S$) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-medium text-ink-400">S$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amountSpent}
                onChange={(e) => setFormData({ ...formData, amountSpent: e.target.value })}
                className="field-input pl-10"
                placeholder="0.00"
                min="0"
              />
            </div>
            {errors.amountSpent && <p className="field-error">{errors.amountSpent}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">
                Belongs To <span className="font-normal text-ink-300">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.belongsTo}
                onChange={(e) => setFormData({ ...formData, belongsTo: e.target.value })}
                className="field-input"
                placeholder="e.g., Wife"
              />
            </div>
            <div>
              <label className="field-label">
                Given By <span className="font-normal text-ink-300">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.givenBy}
                onChange={(e) => setFormData({ ...formData, givenBy: e.target.value })}
                className="field-input"
                placeholder="e.g., Mother"
              />
            </div>
          </div>

          <div>
            <label className="field-label">
              Remarks <span className="font-normal text-ink-300">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="field-input resize-none"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-ivory-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ivory-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-colors ${
                isSubmitting ? 'bg-marigold-500' : 'bg-maroon-700 hover:bg-maroon-800'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
