import { useState, useEffect, useMemo } from 'react'
import { JewelleryItem, DashboardSummary } from '../types'
import { HttpJewelleryService, MockJewelleryService, defaultItems, STORAGE_KEY } from '../api/jewelleryService'

// Check if backend is available before choosing service
function isBackendAvailable(): boolean {
  try {
    const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
    return !!url && url.length > 0
  } catch {
    return false
  }
}

// Use HTTP service for Phase 3, fallback to mock for offline development
export const jewelleryService = isBackendAvailable()
  ? new HttpJewelleryService()
  : new MockJewelleryService()

export function useJewelleryService() {
  const [items, setItems] = useState<JewelleryItem[]>([])
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, summaryData] = await Promise.all([
          jewelleryService.getItems(),
          jewelleryService.getDashboardSummary()
        ])
        setItems(itemsData)
        setDashboardSummary(summaryData)
        setLoadError(null)
      } catch (error: any) {
        console.error('[useJewelleryService] Error loading data:', error)
        // Try fallback to mock data if backend is unavailable
        try {
          const mockService = new MockJewelleryService()
          const [itemsData, summaryData] = await Promise.all([
            mockService.getItems(),
            mockService.getDashboardSummary()
          ])
          setItems(itemsData)
          setDashboardSummary(summaryData)
          setLoadError(null)
          console.log('[useJewelleryService] Fallback to mock data (backend unavailable)')
        } catch (mockError: any) {
          console.error('[useJewelleryService] Failed to load from mock data:', mockError)
          setLoadError(error.message || 'Failed to load data')
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const addOrUpdateItem = async (itemData: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>, id?: number) => {
    try {
      let result: JewelleryItem

      if (id) {
        result = await jewelleryService.updateItem(id, itemData)
      } else {
        result = await jewelleryService.createItem(itemData)
      }

      setItems(prev => {
        const existing = prev.find(i => i.id === id)
        if (existing) {
          return prev.map(i => (i.id === id ? result : i))
        }
        return [...prev, result]
      })
      setDashboardSummary(prev => {
        if (!prev) return null
        return {
          ...prev,
          totalItems: prev.totalItems + (id ? 0 : 1),
          [itemData.type === 'GOLD' ? 'totalGoldGrams' : itemData.type === 'SILVER' ? 'totalSilverGrams' : 'totalOtherGrams']:
            prev[itemData.type === 'GOLD' ? 'totalGoldGrams' : itemData.type === 'SILVER' ? 'totalSilverGrams' : 'totalOtherGrams'] + itemData.weightGrams,
          [itemData.type === 'GOLD' ? 'totalGoldValue' : itemData.type === 'SILVER' ? 'totalSilverValue' : 'totalOtherValue']:
            prev[itemData.type === 'GOLD' ? 'totalGoldValue' : itemData.type === 'SILVER' ? 'totalSilverValue' : 'totalOtherValue'] + itemData.amountSpent,
        }
      })
      return result
    } catch (error: any) {
      console.error('[useJewelleryService] Error saving item:', error)
      throw error
    }
  }

  const deleteItem = async (id: number) => {
    try {
      // Get the item to delete before calling delete (to have current data)
      const itemToDelete = items.find(i => i.id === id)

      // Delete from backend
      await jewelleryService.deleteItem(id)

      // Re-fetch items and dashboard summary to ensure we have the latest data
      const [itemsData, summaryData] = await Promise.all([
        jewelleryService.getItems(),
        jewelleryService.getDashboardSummary()
      ])

      setItems(itemsData)
      setDashboardSummary(summaryData)
    } catch (error: any) {
      console.error('[useJewelleryService] Error deleting item:', error)
      // If backend delete failed, show error and keep item
      // Re-fetch items to ensure we have the latest data
      try {
        const [itemsData, summaryData] = await Promise.all([
          jewelleryService.getItems(),
          jewelleryService.getDashboardSummary()
        ])
        setItems(itemsData)
        setDashboardSummary(summaryData)
      } catch (fetchError: any) {
        console.error('[useJewelleryService] Error re-fetching data:', fetchError)
      }
      throw error
    }
  }

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY)
    setItems(defaultItems)
    setDashboardSummary({
      totalGoldGrams: defaultItems.filter(i => i.type === 'GOLD').reduce((sum, i) => sum + i.weightGrams, 0),
      totalGoldValue: defaultItems.filter(i => i.type === 'GOLD').reduce((sum, i) => sum + i.amountSpent, 0),
      totalSilverGrams: defaultItems.filter(i => i.type === 'SILVER').reduce((sum, i) => sum + i.weightGrams, 0),
      totalSilverValue: defaultItems.filter(i => i.type === 'SILVER').reduce((sum, i) => sum + i.amountSpent, 0),
      totalOtherGrams: defaultItems.filter(i => i.type === 'OTHER').reduce((sum, i) => sum + i.weightGrams, 0),
      totalOtherValue: defaultItems.filter(i => i.type === 'OTHER').reduce((sum, i) => sum + i.amountSpent, 0),
      totalItems: defaultItems.length,
      totalAmountSpent: defaultItems.reduce((sum, i) => sum + i.amountSpent, 0)
    })
  }

  return useMemo(
    () => ({
      items,
      dashboardSummary,
      isLoading,
      loadError,
      addOrUpdateItem,
      deleteItem,
      resetToDefault
    }),
    [items, dashboardSummary, isLoading, loadError]
  )
}
