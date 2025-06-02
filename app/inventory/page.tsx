"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Plus, CheckCircle, XCircle } from "lucide-react"
import { products, preOrders } from "@/lib/data"

export default function InventoryPage() {
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Inventori</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Reorder Alert
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Stok
          </Button>
        </div>
      </div>

      {/* Inventory Stats */}
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
            <div className="text-2xl font-bold text-red-600">{lowStockProducts.length}</div>
            <p className="text-sm text-muted-foreground">Di bawah minimum stok</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pre-Order Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preOrders.length}</div>
            <p className="text-sm text-muted-foreground">Menunggu kedatangan</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
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
              {lowStockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">{product.stock}</Badge>
                  </TableCell>
                  <TableCell>{product.minStock}</TableCell>
                  <TableCell>{product.minStock - product.stock + 10}</TableCell>
                  <TableCell>
                    <Button size="sm">Reorder</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pre-Orders */}
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
              {preOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.estimatedDate}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "Confirmed" ? "default" : "secondary"}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
