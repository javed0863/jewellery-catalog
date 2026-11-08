import { useState, useEffect } from 'react'
import { JewelleryItem, JewelleryType } from '../types'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (item: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  initialData?: JewelleryItem | null
  isEditing?: boolean
}

export function AddItemModal({ isOpen, onClose, onSubmit, initialData, isEditing = false }: ModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'GOLD' as JewelleryType,
    carat: '',
    weightGrams: '',
    amountSpent: '',
    remarks: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        carat: initialData.carat?.toString() ?? '',
        weightGrams: initialData.weightGrams.toString(),
        amountSpent: initialData.amountSpent.toString(),
        remarks: initialData.remarks ?? ''
      })
    } else if (isOpen) {
      resetForm()
    }
  }, [isOpen, initialData])

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'GOLD',
      carat: '',
      weightGrams: '',
      amountSpent: '',
      remarks: ''
    })
    setErrors({})
  }

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
      await onSubmit({
        name: formData.name.trim(),
        type: formData.type,
        carat: formData.carat ? parseFloat(formData.carat) : null,
        weightGrams: parseFloat(formData.weightGrams),
        amountSpent: parseFloat(formData.amountSpent),
        remarks: formData.remarks.trim() || null
      })

      onClose()
      resetForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Item' : 'Add New Item'}
          </h3>
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
          {/* Name */}
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

          {/* Type */}
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
            {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
          </div>

          {/* Carat */}
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

          {/* Weight */}
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

          {/* Amount */}
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

          {/* Remarks */}
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

          {/* Actions */}
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
                isEditing ? 'Save Changes' : 'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
