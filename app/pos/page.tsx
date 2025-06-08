import { POSPage } from "@/components/pos-page"
import { getProduct } from "@/action/product-action";
import { getAllCustomers } from "@/action/customer-action";
import { getSearchParam } from "@/components/context-action";
import { ContextPage } from "@/interface/actionType";

export default async function POS(context: ContextPage) {
    const name = await getSearchParam(context, 'name');
    return <POSPage products={ await getProduct() } customers={ await getAllCustomers(name) }/>
}
