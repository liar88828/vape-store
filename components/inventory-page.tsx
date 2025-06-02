"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, Plus, XCircle } from "lucide-react"
import { preOrders, Product, products } from "@/lib/data"
import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function InventoryPage() {
    const lowStockProducts = products.filter((p) => p.stock <= p.minStock)

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manajemen Inventori</h1>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <AlertTriangle className="h-4 w-4 mr-2"/>
                        Reorder Alert
                    </Button>

                    <StockModal products={ products }/>
                </div>
            </div>

            {/* Inventory Stats */ }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Nilai Inventori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 15.750.000</div>
                        <p className="text-sm text-muted-foreground">Berdasarkan harga beli</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Produk Perlu Reorder</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{ lowStockProducts.length }</div>
                        <p className="text-sm text-muted-foreground">Di bawah minimum stok</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pre-Order Aktif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ preOrders.length }</div>
                        <p className="text-sm text-muted-foreground">Menunggu kedatangan</p>
                    </CardContent>
                </Card>
            </div>

            {/* Low Stock Alert */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2"/>
                        Produk Stok Rendah
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produk</TableHead>
                                <TableHead>Stok Saat Ini</TableHead>
                                <TableHead>Minimum Stok</TableHead>
                                <TableHead>Perlu Reorder</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { lowStockProducts.map((product) => (
                                <TableRow key={ product.id }>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={ product.image || "/placeholder.svg" }
                                                alt={ product.name }
                                                className="w-8 h-8 rounded object-cover"
                                            />
                                            <span className="font-medium">{ product.name }</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="destructive">{ product.stock }</Badge>
                                    </TableCell>
                                    <TableCell>{ product.minStock }</TableCell>
                                    <TableCell>{ product.minStock - product.stock + 10 }</TableCell>
                                    <TableCell>
                                        <ReStockModal product={ product }/>
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pre-Orders */ }
            <Card>
                <CardHeader>
                    <CardTitle>Pre-Order Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Produk</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Estimasi Kedatangan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { preOrders.map((order) => (
                                <TableRow key={ order.id }>
                                    <TableCell>{ order.customer }</TableCell>
                                    <TableCell>{ order.product }</TableCell>
                                    <TableCell>{ order.quantity }</TableCell>
                                    <TableCell>{ order.estimatedDate }</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={ order.status === "Confirmed" ? "default" : "secondary" }>{ order.status }</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline">
                                                <CheckCircle className="h-3 w-3"/>
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <XCircle className="h-3 w-3"/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>


        </div>
    )
}

function ReStockModal({ product }: { product: Product }) {
    const [ isStockModalOpen, setIsStockModalOpen ] = useState(false)
    const [ stockQty, setStockQty ] = useState("")
    const [ productToAddStock, setProductToAddStock ] = useState<Product | null>(null)

    return (
        <Dialog open={ isStockModalOpen } onOpenChange={ setIsStockModalOpen }>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    onClick={ () => {
                        setProductToAddStock(product)
                        setIsStockModalOpen(true)
                    } }
                >
                    Reorder
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Stok</DialogTitle>
                </DialogHeader>

                { productToAddStock && (
                    <div className="space-y-4">
                        <p>Produk: <strong>{ productToAddStock.name }</strong></p>
                        <div>
                            <Label htmlFor="stock">Jumlah Tambahan</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={ stockQty }
                                onChange={ (e) => setStockQty(e.target.value) }
                            />
                        </div>
                    </div>
                ) }

                <DialogFooter>
                    <Button
                        onClick={ () => {
                            const amount = parseInt(stockQty)
                            if (!isNaN(amount) && productToAddStock) {
                                productToAddStock.stock += amount
                                alert(`Stok ${ productToAddStock.name } ditambah ${ amount }`)
                                setIsStockModalOpen(false)
                                setStockQty("")
                                setProductToAddStock(null)
                            }
                        } }
                        disabled={ !stockQty }
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
}

export default function StockModal({ products }: { products: Product[] }) {
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ stockAmount, setStockAmount ] = useState("")
    const [ selectedProductId, setSelectedProductId ] = useState<string>('')

    const handleSubmit = () => {
        const product = products.find((p) => p.id === Number(selectedProductId))
        const amount = parseInt(stockAmount)

        if (product && !isNaN(amount)) {
            product.stock += amount
            alert(`Stok ${ product.name } ditambah ${ amount }`)
            setIsModalOpen(false)
            setStockAmount("")
            setSelectedProductId('')
        }
    }

    return (
        <Dialog open={ isModalOpen } onOpenChange={ setIsModalOpen }>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2"/>
                    Tambah Stok
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Stok Produk</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="product">Pilih Produk</Label>
                        <Select onValueChange={ (value) => setSelectedProductId(value) }>
                            <SelectTrigger id="product">
                                <SelectValue placeholder="Pilih Produk"/>
                            </SelectTrigger>
                            <SelectContent>
                                { products.map((product) => (
                                    <SelectItem key={ product.id } value={ String(product.id) }>
                                        { product.name }
                                    </SelectItem>
                                )) }
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="stock">Jumlah Stok</Label>
                        <Input
                            id="stock"
                            type="number"
                            value={ stockAmount }
                            onChange={ (e) => setStockAmount(e.target.value) }
                        />
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button
                        onClick={ handleSubmit }
                        disabled={ !selectedProductId || !stockAmount }
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
