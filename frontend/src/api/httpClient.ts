import { JewelleryItem, DashboardSummary } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

export class HttpClientError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'HttpClientError'
  }
}

export async function jsonRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    let errorDetails
    try {
      errorDetails = await response.json()
    } catch {
      errorDetails = { message: response.statusText }
    }
    throw new HttpClientError(response.status, errorDetails.message || response.statusText, errorDetails)
  }

  // Handle empty response body (e.g., 204 No Content)
  const contentType = response.headers.get('content-type')
  if (contentType === null || response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export async function getJson<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  const urlObj = new URL(url)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value))
      }
    })
  }
  return jsonRequest<T>(urlObj.toString())
}

// API endpoints
export const api = {
  // Items
  getItems: (params?: {
    type?: string
    name?: string
    carat?: number
    sort?: string
    page?: number
    size?: number
  }) => getJson<JewelleryItem[]>(`${API_BASE_URL}/items`, params),

  getItemById: (id: number) => jsonRequest<JewelleryItem>(`${API_BASE_URL}/items/${id}`),

  createItem: (data: Omit<JewelleryItem, 'id' | 'createdAt' | 'updatedAt'>) =>
    jsonRequest<JewelleryItem>(`${API_BASE_URL}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateItem: (id: number, data: Partial<JewelleryItem>) =>
    jsonRequest<JewelleryItem>(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteItem: (id: number) => jsonRequest<void>(`${API_BASE_URL}/items/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboardSummary: () => jsonRequest<DashboardSummary>(`${API_BASE_URL}/dashboard/summary`),
}
