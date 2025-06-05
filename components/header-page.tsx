"use client"

import type React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/theme-provider";

export default function HeaderComponent({ lowStockProducts }: { lowStockProducts: { stock: number }[] }) {
    // const { products } = myData()
    // const lowStockProducts = lowStockProducts.filter((p) => p.stock <= p.minStock)
    // const { toggleSidebar } = useSidebar()
    return (<header className="bg-muted shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-end gap-4">
                        <SidebarTrigger variant={ 'outline' }
                            // size="sm"
                                        className={ 'size-9' }
                        />
                        {/*<Menu*/ }
                        {/*    onClick={ toggleSidebar }*/ }
                        {/*    className="h-8 w-8 text-blue-600 mr-3"/>*/ }
                        <ModeToggle/>
                        <h1 className="text-2xl font-bold ">VapeStore Pro</h1>
                    </div>
                    {/*<div className="flex items-center space-x-4">*/ }
                    {/*    <Button variant="outline" size="sm">*/ }
                    {/*        <Bell className="h-4 w-4  "/> Notifikasi*/ }
                    {/*        { lowStockProducts.length > 0 && (*/ }
                    {/*            <Badge variant="destructive" className="ml-2">*/ }
                    {/*                { lowStockProducts.length }*/ }
                    {/*            </Badge>*/ }
                    {/*        ) }*/ }
                    {/*    </Button>*/ }
                    {/*    <Button variant="outline" size="sm">*/ }
                    {/*        <Settings className="h-4 w-4 "/> Pengaturan*/ }
                    {/*    </Button>*/ }
                    {/*</div>*/ }
                </div>
            </div>
        </header>

    )
}
