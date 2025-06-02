export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  image: string
  description: string
  nicotineLevel: string | null
  flavor: string | null
  type: string
}

export interface SalesData {
  date: string
  total: number
  items: number
  customer: string
}

export interface PreOrder {
  id: number
  customer: string
  product: string
  quantity: number
  estimatedDate: string
  status: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "SMOK Nord 4",
    category: "Device",
    price: 450000,
    stock: 15,
    minStock: 5,
    image: "/placeholder.svg?height=100&width=100",
    description: "Pod system dengan kapasitas 2000mAh",
    nicotineLevel: null,
    flavor: null,
    type: "Pod System",
  },
  {
    id: 2,
    name: "Freebase Liquid - Strawberry",
    category: "Liquid",
    price: 85000,
    stock: 3,
    minStock: 10,
    image: "/placeholder.svg?height=100&width=100",
    description: "Liquid freebase rasa strawberry 60ml",
    nicotineLevel: "3mg",
    flavor: "Strawberry",
    type: "Freebase",
  },
  {
    id: 3,
    name: "Salt Nic - Mango Ice",
    category: "Liquid",
    price: 95000,
    stock: 25,
    minStock: 8,
    image: "/placeholder.svg?height=100&width=100",
    description: "Salt nicotine mango ice 30ml",
    nicotineLevel: "25mg",
    flavor: "Mango Ice",
    type: "Salt Nic",
  },
  {
    id: 4,
    name: "Mesh Coil 0.4ohm",
    category: "Coil",
    price: 45000,
    stock: 2,
    minStock: 15,
    image: "/placeholder.svg?height=100&width=100",
    description: "Mesh coil replacement 0.4ohm",
    nicotineLevel: null,
    flavor: null,
    type: "Mesh",
  },
  {
    id: 5,
    name: "Vape Case Premium",
    category: "Aksesoris",
    price: 125000,
    stock: 8,
    minStock: 3,
    image: "/placeholder.svg?height=100&width=100",
    description: "Case premium untuk vape device",
    nicotineLevel: null,
    flavor: null,
    type: "Case",
  },
]

export const salesData: SalesData[] = [
  { date: "2024-01-15", total: 2450000, items: 18, customer: "Ahmad S." },
  { date: "2024-01-14", total: 1890000, items: 12, customer: "Budi P." },
  { date: "2024-01-13", total: 3200000, items: 24, customer: "Citra M." },
  { date: "2024-01-12", total: 1650000, items: 9, customer: "Deni R." },
]

export const preOrders: PreOrder[] = [
  { id: 1, customer: "Eko W.", product: "SMOK RPM 5", quantity: 2, estimatedDate: "2024-01-20", status: "Pending" },
  {
    id: 2,
    customer: "Fitri N.",
    product: "Premium Liquid Bundle",
    quantity: 1,
    estimatedDate: "2024-01-18",
    status: "Confirmed",
  },
]
