import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import HeaderComponent from "@/components/header-page";
import { cookies } from "next/headers";

const inter = Inter({ subsets: [ "latin" ] })

export const metadata: Metadata = {
    title: "VapeStore Pro",
    description: "Sistem manajemen toko vape lengkap",
}

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode
}>) {

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    return (

        <html lang="id" suppressHydrationWarning>
        <body className={ inter.className }>
        <ThemeProvider attribute="class" defaultTheme="light">
            <SidebarProvider defaultOpen={ defaultOpen }>
                <AppSidebar/>
                <SidebarInset>
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        <HeaderComponent/>
                        { children }
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
