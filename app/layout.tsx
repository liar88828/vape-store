import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import HeaderComponent from "@/components/header-page";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { getProductLowStock } from "@/action/product-action";
import { getTotalSoldToday, getTransactionCountToday } from "@/action/sale-action";

const inter = Inter({ subsets: [ "latin" ] })

export const metadata: Metadata = {
    title: "VapeStore Pro",
    description: "Sistem manajemen toko vape lengkap",
}

export default async function RootLayout(
    { children }:
    Readonly<{ children: React.ReactNode }>
) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    return (

        <html lang="id" suppressHydrationWarning>
        <body className={ inter.className }>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            // enableSystem
            // disableTransitionOnChange
        >
            <SidebarProvider defaultOpen={ defaultOpen }>
                <AppSidebar lowStockProducts={ await getProductLowStock() }
                            totalTransaction={ await getTransactionCountToday() }
                            totalSellToday={ await getTotalSoldToday() }
                />
                <SidebarInset>
                    <main className="flex-1 overflow-y-auto ">
                        <HeaderComponent/>
                        { children }
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
        <Toaster
            position="top-right"
        />
        </body>
        </html>
    )
}
