"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Clock, DollarSign, Package, ShoppingCart, Star, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { formatDateIndo, formatRupiah, formatRupiahShort } from "@/lib/my-utils";
import { Product } from "@prisma/client";
import { LastBuyer } from "@/action/sale-action";
import { cn } from "@/lib/utils"
import { twMerge } from "tailwind-merge"

interface DashboardPageProps {
    topSelling: Product[],
    lastBuyer: LastBuyer[],
    preOrders: number,
    lowStockProducts: Product[],
    todayVsYesterdaySales: {
        todayTotal: number;
        percentChange: number
    }
}

export function DashboardPage({
                                  topSelling,
                                  lastBuyer,
                                  preOrders,
                                  lowStockProducts,
                                  todayVsYesterdaySales
                              }: DashboardPageProps) {

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className={ twMerge("text-3xl font-bold text-gray-900", "dark:text-gray-100") }>Dashboard</h1>
                    <p className={ twMerge("text-gray-600 mt-1", "dark:text-gray-400") }>
                        Selamat datang di VapeStore Management System
                    </p>
                </div>
                <Button asChild>
                    <Link href="/pos">
                        <ShoppingCart className="mr-2 h-4 w-4"/>
                        Buka POS
                    </Link>
                </Button>
            </div>

            {/* Alert untuk stok rendah */ }
            { lowStockProducts.length > 0 && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4"/>
                    <AlertTitle>Peringatan Stok Rendah!</AlertTitle>
                    <AlertDescription>
                        { lowStockProducts.length } produk memiliki stok di bawah minimum.
                        <Button variant="link" className="p-0 h-auto ml-2" asChild>
                            <Link href="/inventory">Lihat detail</Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            ) }

            {/* Stats Cards */ }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Card 1 - Penjualan Hari Ini */ }
                <Card
                    className={ twMerge("relative overflow-hidden", "dark:bg-gray-900 dark:border dark:border-gray-700") }>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={ twMerge("text-sm font-medium text-gray-900", "dark:text-gray-100") }>Penjualan
                            Hari Ini</CardTitle>
                        <div className={ twMerge("p-2 rounded-lg bg-green-100", "dark:bg-green-900") }>
                            <DollarSign className={ twMerge("h-4 w-4 text-green-600", "dark:text-green-400") }/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={ twMerge("text-2xl font-bold text-gray-900", "dark:text-gray-100") }>
                            { formatRupiahShort(todayVsYesterdaySales.todayTotal) }
                        </div>
                        <div
                            className={ cn(
                                "flex items-center mt-2",
                                {
                                    "text-green-600 dark:text-green-400": todayVsYesterdaySales.percentChange > 0,
                                    "text-red-600 dark:text-red-400": todayVsYesterdaySales.percentChange < 0,
                                }
                            ) }
                        >
                            <TrendingUp className={ twMerge("h-3 w-3 mr-1") }/>
                            <p className="text-xs font-medium">
                                { (todayVsYesterdaySales.percentChange).toFixed(1) }% dari kemarin
                            </p>
                        </div>
                    </CardContent>
                    <div
                        className={ twMerge("absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -mr-10 -mt-10", "dark:bg-green-900/30") }></div>
                </Card>

                {/* Card 2 - Total Produk */ }
                <Card
                    className={ twMerge("relative overflow-hidden", "dark:bg-gray-900 dark:border dark:border-gray-700") }>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={ twMerge("text-sm font-medium text-gray-900", "dark:text-gray-100") }>Total
                            Produk</CardTitle>
                        <div className={ twMerge("p-2 bg-blue-100 rounded-lg", "dark:bg-blue-900") }>
                            <Package className={ twMerge("h-4 w-4 text-blue-600", "dark:text-blue-400") }/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={ twMerge("text-2xl font-bold text-gray-900", "dark:text-gray-100") }>{ topSelling.length }</div>
                        <p className={ twMerge("text-xs text-gray-600 mt-2", "dark:text-gray-400") }>5 kategori
                            tersedia</p>
                    </CardContent>
                    <div
                        className={ twMerge("absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10", "dark:bg-blue-900/30") }></div>
                </Card>

                {/* Card 3 - Stok Rendah */ }
                <Card
                    className={ twMerge("relative overflow-hidden", "dark:bg-gray-900 dark:border dark:border-gray-700") }>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={ twMerge("text-sm font-medium text-red-600", "dark:text-red-400") }>Stok
                            Rendah</CardTitle>
                        <div className={ twMerge("p-2 bg-red-100 rounded-lg", "dark:bg-red-900") }>
                            <AlertTriangle className={ twMerge("h-4 w-4 text-red-600", "dark:text-red-400") }/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={ twMerge("text-2xl font-bold text-red-600", "dark:text-red-400") }>{ lowStockProducts.length }</div>
                        <p className={ twMerge("text-xs text-red-600 mt-2", "dark:text-red-400") }>Perlu reorder
                            segera</p>
                    </CardContent>
                    <div
                        className={ twMerge("absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full -mr-10 -mt-10", "dark:bg-red-900/30") }></div>
                </Card>

                {/* Card 4 - Pre-Order */ }
                <Card
                    className={ twMerge("relative overflow-hidden", "dark:bg-gray-900 dark:border dark:border-gray-700") }>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle
                            className={ twMerge("text-sm font-medium text-gray-900", "dark:text-gray-100") }>Pre-Order</CardTitle>
                        <div className={ twMerge("p-2 bg-orange-100 rounded-lg", "dark:bg-orange-900") }>
                            <Clock className={ twMerge("h-4 w-4 text-orange-600", "dark:text-orange-400") }/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={ twMerge("text-2xl font-bold text-gray-900", "dark:text-gray-100") }>{ preOrders }</div>
                        <p className={ twMerge("text-xs text-gray-600 mt-2", "dark:text-gray-400") }>Menunggu
                            konfirmasi</p>
                    </CardContent>
                    <div
                        className={ twMerge("absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-full -mr-10 -mt-10", "dark:bg-orange-900/30") }></div>
                </Card>

            </div>

            {/* Main Content Grid */ }
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Sales */ }
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Penjualan Terbaru</CardTitle>
                            <CardDescription className="mt-1"> Transaksi hari ini </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/reports">Lihat Semua</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            { lastBuyer.map((sale, index) => (
                                <div
                                    key={ index }
                                    className={ twMerge(
                                        "flex items-center justify-between p-3 bg-gray-50 rounded-lg",
                                        "dark:bg-gray-800"
                                    ) }
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400"/>
                                        </div>
                                        <div>
                                            <p className={ twMerge("font-medium text-gray-900", "dark:text-gray-100") }>
                                                { sale.name }
                                            </p>
                                            <p className={ twMerge("text-sm text-gray-600", "dark:text-gray-400") }>
                                                { sale.Sales.length } items • { formatDateIndo(sale.lastPurchase) }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={ twMerge("font-bold text-gray-900", "dark:text-gray-100") }>
                                            { formatRupiah(sale.totalPurchase) }
                                        </p>
                                        <Badge variant="default">
                                            Selesai
                                        </Badge>
                                    </div>
                                </div>
                            )) }
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */ }
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription> Aksi cepat untuk operasional </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start" asChild>
                            <Link href="/pos">
                                <ShoppingCart className="mr-2 h-4 w-4"/>
                                Buka POS Kasir
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/products">
                                <Package className="mr-2 h-4 w-4"/>
                                Tambah Produk
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/inventory">
                                <AlertTriangle className="mr-2 h-4 w-4"/>
                                Cek Stok Rendah
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/customers">
                                <Users className="mr-2 h-4 w-4"/>
                                Kelola Pelanggan
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Grid */ }
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Products */ }
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center">
                                <AlertTriangle className="h-5 w-5 text-red-500 mr-2"/>
                                Stok Rendah
                            </CardTitle>
                            <CardDescription className="mt-1">Produk yang perlu direstock</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/inventory">Kelola</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            { lowStockProducts.length === 0 ? (
                                <div className="text-center py-6">
                                    <Package className="h-12 w-12 mx-auto mb-3"/>
                                    <p className={ twMerge("text-gray-500", "dark:text-gray-400") }>
                                        Semua produk stok aman
                                    </p>
                                </div>
                            ) : (
                                lowStockProducts.slice(0, 4).map((product) => (
                                    <div
                                        key={ product.id }
                                        className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <picture>
                                                <img
                                                    src={ product.image || "/placeholder.svg" }
                                                    alt={ product.name }
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                            </picture>
                                            <div>
                                                <p className="font-medium text-gray-900">{ product.name }</p>
                                                <p className="text-sm text-gray-600">{ product.category }</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="destructive" className="mb-1">
                                                { product.stock } tersisa
                                            </Badge>
                                            <p className="text-xs text-gray-600">Min: { product.minStock }</p>
                                        </div>
                                    </div>
                                ))
                            ) }
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */ }
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Star className="h-5 w-5 text-yellow-500 mr-2"/>
                            Produk Terlaris
                        </CardTitle>
                        <CardDescription>Berdasarkan penjualan bulan ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            { topSelling.slice(0, 4).map((product, index) => (
                                <div
                                    key={ product.id }
                                    className={ twMerge(
                                        "flex items-center justify-between p-3 bg-gray-50 rounded-lg",
                                        "dark:bg-gray-800"
                                    ) }
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={ twMerge(
                                                "w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center",
                                                "dark:bg-yellow-900"
                                            ) }
                                        >
                                            <span
                                                className={ twMerge(
                                                    "text-sm font-bold text-yellow-600",
                                                    "dark:text-yellow-400"
                                                ) }
                                            >
                                                #{ index + 1 }
                                            </span>
                                        </div>
                                        <picture>
                                            <img
                                                src={ product.image || "/placeholder.svg" }
                                                alt={ product.name }
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        </picture>
                                        <div>
                                            <p
                                                className={ twMerge(
                                                    "font-medium text-gray-900",
                                                    "dark:text-gray-100"
                                                ) }
                                            >
                                                { product.name }
                                            </p>
                                            <p
                                                className={ twMerge(
                                                    "text-sm text-gray-600",
                                                    "dark:text-gray-400"
                                                ) }
                                            >
                                                { product.category }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={ twMerge(
                                                "font-bold text-gray-900",
                                                "dark:text-gray-100"
                                            ) }
                                        >
                                            12312 terjual
                                        </p>
                                        <p
                                            className={ twMerge(
                                                "text-sm text-gray-600",
                                                "dark:text-gray-400"
                                            ) }
                                        >
                                            Rp { product.price.toLocaleString() }
                                        </p>
                                    </div>
                                </div>
                            )) }
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
