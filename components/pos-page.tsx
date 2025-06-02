"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Plus, ShoppingCart, Trash2 } from "lucide-react"
import type { Product } from "@/lib/data"

interface CartItem extends Product {
    quantity: number
}

export function POSPage({ products }: { products: Product[] }) {
    const [ cartItems, setCartItems ] = useState<CartItem[]>([])
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ categoryFilter, setCategoryFilter ] = useState("all")
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(6);

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()
        return matchesSearch && matchesCategory
    })

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const addToCart = (product: Product) => {
        const existingItem = cartItems.find((item) => item.id === product.id)
        if (existingItem) {
            setCartItems(cartItems.map((item) => (item.id === product.id ? {
                ...item,
                quantity: item.quantity + 1
            } : item)))
        } else {
            setCartItems([ ...cartItems, { ...product, quantity: 1 } ])
        }
    }

    const removeFromCart = (productId: number) => {
        setCartItems(cartItems.filter((item) => item.id !== productId))
    }

    const getTotalCart = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">POS Kasir</h1>

            <div className="grid grid-cols-1    xl:grid-cols-3 gap-6">
                {/* Product Selection */ }
                <div className="lg:col-span-2 ">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pilih Produk</CardTitle>
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Cari produk..."
                                    className="flex-1"
                                    value={ searchTerm }
                                    onChange={ (e) => setSearchTerm(e.target.value) }
                                />
                                <Select value={ categoryFilter } onValueChange={ setCategoryFilter }>
                                    <SelectTrigger >
                                        <SelectValue placeholder="Kategori"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="device">Device</SelectItem>
                                        <SelectItem value="liquid">Liquid</SelectItem>
                                        <SelectItem value="coil">Coil</SelectItem>
                                        <SelectItem value="aksesoris">Aksesoris</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={ String(itemsPerPage) } onValueChange={ (value) => {
                                    setItemsPerPage(Number(value));
                                    setCurrentPage(1); // Reset ke halaman pertama
                                } }>
                                    <SelectTrigger >
                                        <SelectValue placeholder="Tampil"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6">6</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="15">15</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    disabled={ currentPage === 1 }
                                    onClick={ () => setCurrentPage((prev) => prev - 1) }
                                >
                                    <ChevronLeft/>
                                </Button>

                                {/*just for text*/ }
                                <Button variant="outline" disabled={ true }>
                                    { currentPage } / { totalPages }
                                </Button>

                                <Button
                                    variant="outline"
                                    disabled={ currentPage === totalPages }
                                    onClick={ () => setCurrentPage((prev) => prev + 1) }
                                >
                                    <ChevronRight/>

                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>

                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                                { paginatedProducts.map((product) => (
                                    <Card key={ product.id }
                                          className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <img
                                                src={ product.image || "/placeholder.svg" }
                                                alt={ product.name }
                                                className="w-full h-40 object-cover rounded mb-2"
                                            />
                                            <h3 className="font-medium text-sm mb-1">{ product.name }</h3>
                                            <p className="text-xs text-muted-foreground mb-2">{ product.category }</p>
                                            <div className="flex justify-between items-center">
                                                <span
                                                    className="font-bold text-sm">Rp { product.price.toLocaleString() }</span>
                                                <Button size="sm" onClick={ () => addToCart(product) }
                                                        disabled={ product.stock === 0 }>
                                                    <Plus className="h-3 w-3"/>
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Stok: { product.stock }</p>
                                        </CardContent>
                                    </Card>
                                )) }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cart & Checkout */ }
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Keranjang Belanja</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                { cartItems.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">Keranjang kosong</p>
                                ) : (
                                    <>
                                        { cartItems.map((item) => (
                                            <div key={ item.id } className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{ item.name }</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        { item.quantity } x Rp { item.price.toLocaleString() }
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        className="font-medium">Rp { (item.price * item.quantity).toLocaleString() }</span>
                                                    <Button size="sm" variant="outline"
                                                            onClick={ () => removeFromCart(item.id) }>
                                                        <Trash2 className="h-3 w-3"/>
                                                    </Button>
                                                </div>
                                            </div>
                                        )) }

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center font-bold">
                                                <span>Total:</span>
                                                <span>Rp { getTotalCart().toLocaleString() }</span>
                                            </div>
                                        </div>

                                        {/* Age Verification */ }
                                        <div className="border-t pt-4">
                                            <Label className="text-sm font-medium">Verifikasi Umur</Label>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <Checkbox id="age-verify"/>
                                                <Label htmlFor="age-verify" className="text-sm">
                                                    Pembeli berusia 18+ tahun
                                                </Label>
                                            </div>
                                        </div>

                                        <Button className="w-full" size="lg">
                                            <ShoppingCart className="h-4 w-4 mr-2"/>
                                            Checkout
                                        </Button>
                                    </>
                                ) }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
