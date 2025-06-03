"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Menu, Settings, } from "lucide-react"
import { myData } from "@/lib/use-data"
import type React from "react";
import { useSidebar } from "@/components/ui/sidebar"

export default function HeaderComponent() {
    const { products } = myData()
    const lowStockProducts = products.filter((p) => p.stock <= p.minStock)
    const { toggleSidebar } = useSidebar()
    return (<header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        {/*<SidebarTrigger className={'size-10'} />*/ }
                        <Menu
                            onClick={ toggleSidebar }
                            className="h-8 w-8 text-blue-600 mr-3"/>
                        <h1 className="text-2xl font-bold text-gray-900">VapeStore Pro</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm">
                            <Bell className="h-4 w-4 mr-2"/>
                            Notifikasi
                            { lowStockProducts.length > 0 && (
                                <Badge variant="destructive" className="ml-2">
                                    { lowStockProducts.length }
                                </Badge>
                            ) }
                        </Button>
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2"/>
                            Pengaturan
                        </Button>
                    </div>
                </div>
            </div>
        </header>

    )
}
