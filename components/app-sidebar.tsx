"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Package,
  Home,
  ShoppingCart,
  Archive,
  BarChart3,
  Users,
  Bell,
  Settings,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  User,
  LogOut,
  ChevronDown,
  Zap,
  Gift,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useData } from "@/lib/use-data"

export function AppSidebar() {
  const pathname = usePathname()
  const { lowStockProducts } = useData()

  const isActive = (path: string) => {
    return pathname === path
  }

  const mainNavItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/",
      description: "Overview & Analytics",
    },
    {
      title: "POS Kasir",
      icon: ShoppingCart,
      path: "/pos",
      description: "Point of Sale",
      badge: "Live",
    },
  ]

  const managementItems = [
    {
      title: "Produk",
      icon: Package,
      path: "/products",
      description: "Katalog & Inventory",
    },
    {
      title: "Inventori",
      icon: Archive,
      path: "/inventory",
      description: "Stock Management",
      badge: lowStockProducts.length > 0 ? lowStockProducts.length.toString() : null,
      badgeVariant: "destructive" as const,
    },
    {
      title: "Pelanggan",
      icon: Users,
      path: "/customers",
      description: "Customer Management",
    },
  ]

  const analyticsItems = [
    {
      title: "Laporan",
      icon: BarChart3,
      path: "/reports",
      description: "Sales & Analytics",
    },
  ]

  const quickActions = [
    {
      title: "Transaksi Hari Ini",
      value: "156",
      icon: CreditCard,
      color: "text-green-600",
    },
    {
      title: "Penjualan",
      value: "Rp 2.4M",
      icon: TrendingUp,
      color: "text-blue-600",
    },
  ]

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center px-4 py-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3 flex-1">
            <h1 className="text-lg font-bold text-gray-900">VapeStore</h1>
            <p className="text-xs text-gray-600">Management System</p>
          </div>
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                  <span className="text-xs font-medium text-gray-900">{action.value}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{action.title}</p>
              </div>
            ))}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} className="group relative overflow-hidden">
                    <Link
                      href={item.path}
                      className="flex items-center gap-3 px-3 py-6 rounded-lg transition-all duration-200"
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{item.description}</p>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} className="group relative overflow-hidden">
                    <Link
                      href={item.path}
                      className="flex items-center gap-3 px-3 py-6 rounded-lg transition-all duration-200"
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{item.title}</span>
                          {item.badge && (
                            <Badge variant={item.badgeVariant || "secondary"} className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{item.description}</p>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Analytics Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} className="group relative overflow-hidden">
                    <Link
                      href={item.path}
                       className="flex items-center gap-3 px-3 ppy-6 rounded-lg transition-all duration-200"
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm">{item.title}</span>
                        <p className="text-xs text-gray-500 truncate">{item.description}</p>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Notifications Section */}
        {lowStockProducts.length > 0 && (
          <>
            <SidebarSeparator className="my-2" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-red-500 uppercase tracking-wider px-3 py-2">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Alerts
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Stok Rendah</span>
                    </div>
                    <p className="text-xs text-red-700 mb-2">{lowStockProducts.length} produk perlu restock</p>
                    <Button size="sm" variant="outline" className="w-full text-xs h-7" asChild>
                      <Link href="/inventory">Lihat Detail</Link>
                    </Button>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-gray-50/50">
        <div className="p-3">
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-auto p-3 hover:bg-white">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">AD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Admin Store</p>
                    <p className="text-xs text-gray-500 truncate">admin@vapestore.com</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
                {lowStockProducts.length > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {lowStockProducts.length}
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs h-8" asChild>
              <Link href="/pos">
                <ShoppingCart className="h-3 w-3 mr-1" />
                POS
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-8">
              <Gift className="h-3 w-3 mr-1" />
              Promo
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
