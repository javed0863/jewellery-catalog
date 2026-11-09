import { useState } from 'react'
import { JewelleryItem } from './types'
import { StatCard, StatCardDouble } from './components/StatCard'
import { ItemList } from './components/ItemList'
import { AddItemModal } from './components/AddItemModal'
import { ToastContainer } from './components/ToastContainer'
import { useJewelleryService } from './hooks/useJewelleryService'
import { formatCurrency, formatWeight } from './utils/formatting'

function App() {
  const { items, dashboardSummary, addOrUpdateItem, deleteItem, isLoading, loadError } = useJewelleryService()
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

  const handleEditItem = async (itemData: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>, id?: number) => {
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
      <div className="flex min-h-screen items-center justify-center bg-ivory-100 p-4">
        <div className="w-full max-w-md rounded-2xl border border-ivory-200 bg-ivory-50 p-8 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-900">Error Loading Data</h2>
              <p className="mt-1 text-sm text-ink-500">{loadError}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-xl bg-maroon-700 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-maroon-800"
            >
              Retry
            </button>
            <button
              onClick={() => (window.location.href = window.location.href)}
              className="flex-1 rounded-xl bg-ivory-200 px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ivory-300"
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ivory-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-ivory-200 border-t-maroon-700" />
        <p className="font-display text-lg text-ink-500">Loading your collection...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ivory-200 bg-ivory-50/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-maroon-600 to-maroon-900 text-marigold-300 shadow-card" style={{ borderRadius: '0.4rem' }}>
                <div className="absolute inset-0 ring-1 ring-inset ring-marigold-400/40" style={{ borderRadius: '0.4rem' }}/>
                {/* <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg> */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="140" height="140">
                  <rect x="8" y="8" width="124" height="124" rx="14" fill="#fff" stroke="#EAD9BF" stroke-width="3"/>
                  <clipPath id="s"><rect x="8" y="8" width="124" height="124" rx="14"/></clipPath>
                  <g clip-path="url(#s)">
                    <rect x="8" y="8" width="124" height="22" fill="#B5542F"/>
                    <rect x="40" y="48" width="60" height="60" fill="#D99A2B" opacity=".2"/>
                    <rect x="16" y="52" width="18" height="10" rx="3" fill="#D99A2B"/>
                    <rect x="16" y="72" width="12" height="10" rx="3" fill="#D99A2B" opacity=".55"/>
                    <rect x="104" y="52" width="18" height="10" rx="3" fill="#D99A2B" opacity=".6"/>
                    <rect x="104" y="72" width="14" height="10" rx="3" fill="#D99A2B" opacity=".45"/>
                    <g stroke="#EAD9BF" fill="none" stroke-width="2">
                      <line x1="8" y1="46" x2="132" y2="46"/>
                      <line x1="8" y1="66" x2="132" y2="66"/>
                      <line x1="8" y1="86" x2="132" y2="86"/>
                      <line x1="40" y1="8" x2="40" y2="132"/>
                      <line x1="100" y1="8" x2="100" y2="132"/>
                    </g>
                    <g fill="none" stroke="#D99A2B" stroke-width="4" stroke-linejoin="round">
                      <path d="M70 44 L96 60 L90 104 L50 104 L44 60 Z"/>
                      <line x1="70" y1="44" x2="70" y2="104"/>
                      <line x1="44" y1="60" x2="96" y2="60"/>
                    </g>
                    <path d="M98 44 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="#D99A2B"/>
                  </g>
                </svg>
              </div>
              <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-900">JewelTrack</h1>
                <p className="text-xs font-medium tracking-wide text-ink-400">Your heirloom collection</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-maroon-700 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-maroon-800 hover:shadow-lift focus:outline-none focus:ring-2 focus:ring-marigold-400 focus:ring-offset-2 focus:ring-offset-ivory-50"
            >
              <svg className="h-5 w-5 text-marigold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-marigold-400/60 to-transparent" />
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
          <ItemList items={items} onSave={handleEditItem} onDelete={deleteItem} />
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
