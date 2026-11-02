"use client"

import { useCallback } from "react"
import { useToast as useBaseToast } from "@/components/ui/simple-toast"

export function useToast() {
  const { show: baseShow } = useBaseToast()

  const show = useCallback(
    (options: {
      title: string
      description?: string
      type?: "success" | "error" | "info" | "warning"
    }) => {
      baseShow({ ...options, type: options.type ?? "info" })
    },
    [baseShow]
  )

  return { show }
}
