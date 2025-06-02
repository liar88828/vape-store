"use client"

import { useMemo } from "react"
import { products, salesData, preOrders } from "@/lib/data"

export function useData() {
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= p.minStock)
  }, [])

  return {
    products,
    salesData,
    preOrders,
    lowStockProducts,
  }
}
