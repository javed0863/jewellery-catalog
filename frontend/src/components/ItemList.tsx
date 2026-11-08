import { useState, useMemo } from 'react'
import { JewelleryItem, FilterParams } from '../types'
import { formatCurrency, formatWeight, formatCarat, formatDate, truncate } from '../utils/formatting'
import { useJewelleryService } from '../hooks/useJewelleryService'

interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export function ItemList() {
  const { items, addOrUpdateItem, deleteItem } = useJewelleryService()
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
      if (filter.carat !== undefined && filter.carat !== null && filter.carat !== '') {
        const carat = parseFloat(filter.carat)
        if (!isNaN(carat)) {
          if (item.carat === null || item.carat !== carat) return false
        }
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
        case 'carat':
          const aCarat = a.carat ?? 0
          const bCarat = b.carat ?? 0
          comparison = aCarat - bCarat
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

  // Get unique carat values from filtered items for the dropdown
  const caratOptions = useMemo(() => {
    const carats = new Set<string>()
    items.forEach(item => {
      if (item.carat !== null) {
        carats.add(item.carat.toString())
      }
    })
    return Array.from(carats).sort((a, b) => parseFloat(a) - parseFloat(b))
  }, [items])

  const handleEdit = (item: JewelleryItem) => {
    setEditingItem(item)
  }

  const handleDelete = async () => {
    if (deleteConfirmId !== null) {
      try {
        await deleteItem(deleteConfirmId)
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
      await addOrUpdateItem(itemData, id)
    } catch (error: any) {
      console.error('Error saving item:', error)
      throw error
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Type:</span>
          <select
            value={filter.type ?? 'ALL'}
            onChange={(e) => setFilter({ ...filter, type: e.target.value as FilterParams['type'] })}
            className="rounded-lg border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value="GOLD">Gold</option>
            <option value="SILVER">Silver</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Name:</span>
          <input
            type="text"
            placeholder="Search by name..."
            value={filter.name ?? ''}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            className="w-40 rounded-lg border-gray-300 py-1.5 pl-3 pr-3 text-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Carat:</span>
          <select
            value={filter.carat ?? ''}
            onChange={(e) => setFilter({ ...filter, carat: e.target.value || null })}
            className="rounded-lg border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Any</option>
            {caratOptions.map(carat => (
              <option key={carat} value={carat}>
                {formatCarat(parseFloat(carat))}
              </option>
            ))}
          </select>
        </div>

        {(filter.type || filter.name || filter.carat) && (
          <button
            onClick={clearFilters}
            className="ml-auto rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Item Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredItems.length}</span> of{' '}
          <span className="font-semibold">{items.length}</span> items
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { label: 'Name', field: 'name' },
                { label: 'Type', field: 'type' },
                { label: 'Carat', field: 'carat' },
                { label: 'Weight (g)', field: 'weightGrams' },
                { label: 'Amount (S$)', field: 'amountSpent' },
                { label: 'Remarks', field: 'remarks' },
                { label: 'Added', field: 'createdAt' },
              ].map((column) => (
                <th
                  key={column.field}
                  onClick={() => handleSort(column.field)}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortConfig.field === column.field && (
                      <svg
                        className="h-3 w-3"
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
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">No items found</p>
                  <p className="mt-1 text-sm">Try adjusting your filters or add a new item</p>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.type === 'GOLD'
                          ? 'bg-orange-100 text-orange-800'
                          : item.type === 'SILVER'
                          ? 'bg-gray-200 text-gray-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatCarat(item.carat)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatWeight(item.weightGrams)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(item.amountSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {truncate(item.remarks, 30)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 mr-3 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
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

function EditItemModal({ item, onClose, onSubmit }: EditItemModalProps) {
  const [formData, setFormData] = useState({
    name: item.name,
    type: item.type,
    carat: item.carat?.toString() ?? '',
    weightGrams: item.weightGrams.toString(),
    amountSpent: item.amountSpent.toString(),
    remarks: item.remarks ?? ''
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

    if (formData.carat && (parseFloat(formData.carat) < 0 || parseFloat(formData.carat) > 99.99)) {
      newErrors.carat = 'Carat must be between 0 and 99.99'
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
          carat: formData.carat ? parseFloat(formData.carat) : null,
          weightGrams: parseFloat(formData.weightGrams),
          amountSpent: parseFloat(formData.amountSpent),
          remarks: formData.remarks.trim() || null
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">Edit Item</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-900">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border-gray-300 py-2.5 pl-3 pr-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Bridal Kundan Set"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-900">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['GOLD', 'SILVER', 'OTHER'] as const).map((type) => (
                <label
                  key={type}
                  className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 py-3 transition-all ${
                    formData.type === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
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
                  <span className="text-sm font-semibold text-gray-900">{type}</span>
                  {formData.type === type && (
                    <div className="absolute top-2 right-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-900">
              Carat <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.carat}
              onChange={(e) => setFormData({ ...formData, carat: e.target.value })}
              className="w-full rounded-lg border-gray-300 py-2.5 pl-3 pr-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 22"
              min="0"
              max="99.99"
            />
            {errors.carat && <p className="mt-1 text-xs text-red-600">{errors.carat}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-900">
              Weight (g) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.weightGrams}
              onChange={(e) => setFormData({ ...formData, weightGrams: e.target.value })}
              className="w-full rounded-lg border-gray-300 py-2.5 pl-3 pr-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 45.5"
              min="0.001"
            />
            {errors.weightGrams && <p className="mt-1 text-xs text-red-600">{errors.weightGrams}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-900">
              Amount (S$) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">S$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amountSpent}
                onChange={(e) => setFormData({ ...formData, amountSpent: e.target.value })}
                className="w-full rounded-lg border-gray-300 py-2.5 pl-10 pr-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
              />
            </div>
            {errors.amountSpent && <p className="mt-1 text-xs text-red-600">{errors.amountSpent}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-900">
              Remarks <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full rounded-lg border-gray-300 py-2.5 pl-3 pr-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
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
