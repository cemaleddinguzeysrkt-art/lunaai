"use client"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  title?: string
  description?: string
  itemName?: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function DeleteConfirmationModal({
  isOpen,
  title = "Delete Item",
  description = "This action cannot be undone.",
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Modal Card */}
      <div className="w-full max-w-sm rounded-lg bg-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-md p-1 hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          {itemName && (
            <p className="mt-2 rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground">{itemName}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <Button size="sm" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1 bg-transparent cursor-pointer">
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirm} disabled={isLoading} className="flex-1 bg-danger/80 hover:bg-danger cursor-pointer">
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}
