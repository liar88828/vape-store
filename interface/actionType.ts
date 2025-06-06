import { Product } from "@prisma/client";

export type ActionResponse<T = any> = {
    success: boolean,
    message: string,
    data?: T,
    error?: any,
}

export type LowStockProducts = { stock: number, minStock: number, id: number };

export type CartItem = Product & {
    quantity: number
}

export type ContextPage = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ range: string, name: string }>
}

export type RangeStats = 'today' | "week" | "month" | "year" 
