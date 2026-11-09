import { JewelleryItem } from '../types'
import { api, HttpClientError } from './httpClient'

export const STORAGE_KEY = 'jeweltrack_items'

export interface JewelleryService {
  getItems(params?: any): Promise<JewelleryItem[]>
  getDashboardSummary(): Promise<any>
  getItemById(id: number): Promise<JewelleryItem | null>
  createItem(item: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<JewelleryItem>
  updateItem(id: number, item: Partial<JewelleryItem>): Promise<JewelleryItem>
  deleteItem(id: number): Promise<void>
}

// Default sample data for Phase 1
export const defaultItems: JewelleryItem[] = [
  {
    id: 1,
    name: "Bridal Kundan Set",
    type: "GOLD",
    weightGrams: 120.000,
    amountSpent: 45000.00,
    remarks: "Bought for wedding, Chennai 2019",
    givenBy: "Father-in-law",
    belongsTo: "Wife",
    createdAt: new Date('2019-06-15T10:30:00').toISOString(),
    updatedAt: new Date('2019-06-15T10:30:00').toISOString()
  },
  {
    id: 2,
    name: "Gold Temple Necklace",
    type: "GOLD",
    weightGrams: 45.200,
    amountSpent: 12850.00,
    remarks: "Traditional temple design",
    givenBy: null,
    belongsTo: "Me",
    createdAt: new Date('2020-03-20T14:20:00').toISOString(),
    updatedAt: new Date('2020-03-20T14:20:00').toISOString()
  },
  {
    id: 3,
    name: "18K Gold Earrings",
    type: "GOLD",
    weightGrams: 8.500,
    amountSpent: 3200.00,
    remarks: "Stud earrings",
    givenBy: null,
    belongsTo: "Me",
    createdAt: new Date('2021-01-10T09:15:00').toISOString(),
    updatedAt: new Date('2021-01-10T09:15:00').toISOString()
  },
  {
    id: 4,
    name: "Gold Bangles",
    type: "GOLD",
    weightGrams: 35.000,
    amountSpent: 9500.00,
    remarks: "Set of 2 bangles",
    givenBy: "Mother",
    belongsTo: "Me",
    createdAt: new Date('2018-11-05T16:45:00').toISOString(),
    updatedAt: new Date('2018-11-05T16:45:00').toISOString()
  },
  {
    id: 5,
    name: "Silver 92.5 Pendant",
    type: "SILVER",
    weightGrams: 15.300,
    amountSpent: 450.00,
    remarks: "Moon design pendant",
    givenBy: null,
    belongsTo: "Daughter",
    createdAt: new Date('2022-02-28T11:00:00').toISOString(),
    updatedAt: new Date('2022-02-28T11:00:00').toISOString()
  },
  {
    id: 6,
    name: "Silver Coin",
    type: "SILVER",
    weightGrams: 31.100,
    amountSpent: 850.00,
    remarks: "Investment coin",
    givenBy: null,
    belongsTo: null,
    createdAt: new Date('2022-08-15T13:30:00').toISOString(),
    updatedAt: new Date('2022-08-15T13:30:00').toISOString()
  },
  {
    id: 7,
    name: "Silver Bangles",
    type: "SILVER",
    weightGrams: 25.000,
    amountSpent: 680.00,
    remarks: "Set of 3 bangles",
    givenBy: "Mother",
    belongsTo: "Me",
    createdAt: new Date('2021-07-22T10:00:00').toISOString(),
    updatedAt: new Date('2021-07-22T10:00:00').toISOString()
  },
  {
    id: 8,
    name: "Platinum Ring",
    type: "OTHER",
    weightGrams: 6.800,
    amountSpent: 8500.00,
    remarks: "Engagement ring",
    givenBy: "Husband",
    belongsTo: "Wife",
    createdAt: new Date('2019-09-01T15:00:00').toISOString(),
    updatedAt: new Date('2019-09-01T15:00:00').toISOString()
  },
  {
    id: 9,
    name: "Pearl Strand",
    type: "OTHER",
    weightGrams: 45.000,
    amountSpent: 3200.00,
    remarks: "Freshwater pearl necklace",
    givenBy: "Father",
    belongsTo: "Wife",
    createdAt: new Date('2020-05-10T14:00:00').toISOString(),
    updatedAt: new Date('2020-05-10T14:00:00').toISOString()
  },
  {
    id: 10,
    name: "Gold 24K Coins",
    type: "GOLD",
    weightGrams: 50.000,
    amountSpent: 18500.00,
    remarks: "Investment grade coins",
    givenBy: null,
    belongsTo: null,
    createdAt: new Date('2023-01-05T09:00:00').toISOString(),
    updatedAt: new Date('2023-01-05T09:00:00').toISOString()
  },
  {
    id: 11,
    name: "18K Gold Chain",
    type: "GOLD",
    weightGrams: 12.500,
    amountSpent: 4800.00,
    remarks: "Italian chain",
    givenBy: "Husband",
    belongsTo: "Me",
    createdAt: new Date('2022-04-18T11:30:00').toISOString(),
    updatedAt: new Date('2022-04-18T11:30:00').toISOString()
  },
  {
    id: 12,
    name: "Gold Ring",
    type: "GOLD",
    weightGrams: 5.200,
    amountSpent: 1800.00,
    remarks: "Simple band",
    givenBy: "Wife",
    belongsTo: "Me",
    createdAt: new Date('2021-12-01T10:15:00').toISOString(),
    updatedAt: new Date('2021-12-01T10:15:00').toISOString()
  },
  {
    id: 13,
    name: "Silver Bracelet",
    type: "SILVER",
    weightGrams: 18.700,
    amountSpent: 520.00,
    remarks: "Charm bracelet",
    givenBy: null,
    belongsTo: "Son",
    createdAt: new Date('2023-03-12T16:00:00').toISOString(),
    updatedAt: new Date('2023-03-12T16:00:00').toISOString()
  },
  {
    id: 14,
    name: "Gold Bangles",
    type: "GOLD",
    weightGrams: 28.000,
    amountSpent: 7200.00,
    remarks: "Lightweight daily wear",
    givenBy: null,
    belongsTo: "Me",
    createdAt: new Date('2020-11-25T14:45:00').toISOString(),
    updatedAt: new Date('2020-11-25T14:45:00').toISOString()
  },
  {
    id: 15,
    name: "Gold Earrings",
    type: "GOLD",
    weightGrams: 9.800,
    amountSpent: 3800.00,
    remarks: "Jhumka style",
    givenBy: null,
    belongsTo: "Me",
    createdAt: new Date('2019-08-20T11:20:00').toISOString(),
    updatedAt: new Date('2019-08-20T11:20:00').toISOString()
  }
]

// Mock implementation of JewelleryService (for offline/dev use)
export class MockJewelleryService implements JewelleryService {
  private items: JewelleryItem[]

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        this.items = JSON.parse(stored)
      } catch {
        this.items = [...defaultItems]
      }
    } else {
      this.items = [...defaultItems]
    }
    // Ensure IDs are correct after parsing
    this.items.forEach((item, index) => {
      if (item.id !== index + 1) {
        item.id = index + 1
      }
    })
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
  }

  private generateId(): number {
    return Math.max(...this.items.map(i => i.id), 0) + 1
  }

  async getItems(params?: any): Promise<JewelleryItem[]> {
    let result = [...this.items]

    // Filter by type
    if (params?.type && params.type !== 'ALL') {
      result = result.filter(item => item.type === params.type)
    }

    // Filter by name (case-insensitive substring)
    if (params?.name && params.name.trim()) {
      const name = params.name.trim().toLowerCase()
      result = result.filter(item => item.name.toLowerCase().includes(name))
    }

    // Sort
    if (params?.sortField) {
      result.sort((a, b) => {
        let comparison = 0
        const field = params.sortField!
        const direction = params.sortDirection === 'desc' ? -1 : 1

        switch (field) {
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
          default:
            comparison = 0
        }

        return comparison * direction
      })
    }

    return result
  }

  async getDashboardSummary(): Promise<any> {
    const summary = {
      totalGoldGrams: 0,
      totalGoldValue: 0,
      totalSilverGrams: 0,
      totalSilverValue: 0,
      totalOtherGrams: 0,
      totalOtherValue: 0,
      totalItems: this.items.length,
      totalAmountSpent: 0
    }

    for (const item of this.items) {
      summary.totalAmountSpent += item.amountSpent

      switch (item.type) {
        case 'GOLD':
          summary.totalGoldGrams += item.weightGrams
          summary.totalGoldValue += item.amountSpent
          break
        case 'SILVER':
          summary.totalSilverGrams += item.weightGrams
          summary.totalSilverValue += item.amountSpent
          break
        case 'OTHER':
          summary.totalOtherGrams += item.weightGrams
          summary.totalOtherValue += item.amountSpent
          break
      }
    }

    return summary
  }

  async getItemById(id: number): Promise<JewelleryItem | null> {
    const item = this.items.find(i => i.id === id)
    return item ?? null
  }

  async createItem(itemData: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<JewelleryItem> {
    const now = new Date().toISOString()
    const newItem: JewelleryItem = {
      ...itemData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    }
    this.items.push(newItem)
    this.save()
    return newItem
  }

  async updateItem(id: number, itemData: Partial<JewelleryItem>): Promise<JewelleryItem> {
    const index = this.items.findIndex(i => i.id === id)
    if (index === -1) {
      throw new Error('Item not found')
    }

    const updatedItem: JewelleryItem = {
      ...this.items[index],
      ...itemData,
      updatedAt: new Date().toISOString()
    }
    this.items[index] = updatedItem
    this.save()
    return updatedItem
  }

  async deleteItem(id: number): Promise<void> {
    const index = this.items.findIndex(i => i.id === id)
    if (index === -1) {
      throw new Error('Item not found')
    }
    this.items.splice(index, 1)
    this.save()
  }
}

// HTTP client implementation of JewelleryService (for Phase 3 with backend)
export class HttpJewelleryService implements JewelleryService {
  async getItems(params?: any): Promise<JewelleryItem[]> {
    const filters: Record<string, any> = {}

    // Map filter params to API format
    if (params?.type && params.type !== 'ALL') {
      filters.type = params.type
    }

    if (params?.name && params.name.trim()) {
      filters.name = params.name.trim()
    }

    // Handle sorting
    if (params?.sortField) {
      const sortField = params.sortField
      const sortDirection = params.sortDirection || 'desc'
      filters.sort = `${sortField},${sortDirection}`
    }

    try {
      const items = await api.getItems(filters)
      return items
    } catch (error) {
      console.error('Error fetching items:', error)
      // Fallback to mock data on error for offline development
      if (error instanceof HttpClientError && (error.status === 503 || error.status === 404)) {
        console.log('Backend unavailable, using mock data')
        const mockService = new MockJewelleryService()
        return mockService.getItems(params)
      }
      throw error
    }
  }

  async getDashboardSummary(): Promise<any> {
    try {
      const summary = await api.getDashboardSummary()
      return {
        totalGoldGrams: Number(summary.totalGoldGrams || 0),
        totalGoldValue: Number(summary.totalGoldValue || 0),
        totalSilverGrams: Number(summary.totalSilverGrams || 0),
        totalSilverValue: Number(summary.totalSilverValue || 0),
        totalOtherGrams: Number(summary.totalOtherGrams || 0),
        totalOtherValue: Number(summary.totalOtherValue || 0),
        totalItems: summary.totalItems || 0,
        totalAmountSpent: Number(summary.totalAmountSpent || 0)
      }
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
      // Fallback to mock data on error
      if (error instanceof HttpClientError && (error.status === 503 || error.status === 404)) {
        console.log('Backend unavailable, using mock data')
        const mockService = new MockJewelleryService()
        return mockService.getDashboardSummary()
      }
      throw error
    }
  }

  async getItemById(id: number): Promise<JewelleryItem | null> {
    try {
      const item = await api.getItemById(id)
      return item
    } catch (error) {
      if (error instanceof HttpClientError && error.status === 404) {
        return null
      }
      console.error('Error fetching item:', error)
      throw error
    }
  }

  async createItem(itemData: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<JewelleryItem> {
    try {
      return await api.createItem(itemData)
    } catch (error) {
      console.error('Error creating item:', error)
      throw error
    }
  }

  async updateItem(id: number, itemData: Partial<JewelleryItem>): Promise<JewelleryItem> {
    try {
      return await api.updateItem(id, itemData)
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }

  async deleteItem(id: number): Promise<void> {
    try {
      await api.deleteItem(id)
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  }
}

// Default service - use HTTP for Phase 3, can be toggled for offline use
export const jewelleryService = new HttpJewelleryService()
