import { InventoryPage } from "@/components/inventory-page"
import { getPreOrder, getProduct, getProductLowStockComplete } from "@/action/product-action";
import { getAllCustomers } from "@/action/customer-action";
import { ContextPage } from "@/interface/actionType";
import { getSearchParam } from "@/components/context-action";

export default async function Inventory(context: ContextPage) {
    const name = await getSearchParam(context, 'name');

    return <InventoryPage lowStockProducts={ await getProductLowStockComplete() }
                          products={ await getProduct() }
                          preOrders={ await getPreOrder() }
                          customers={ await getAllCustomers(name) }
    />
}
