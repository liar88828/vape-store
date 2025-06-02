"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Edit, Eye, Plus, Star, Users, XCircle } from "lucide-react"
import { exampleCustomerData, exampleMemberTierData } from "@/lib/data";
import { choose, formatRupiah, getStatusLabel, variantStatus } from "@/lib/my-utils";

export function CustomersPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manajemen Pelanggan</h1>
                <Button>
                    <Plus className="h-4 w-4 mr-2"/>
                    Tambah Pelanggan
                </Button>
            </div>

            {/* Age Verification System */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2"/>
                        Sistem Verifikasi Umur
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium mb-4">Pengaturan Verifikasi</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="require-id" defaultChecked/>
                                    <Label htmlFor="require-id">Wajib verifikasi KTP</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="photo-verification"/>
                                    <Label htmlFor="photo-verification">Verifikasi foto</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="age-reminder" defaultChecked/>
                                    <Label htmlFor="age-reminder">Reminder umur di setiap transaksi</Label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-4">Statistik Verifikasi</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Total pelanggan terverifikasi:</span>
                                    <span className="font-medium">234</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Verifikasi ditolak bulan ini:</span>
                                    <span className="font-medium text-red-600">3</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rata-rata umur pelanggan:</span>
                                    <span className="font-medium">26 tahun</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Customer List */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Daftar Pelanggan</CardTitle>
                    <div className="flex space-x-2">
                        <Input placeholder="Cari pelanggan..." className="max-w-sm"/>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="verified">Terverifikasi</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Ditolak</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Umur</TableHead>
                                <TableHead>Total Pembelian</TableHead>
                                <TableHead>Status Verifikasi</TableHead>
                                <TableHead>Terakhir Belanja</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { exampleCustomerData.map((customer) => (
                                <TableRow key={ customer.id }>
                                    <TableCell>{ customer.name }</TableCell>
                                    <TableCell>{ customer.age } tahun</TableCell>
                                    <TableCell>
                                        { formatRupiah(customer.totalPurchase) }
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={ variantStatus({
                                                default: customer.status === "verified",
                                                secondary: customer.status === "pending",
                                                destructive: true,
                                            }) }
                                        >
                                            {
                                                choose(
                                                    [ customer.status === 'verified', "Terverifikasi" ],
                                                    [ customer.status === 'verified', "Terverifikasi" ],
                                                    [ customer.status === 'pending', "pending" ],
                                                    [ true, "Ditolak" ]
                                                )}
                                            {/*{getStatusLabel(customer.status) }*/}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{ customer.lastPurchase }</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            { customer.status === "pending" ? (
                                                <>
                                                    <Button size="sm" variant="outline">
                                                        <CheckCircle className="h-3 w-3"/>
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <XCircle className="h-3 w-3"/>
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="h-3 w-3"/>
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <Edit className="h-3 w-3"/>
                                                    </Button>
                                                </>
                                            ) }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Loyalty Program */ }
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Star className="h-5 w-5 mr-2"/>
                        Program Loyalitas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        { exampleMemberTierData.map((tier) => (
                            <div key={ tier.name }>
                                <h3 className="font-medium mb-2">{ tier.name }</h3>
                                <p className="text-sm text-muted-foreground mb-2">{ tier.range }</p>
                                <div className="flex items-center space-x-2">
                                    <Progress value={ tier.progress } className="flex-1"/>
                                    <span className="text-sm">{ tier.count } member</span>
                                </div>
                            </div>
                        )) }
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
