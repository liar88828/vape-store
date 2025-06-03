import { InventoryPage } from "@/components/inventory-page"
import { getPreOrder, getProduct, getProductLowStockComplete } from "@/action/product-action";
import { getAllCustomers } from "@/action/customer-action";

export default async function Inventory() {

    return <InventoryPage lowStockProducts={ await getProductLowStockComplete() }
                          products={ await getProduct() }
                          preOrders={ await getPreOrder() }
                          customers={ await getAllCustomers() }
    />
}
