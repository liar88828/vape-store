"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Eye, Pencil, Plus, Trash2, XIcon } from "lucide-react"
import { choose, formatRupiah, getValueLabel, toastResponse, truncateText, variantStatus } from "@/lib/my-utils";
import { Product } from "@/lib/data";
import { InputHook, SelectHook, TextareaHook } from "@/components/form-hook";
import { FormProvider, useForm } from "react-hook-form";
import { ProductModel, } from "@/lib/generated/zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { addProduct, deleteProduct, updateProduct } from "@/action/product-action";
import { toast } from "sonner";
import { ProductModelType } from "@/lib/schema";

interface ProductsPageProps {
    products: Product[]
}

export function ProductsPage({ products }: ProductsPageProps) {
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ categoryFilter, setCategoryFilter ] = useState("all")
    const [ nicotineFilter, setNicotineFilter ] = useState("all")
    const [ deviceTypeFilter, setDeviceTypeFilter ] = useState("all")
    const [ stockFilter, setStockFilter ] = useState("all")

    const onReset = () => {
        setSearchTerm("")
        setNicotineFilter("all")
        setCategoryFilter("all")
        setDeviceTypeFilter("all")
        setStockFilter("all")
    }

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

                    <div className="flex items-end gap-2 flex-row flex-wrap md:flex-nowrap lg:justify-between">
                        <div className="w-full md:max-w-lg">
                            <Label>Search</Label>
                            <Input
                                placeholder="Cari produk..."
                                // className="max-w-sm"
                                value={ searchTerm }
                                onChange={ (e) => setSearchTerm(e.target.value) }
                            />
                        </div>
                        <div className="sm:flex-nowrap flex gap-2  w-full md:w-fit md:justify-end flex-wrap  ">
                            <div>
                                <Label>Kategori</Label>
                                <Select

                                    value={ categoryFilter } onValueChange={ setCategoryFilter }>
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
                            <div>
                                <Label>Reset</Label>
                                <Button onClick={ onReset }> <XIcon/> </Button>
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
                                <TableRow
                                    key={ product.id }
                                    // className={twMerge(
                                    //     clsx(
                                    //         product.stock === 0 && "bg-red-50",
                                    //         product.stock > 0 && product.stock <= product.minStock && "bg-yellow-100/20",
                                    //         product.stock > product.minStock && "bg-green-50"
                                    //     )
                                    // )}
                                >
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <picture>
                                                <img
                                                    src={ product.image }
                                                    alt={ product.name }
                                                    className="min-w-10 h-10 rounded object-cover"
                                                />
                                            </picture>
                                            <div>
                                                <p className="font-medium">{ product.name }</p>
                                                <p className="text-sm text-muted-foreground">{ truncateText(product.description, 10) }</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ product.category }</TableCell>
                                    <TableCell>{ formatRupiah(product.price) }</TableCell>
                                    <TableCell>{ getValueLabel(product.stock) }</TableCell>
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
                                            <ProductDetailDialog product={ product }/>
                                            <ModalProductUpdate product={ product }/>

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

export function ModalProductTambah() {
    const [ open, setOpen ] = useState(false);

    const methods = useForm<ProductModelType>({
        resolver: zodResolver(ProductModel),
        defaultValues: {
            id: 0,
            name: "",
            category: "device",
            price: 0,
            stock: 0,
            minStock: 5,
            image: "https://picsum.photos/200/300",
            description: "-",
            nicotineLevel: '0mg',
            flavor: '-',
            type: "Pod System",
        }
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        // console.log(data)
        const response = await addProduct(data);
        if (response.success) {
            toast(response.message);
            setOpen(false); // ✅ Close the dialog
        } else {
            toast("You submitted the following values", {
                description: (
                    <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                        <code className="text-white">{ JSON.stringify(data, null, 2) }</code>
                    </pre>
                )
            })
        }
    });
    // console.log(methods.formState.errors)
    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
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

                <FormProvider { ...methods }>
                    <form onSubmit={ onSubmit } className={ 'space-y-4' }>
                        <div className="grid grid-cols-2 gap-4">
                            <InputHook title="Nama Produk" name="name" placeholder="Nama produk"/>

                            <SelectHook
                                name="category"
                                label="Kategori"
                                placeholder="Pilih kategori"
                                options={ [
                                    { label: "Device", value: "device" },
                                    { label: "Liquid", value: "liquid" },
                                    { label: "Coil", value: "coil" },
                                    { label: "Aksesoris", value: "aksesoris" },
                                ] }
                            />

                            <InputHook name="price" title="Harga" placeholder="0" type="number"/>
                            <InputHook name="stock" title="Stok Awal" placeholder="0" type="number"/>
                            <InputHook name="minStock" title="Minimum Stok" placeholder="0" type="number"/>

                            <SelectHook
                                name="nicotineLevel"
                                label="Level Nikotin (untuk liquid)"
                                placeholder="Pilih level"
                                options={ [
                                    { label: "0mg", value: "0mg" },
                                    { label: "3mg", value: "3mg" },
                                    { label: "6mg", value: "6mg" },
                                    { label: "12mg", value: "12mg" },
                                    { label: "25mg (Salt Nic)", value: "25mg" },
                                    { label: "50mg (Salt Nic)", value: "50mg" },
                                ] }
                            />

                            <InputHook name="flavor" title="Rasa (untuk liquid)" placeholder="Rasa liquid"/>

                            <SelectHook
                                name="type"
                                label="Tipe Device"
                                placeholder="Tipe Device"
                                options={ [
                                    { label: "Pod System", value: "Pod System" },
                                    { label: "Mod", value: "Mod" },
                                    { label: "Disposable", value: "Disposable" },
                                ] }
                            />
                            {/* <InputHook name="type" title="Tipe Produk" placeholder="Tipe produk" /> */ }


                        </div>
                        <InputHook name="image" title="URL Gambar" placeholder="Link gambar produk" type="text"/>
                        <TextareaHook name="description" title="Deskripsi" placeholder="Deskripsi produk"/>
                        <DialogFooter className="pt-4">
                            <Button type="submit">Simpan Produk</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

export function ProductDetailDialog({ product }: { product: Product }) {

    function DetailItem({ label, value }: { label: string; value: string | number }) {
        return (
            <div className="flex flex-col">
                <span className="text-muted-foreground">{ label }</span>
                <span className="font-medium">{ value }</span>
            </div>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl sm:rounded-2xl shadow-lg">
                <DialogTitle className="text-2xl font-semibold">{ product.name }</DialogTitle>
                <DialogDescription className="mb-4 text-sm text-muted-foreground">
                    Kategori: <span className="font-medium text-primary">{ product.category }</span>
                </DialogDescription>

                <div className="space-y-6">
                    <div className="">
                        <picture>
                            <img
                                src={ product.image }
                                alt={ product.name }
                                className="w-full h-80 object-cover rounded-xl border"
                            />
                        </picture>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <DetailItem label="Harga" value={ `Rp ${ product.price.toLocaleString() }` }/>
                        <DetailItem label="Stok" value={ product.stock }/>
                        <DetailItem label="Minimum Stok" value={ product.minStock }/>
                        <DetailItem label="Tipe Produk" value={ product.type }/>
                        { product.nicotineLevel && (
                            <DetailItem label="Level Nikotin" value={ product.nicotineLevel }/>
                        ) }
                        { product.flavor && (
                            <DetailItem label="Rasa" value={ product.flavor }/>
                        ) }
                    </div>

                    <div>
                        <h4 className="font-medium text-base mb-1">Deskripsi</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ product.description }</p>
                    </div>
                </div>
                <div className="flex items-end gap-2 justify-end">

                    <DialogClose asChild>
                        <Button variant="outline"
                                className="min-w-24"
                                onClick={ async () => {
                                    if (confirm('Are you Sure to Delete ?')) {
                                        toastResponse({ response: await deleteProduct(product.id) })
                                    }
                                } }
                        >
                            Hapus <Trash2 className="h-3 w-3"/>
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="default" className="min-w-24">
                            Tutup
                        </Button>
                    </DialogClose>
                </div>

            </DialogContent>
        </Dialog>
    );
}

export function ModalProductUpdate({ product }: { product: ProductModelType }) {
    const [ open, setOpen ] = useState(false);

    const methods = useForm<ProductModelType>({
        resolver: zodResolver(ProductModel),
        defaultValues: product,
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        const response = await updateProduct(data);
        if (response.success) {
            toast.success(response.message);
            setOpen(false); // ✅ Close the dialog
        } else {
            toast.error(response.message, {
                description: (
                    <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                        <code className="text-white">{ JSON.stringify(data, null, 2) }</code>
                    </pre>
                ),
            });
        }
    });
    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Pencil className="h-3 w-3"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Perbarui Produk</DialogTitle>
                </DialogHeader>

                <FormProvider { ...methods }>
                    <form onSubmit={ onSubmit } className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputHook title="Nama Produk" name="name" placeholder="Nama produk"/>

                            <SelectHook
                                name="category"
                                label="Kategori"
                                placeholder="Pilih kategori"
                                options={ [
                                    { label: "Device", value: "device" },
                                    { label: "Liquid", value: "liquid" },
                                    { label: "Coil", value: "coil" },
                                    { label: "Aksesoris", value: "aksesoris" },
                                ] }
                            />

                            <InputHook name="price" title="Harga" placeholder="0" type="number"/>
                            <InputHook name="stock" title="Stok Awal" placeholder="0" type="number"/>
                            <InputHook name="minStock" title="Minimum Stok" placeholder="0" type="number"/>

                            <SelectHook
                                name="nicotineLevel"
                                label="Level Nikotin (untuk liquid)"
                                placeholder="Pilih level"
                                options={ [
                                    { label: "0mg", value: "0mg" },
                                    { label: "3mg", value: "3mg" },
                                    { label: "6mg", value: "6mg" },
                                    { label: "12mg", value: "12mg" },
                                    { label: "25mg (Salt Nic)", value: "25mg" },
                                    { label: "50mg (Salt Nic)", value: "50mg" },
                                ] }
                            />

                            <InputHook name="flavor" title="Rasa (untuk liquid)" placeholder="Rasa liquid"/>
                            <InputHook name="type" title="Tipe Produk" placeholder="Tipe produk"/>
                        </div>

                        <InputHook name="image" title="URL Gambar" placeholder="Link gambar produk" type="text"/>
                        <TextareaHook name="description" title="Deskripsi" placeholder="Deskripsi produk"/>

                        <DialogFooter className="pt-4">
                            <Button type="submit">Perbarui Produk</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}