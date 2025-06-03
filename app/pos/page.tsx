import { POSPage } from "@/components/pos-page"
import { getProduct } from "@/action/product-action";
import { getAllCustomers } from "@/action/customer-action";

export default async function POS() {

    return <POSPage products={ await getProduct() } customers={ await getAllCustomers() }/>
}
