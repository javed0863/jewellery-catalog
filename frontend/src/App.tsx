import { useState } from 'react'
import { JewelleryItem } from './types'
import { StatCard, StatCardDouble } from './components/StatCard'
import { ItemList } from './components/ItemList'
import { AddItemModal } from './components/AddItemModal'
import { ToastContainer } from './components/ToastContainer'
import { useJewelleryService } from './hooks/useJewelleryService'
import { formatCurrency, formatWeight } from './utils/formatting'

function App() {
  const { items, dashboardSummary, addOrUpdateItem, isLoading, loadError } = useJewelleryService()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'error' | 'info'; message: string }[]>([])

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const handleCreateItem = async (itemData: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addOrUpdateItem(itemData)
      addToast('Item added successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Failed to add item', 'error')
    }
  }

  const handleEditItem = async (itemData: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>, id: number) => {
    try {
      await addOrUpdateItem(itemData, id)
      addToast('Item updated successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Failed to update item', 'error')
    }
  }

  // Show error state if data loading failed
  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-xl bg-white p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Error Loading Data</h2>
              <p className="text-gray-600">{loadError}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Retry
            </button>
            <button
              onClick={() => (window.location.href = window.location.href)}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-gray-600">Loading your collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">JewelTrack</h1>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stat Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCardDouble
              label="Gold"
              primaryValue={formatWeight(dashboardSummary?.totalGoldGrams ?? 0)}
              secondaryLabel="Value"
              secondaryValue={formatCurrency(dashboardSummary?.totalGoldValue ?? 0)}
              color="blue"
            />
            <StatCardDouble
              label="Silver"
              primaryValue={formatWeight(dashboardSummary?.totalSilverGrams ?? 0)}
              secondaryLabel="Value"
              secondaryValue={formatCurrency(dashboardSummary?.totalSilverValue ?? 0)}
              color="blue"
            />
            <StatCardDouble
              label="Other"
              primaryValue={formatWeight(dashboardSummary?.totalOtherGrams ?? 0)}
              secondaryLabel="Value"
              secondaryValue={formatCurrency(dashboardSummary?.totalOtherValue ?? 0)}
              color="purple"
            />
            <StatCard
              label="Total Items"
              value={dashboardSummary?.totalItems?.toString() ?? '0'}
              subtitle="Items in collection"
              color="orange"
            />
            <StatCard
              label="Total Spent"
              value={formatCurrency(dashboardSummary?.totalAmountSpent ?? 0)}
              subtitle="All items"
              color="green"
            />
          </div>
        </section>

        {/* Item List */}
        <section>
          <ItemList />
        </section>
      </main>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateItem}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  )
}

export default App
