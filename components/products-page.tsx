"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Eye, Plus, Trash2 } from "lucide-react"
import { products } from "@/lib/data"
import { choose, variantStatus } from "@/lib/my-utils";

export function ProductsPage() {
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ categoryFilter, setCategoryFilter ] = useState("all")
    const [ nicotineFilter, setNicotineFilter ] = useState("all")
    const [ deviceTypeFilter, setDeviceTypeFilter ] = useState("all")
    const [ stockFilter, setStockFilter ] = useState("all")

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()
        const matchesNicotine = nicotineFilter === "all" || product.nicotineLevel === nicotineFilter
        const matchesDeviceType = deviceTypeFilter === "all" || product.type === deviceTypeFilter

        let matchesStock = true
        if (stockFilter === "available") {
            matchesStock = product.stock > 0
        } else if (stockFilter === "low") {
            matchesStock = product.stock <= product.minStock && product.stock > 0
        } else if (stockFilter === "out") {
            matchesStock = product.stock === 0
        }

        return matchesSearch && matchesCategory && matchesNicotine && matchesDeviceType && matchesStock
    })

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Katalog Produk</h1>
                <ModalProductTambah/>
            </div>


            {/* Products Table */ }
            <Card>
                {/* Filters */ }

                <CardHeader>
                    <CardTitle>Filter Produk</CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="flex items-end gap-5 flex-row flex-wrap md:flex-nowrap">
                        <div className="w-full">
                            <Label>Search</Label>
                            <Input
                                placeholder="Cari produk..."
                                // className="max-w-sm"
                                value={ searchTerm }
                                onChange={ (e) => setSearchTerm(e.target.value) }
                            />
                        </div>
                        <div className="flex-nowrap flex gap-5  w-full md:w-fit md:justify-end  ">
                            <div>
                                <Label>Kategori</Label>
                                <Select value={ categoryFilter } onValueChange={ setCategoryFilter }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua kategori"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="device">Device</SelectItem>
                                        <SelectItem value="liquid">Liquid</SelectItem>
                                        <SelectItem value="coil">Coil</SelectItem>
                                        <SelectItem value="aksesoris">Aksesoris</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Level Nikotin</Label>
                                <Select value={ nicotineFilter } onValueChange={ setNicotineFilter }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua level"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="0mg">0mg</SelectItem>
                                        <SelectItem value="3mg">3mg</SelectItem>
                                        <SelectItem value="6mg">6mg</SelectItem>
                                        <SelectItem value="12mg">12mg</SelectItem>
                                        <SelectItem value="25mg">25mg+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Tipe Device</Label>
                                <Select value={ deviceTypeFilter } onValueChange={ setDeviceTypeFilter }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua tipe"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="Pod System">Pod System</SelectItem>
                                        <SelectItem value="Mod">Mod</SelectItem>
                                        <SelectItem value="Disposable">Disposable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Status Stok</Label>
                                <Select value={ stockFilter } onValueChange={ setStockFilter }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="available">Tersedia</SelectItem>
                                        <SelectItem value="low">Stok Rendah</SelectItem>
                                        <SelectItem value="out">Habis</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>

                {/* Products Table */ }
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produk</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Stok</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { filteredProducts.map((product) => (
                                <TableRow key={ product.id }>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={ product.image || "/placeholder.svg" }
                                                alt={ product.name }
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{ product.name }</p>
                                                <p className="text-sm text-muted-foreground">{ product.description }</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ product.category }</TableCell>
                                    <TableCell>Rp { product.price.toLocaleString() }</TableCell>
                                    <TableCell>{ product.stock }</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                variantStatus({
                                                    destructive: product.stock === 0,
                                                    secondary: product.stock > 0 && product.stock <= product.minStock,
                                                    default: product.stock > product.minStock,
                                                })
                                            }
                                        >
                                            { choose(
                                                [ product.stock === 0, "Habis" ],
                                                [ product.stock <= product.minStock, "Stok Rendah" ],
                                                [ true, "Tersedia" ]
                                            ) }

                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-3 w-3"/>
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Edit className="h-3 w-3"/>
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Trash2 className="h-3 w-3"/>
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

function ModalProductTambah() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2"/>
                    Tambah Produk
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tambah Produk Baru</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Nama Produk</Label>
                        <Input placeholder="Nama produk"/>
                    </div>
                    <div>
                        <Label>Kategori</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="device">Device</SelectItem>
                                <SelectItem value="liquid">Liquid</SelectItem>
                                <SelectItem value="coil">Coil</SelectItem>
                                <SelectItem value="aksesoris">Aksesoris</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Harga</Label>
                        <Input type="number" placeholder="0"/>
                    </div>
                    <div>
                        <Label>Stok Awal</Label>
                        <Input type="number" placeholder="0"/>
                    </div>
                    <div>
                        <Label>Level Nikotin (untuk liquid)</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih level"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0mg">0mg</SelectItem>
                                <SelectItem value="3mg">3mg</SelectItem>
                                <SelectItem value="6mg">6mg</SelectItem>
                                <SelectItem value="12mg">12mg</SelectItem>
                                <SelectItem value="25mg">25mg (Salt Nic)</SelectItem>
                                <SelectItem value="50mg">50mg (Salt Nic)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Rasa (untuk liquid)</Label>
                        <Input placeholder="Rasa liquid"/>
                    </div>
                    <div className="col-span-2">
                        <Label>Deskripsi</Label>
                        <Textarea placeholder="Deskripsi produk"/>
                    </div>
                </div>
                <DialogFooter>
                    <Button>Simpan Produk</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ProductsPage;
