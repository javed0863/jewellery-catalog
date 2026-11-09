import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  type: ToastType
  message: string
}

interface ToastProps {
  message: string
  type: ToastType
  onClose: (id: number) => void
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(Date.now())
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: 'border-henna-200 bg-henna-50 text-henna-700',
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    info: 'border-marigold-200 bg-marigold-50 text-marigold-800'
  }

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-card ${styles[type]} animate-fade-in`}>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(Date.now())}
        className="ml-auto text-current opacity-60 transition-opacity hover:opacity-100"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  removeToast: (id: number) => void
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}
