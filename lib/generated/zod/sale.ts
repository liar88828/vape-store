import * as z from "zod"
import { CompleteCustomer, CompleteSalesItem, RelatedCustomerModel, RelatedSalesItemModel } from "./index"

export const SaleModel = z.object({
    id: z.number().int(),
    date: z.date(),
    total: z.number().int().min(1),
    items: z.number().int().min(1),
    customerId: z.number().int(),
})

export interface CompleteSale extends z.infer<typeof SaleModel> {
    customer: CompleteCustomer
    SaleItems: CompleteSalesItem[]
}

/**
 * RelatedSaleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSaleModel: z.ZodSchema<CompleteSale> = z.lazy(() => SaleModel.extend({
    customer: RelatedCustomerModel,
    SaleItems: RelatedSalesItemModel.array(),
}))
