import { ProductsPage } from "@/components/products-page"
import { getProduct } from "@/action/product-action";

export default async function Products() {
    return <ProductsPage products={ await getProduct() }/>
}
