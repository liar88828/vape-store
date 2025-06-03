import * as z from "zod"
import { CompletePreOrder, CompleteSalesItem, RelatedPreOrderModel, RelatedSalesItemModel } from "./index"

export const ProductModel = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    category: z.string().min(1),
    price: z.number().int(),
    stock: z.number().int(),
    minStock: z.number().int(),
    image: z.string().min(1),
    description: z.string().min(1),
    nicotineLevel: z.string().nullish(),
    flavor: z.string().nullish(),
    type: z.string(),
})

export interface CompleteProduct extends z.infer<typeof ProductModel> {
    PreOrders: CompletePreOrder[]
    SalesItems: CompleteSalesItem[]
}

/**
 * RelatedProductModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProductModel: z.ZodSchema<CompleteProduct> = z.lazy(() => ProductModel.extend({
    PreOrders: RelatedPreOrderModel.array(),
    SalesItems: RelatedSalesItemModel.array(),
}))
