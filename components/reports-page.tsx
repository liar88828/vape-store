"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Eye, Gift, Percent, ReceiptText } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { formatDateIndo, formatRupiah } from "@/lib/my-utils";
import { SalesDataModal } from "@/lib/data";
import { SaleCustomers } from "@/action/sale-action";

interface ReportsPageProps {
    sales: SaleCustomers[],
}

export function ReportsPage({ sales }: ReportsPageProps) {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Laporan Penjualan</h1>
                <div className="flex space-x-2">
                    <Select defaultValue="month">
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Periode"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hari Ini</SelectItem>
                            <SelectItem value="week">Minggu Ini</SelectItem>
                            <SelectItem value="month">Bulan Ini</SelectItem>
                            <SelectItem value="year">Tahun Ini</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <BarChart3 className="h-4 w-4 mr-2"/>
                        Export
                    </Button>
                </div>
            </div>

            {/* Sales Summary */ }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Penjualan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 12.450.000</div>
                        <p className="text-sm text-green-600">+15% dari bulan lalu</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-sm text-green-600">+8% dari bulan lalu</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rata-rata Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 79.800</div>
                        <p className="text-sm text-green-600">+3% dari bulan lalu</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Produk Terlaris</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">Salt Nic Liquid</div>
                        <p className="text-sm text-muted-foreground">45 unit terjual</p>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Chart Placeholder */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Grafik Penjualan Bulanan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                        <p className="text-muted-foreground">Grafik penjualan akan ditampilkan di sini</p>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Sales */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Detail Penjualan</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Metode Bayar</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { sales.map((sale, index) => (
                                <TableRow key={ index }>
                                    <TableCell>{ formatDateIndo(sale.date) }</TableCell>
                                    <TableCell>{ sale.customer.name }</TableCell>
                                    <TableCell>{ sale.items }</TableCell>
                                    <TableCell>{ formatRupiah(sale.total) }</TableCell>
                                    <TableCell>Cash</TableCell>
                                    <TableCell>
                                        <Badge variant="default">Selesai</Badge>
                                    </TableCell>
                                    <TableCell className={ 'space-x-2' }>
                                        <ModalSalesDetail sale={ sale }/>
                                        {/*<ModalInvoice data={ customers }/>*/ }
                                    </TableCell>

                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Discount & Promo Settings */ }
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Percent className="h-5 w-5 mr-2"/>
                        Pengaturan Diskon & Promo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium mb-4">Promo Aktif</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 border rounded">
                                    <div>
                                        <p className="font-medium">Buy 2 Get 1 Liquid</p>
                                        <p className="text-sm text-muted-foreground">Berlaku untuk semua liquid</p>
                                    </div>
                                    <Badge variant="default">Aktif</Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 border rounded">
                                    <div>
                                        <p className="font-medium">Diskon 15% Device</p>
                                        <p className="text-sm text-muted-foreground">Minimal pembelian Rp 500.000</p>
                                    </div>
                                    <Badge variant="secondary">Nonaktif</Badge>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-4">Buat Promo Baru</h3>
                            <div className="space-y-3">
                                <div>
                                    <Label>Nama Promo</Label>
                                    <Input placeholder="Nama promo"/>
                                </div>
                                <div>
                                    <Label>Tipe Diskon</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tipe"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Persentase</SelectItem>
                                            <SelectItem value="fixed">Nominal Tetap</SelectItem>
                                            <SelectItem value="bogo">Buy One Get One</SelectItem>
                                            <SelectItem value="bundle">Bundle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full">
                                    <Gift className="h-4 w-4 mr-2"/>
                                    Buat Promo
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export function ModalSalesDetail({ sale }: { sale: SaleCustomers }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Transaksi</DialogTitle>
                    <DialogDescription>
                        Transaksi oleh { sale.customer.name } pada { formatDateIndo(sale.date) }
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                    <p><strong>Nama Pelanggan:</strong> { sale.customer.name }</p>
                    <p><strong>Tanggal:</strong> { formatDateIndo(sale.date) }</p>
                    <p><strong>Total Pembelian:</strong> { formatRupiah(sale.total) }</p>
                    <p><strong>Jumlah Barang:</strong> { sale.items } item</p>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                    <p><strong>Daftar Produk:</strong></p>
                    <ul className="space-y-1">
                        { sale.SaleItems.map((item, index) => (
                            <li key={ index } className="flex justify-between">
                                <span>{ item.product.name } : { item.quantity } × { formatRupiah(item.price) }</span>
                                <span>{ formatRupiah(item.price * item.quantity) }</span>
                            </li>
                        )) }
                    </ul>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span>{ formatRupiah(sale.total) }</span>
                    </div>
                </div>
                <DialogClose asChild>
                    <Button variant="outline">Tutup</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );

}

export function ModalInvoice({ data }: { data: SalesDataModal }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <ReceiptText className="h-3 w-3"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Invoice</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Transaksi pada { data.date } oleh { data.customer }
                    </p>
                </DialogHeader>

                <div className="mt-4 space-y-2 text-sm">
                    <div className="font-medium">Daftar Produk:</div>
                    <ul className="space-y-1">
                        { data.products.map((item, index) => (
                            <li key={ index } className="flex justify-between">
                                <span>{ item.name } × { item.quantity }</span>
                                <span>{ formatRupiah(item.price * item.quantity) }</span>
                            </li>
                        )) }
                    </ul>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span>{ formatRupiah(data.total) }</span>
                    </div>
                </div>

                <DialogClose asChild>
                    <Button variant="outline" className="mt-4">Tutup</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

