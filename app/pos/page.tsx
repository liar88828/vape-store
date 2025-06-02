import { POSPage } from "@/components/pos-page"
import { products } from "@/lib/data";

export default function POS() {
  return <POSPage products={products} />
}
