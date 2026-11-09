export type JewelleryType = 'GOLD' | 'SILVER' | 'OTHER'

export interface JewelleryItem {
  id: number
  name: string
  type: JewelleryType
  weightGrams: number
  amountSpent: number
  remarks: string | null
  givenBy: string | null
  belongsTo: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardSummary {
  totalGoldGrams: number
  totalGoldValue: number
  totalSilverGrams: number
  totalSilverValue: number
  totalOtherGrams: number
  totalOtherValue: number
  totalItems: number
  totalAmountSpent: number
}

export interface FilterParams {
  type?: JewelleryType | 'ALL'
  name?: string
  givenBy?: string
  belongsTo?: string
  sortField?: string
  sortDirection?: 'asc' | 'desc'
}
