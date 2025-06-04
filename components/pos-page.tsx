"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, MinusIcon, Plus, PlusIcon, ShoppingCart, Trash2 } from "lucide-react"
import { Customer, Product } from "@prisma/client";
import { chooseStatus, formatRupiah, getStatusVariant, toastResponse } from "@/lib/my-utils";
import { CartItem } from "@/interface/actionType";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { createTransaction } from "@/action/sale-action";
import { Badge } from "@/components/ui/badge";
import { FormProvider, useForm } from "react-hook-form";
import { InputHook } from "@/components/form-hook";
import { CustomerModelNew, CustomerModelType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerNew } from "@/action/customer-action";

export function POSPage({ products, customers }: { customers: Customer[], products: Product[] }) {
    const [ cartItems, setCartItems ] = useState<CartItem[]>([])
    const [ selectedCustomer, setSelectedCustomer ] = useState<Customer | null>(null)
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ categoryFilter, setCategoryFilter ] = useState("all")
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(6);
    const [ loading, setLoading ] = useState(false)

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
                                    <SelectTrigger>
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
                                    <SelectTrigger>
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
                                { paginatedProducts.map((product) => {
                                    const cartItem = cartItems.find(item => item.id === product.id);
                                    const remainingStock = cartItem ? product.stock - cartItem.quantity : product.stock;

                                    return (
                                        <Card key={ product.id }
                                              className="cursor-pointer hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <picture>
                                                    <img
                                                        src={ product.image || "/placeholder.svg" }
                                                        alt={ product.name }
                                                        className="w-full h-40 object-cover rounded mb-2"
                                                    />
                                                </picture>
                                                <h3 className="font-medium text-sm mb-1">{ product.name }</h3>
                                                <p className="text-xs text-muted-foreground mb-2">{ product.category }</p>
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className="font-bold text-sm">{ formatRupiah(product.price) }</span>
                                                    <Button size="sm"
                                                            onClick={ () => addToCart(product) }
                                                            disabled={ remainingStock <= 0 }

                                                    >
                                                        <Plus className="h-3 w-3"/>
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">Stok: { remainingStock }</p>
                                            </CardContent>
                                        </Card>
                                    )
                                }) }
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
                                        { cartItems.map((product) => {

                                            const incrementItem = (id: number) => {
                                                setCartItems(prev =>
                                                    prev.map(item =>
                                                        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                                                    )
                                                );
                                            };

                                            const decrementItem = (id: number) => {
                                                setCartItems(prev =>
                                                    prev.map(item =>
                                                        item.id === id && item.quantity > 1
                                                            ? { ...item, quantity: item.quantity - 1 }
                                                            : item
                                                    )
                                                );
                                            };
                                            const getProductStock = (id: number) => {
                                                return products.find(product => product.id === id)?.stock || 0;
                                            };
                                            return (
                                                <div key={ product.id }
                                                     className="flex justify-between items-center py-2 border-b">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{ product.name }</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            { product.quantity } x { formatRupiah(product.price) }
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center space-x-2">

                                                        {/* Total price */ }
                                                        <span
                                                            className="font-medium text-sm">{ formatRupiah(product.price * product.quantity) }</span>


                                                        {/* Counter */ }
                                                        <div className="grid grid-cols-4 gap-2">
                                                            <Button
                                                                size={ 'sm' }
                                                                onClick={ () => decrementItem(product.id) }
                                                                disabled={ product.quantity <= 1 }
                                                            >
                                                                <MinusIcon/>
                                                            </Button>
                                                            <Button
                                                                size={ 'sm' }
                                                                variant={ 'ghost' }>{ product.quantity }</Button>
                                                            <Button
                                                                size={ 'sm' }
                                                                onClick={ () => incrementItem(product.id) }
                                                                disabled={ product.quantity >= getProductStock(product.id) }
                                                            >
                                                                <PlusIcon/>

                                                            </Button>

                                                            {/* Delete button */ }
                                                            <Button size="sm" variant="outline"
                                                                    onClick={ () => removeFromCart(product.id) }>
                                                                <Trash2 className="h-3 w-3"/>
                                                            </Button>
                                                        </div>


                                                    </div>
                                                </div>
                                            )
                                        }) }

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center font-bold">
                                                <span>Total:</span>
                                                <span>{ formatRupiah(getTotalCart()) }</span>
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
                                        <div className="">
                                            { selectedCustomer ? <div
                                                    className={ 'border rounded-xl p-2 flex  items-end justify-between' }>
                                                    <div className="">
                                                        <h1 className="font-medium">{ selectedCustomer.name }</h1>
                                                        <p className="text-sm text-muted-foreground">
                                                            Usia: { selectedCustomer.age } • Total
                                                            Belanja : <Badge
                                                            variant={ getStatusVariant(selectedCustomer.status) }>
                                                            { chooseStatus(selectedCustomer.status) }</Badge>
                                                        </p>
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        onClick={ () => setSelectedCustomer(null) }>
                                                        <MinusIcon/>
                                                    </Button>
                                                </div>
                                                : <SelectCustomer
                                                    customers={ customers }
                                                    onSelectAction={ (customer) => setSelectedCustomer(customer) }
                                                /> }

                                        </div>
                                        <Button className="w-full" size="lg"
                                                disabled={ loading }
                                                onClick={ async () => {
                                                    setLoading(true)
                                                    toastResponse({
                                                        response: await createTransaction(cartItems, selectedCustomer),
                                                        onSuccess: () => {
                                                            setLoading(false)
                                                            setSelectedCustomer(null)
                                                            setCartItems([])
                                                        }
                                                    })
                                                } }
                                        >
                                            <ShoppingCart
                                                className="h-4 w-4 mr-2"/>
                                            { loading ? "Loading ...." : 'Checkout' }
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

export function SelectCustomer(
    {
        customers,
        onSelectAction,
    }: {
        customers: Customer[];
        onSelectAction: (customer: Customer) => void;
    }) {
    const [ open, setOpen ] = useState(false);
    const [ search, setSearch ] = useState("");
    const [ loading, setLoading ] = useState(false)

    const filteredCustomers = useMemo(() => {
        return customers.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [ customers, search ]);

    const methods = useForm<CustomerModelType>({
        resolver: zodResolver(CustomerModelNew),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        setLoading(true)
        const response = await createCustomerNew(data)
        toastResponse({
                response,
                onSuccess: () => {
                    if (response.success && response.data) {
                        onSelectAction(response.data);
                        setOpen(false)
                        setLoading(false)
                    }
                }
            }
        )
        setLoading(false)
    });

    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                <Button>
                    Pilih Pelanggan
                    <Plus className="h-3 w-3 ml-2"/>
                </Button>
            </DialogTrigger>

            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Pilih Pelanggan</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-10">

                    <div className="space-y-4">

                        <Input
                            placeholder="Cari nama pelanggan..."
                            value={ search }
                            onChange={ (e) => setSearch(e.target.value) }
                        />

                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            { filteredCustomers.length === 0 && (
                                <p className="text-sm text-muted-foreground">Tidak ada pelanggan ditemukan.</p>
                            ) }

                            { filteredCustomers.map((customer) => (
                                <DialogClose asChild key={ customer.id }>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left h-14"
                                        onClick={ () => {
                                            onSelectAction?.(customer);
                                        } }
                                    >
                                        <div>
                                            <h1 className="font-medium">{ customer.name }</h1>
                                            <p className="text-sm text-muted-foreground">
                                                Usia: { customer.age } • Total: { customer.totalPurchase } • Status
                                                : <Badge
                                                variant={ getStatusVariant(customer.status) }>
                                                { chooseStatus(customer.status) }</Badge>
                                            </p>
                                        </div>
                                    </Button>
                                </DialogClose>
                            )) }
                        </div>
                    </div>


                    <div className="">


                        <FormProvider { ...methods }>
                            <form onSubmit={ onSubmit } className="grid gap-4">
                                <InputHook name="name" title="Tambah Pelangan Baru" placeholder="Nama pelanggan"/>
                                {/*<InputHook name="age" title="Umur" placeholder="0" type="number"/>*/ }
                                {/*<InputHook name="totalPurchase" title="Total Pembelian" placeholder="0" type="number"/>*/ }
                                {/*<InputDateHook name="lastPurchase" title="Tanggal Pembelian Terakhir"*/ }
                                {/*/>*/ }
                                {/*<SelectHook*/ }
                                {/*    name="status"*/ }
                                {/*    label="Status"*/ }
                                {/*    placeholder="Pilih status"*/ }
                                {/*    options={ [*/ }
                                {/*        { label: "Terverifikasi", value: "verified" },*/ }
                                {/*        { label: "Pending", value: "pending" },*/ }
                                {/*        { label: "Ditolak", value: "banned" },*/ }
                                {/*    ] }*/ }
                                {/*/>*/ }
                                <DialogFooter>
                                    <Button type="submit"
                                            disabled={ loading }
                                    >{ loading ? 'Loading...' : "Simpan" }
                                    </Button>
                                </DialogFooter>
                            </form>
                        </FormProvider>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    );
}
