import * as z from "zod";
import { CustomerModel, ProductModel } from "@/lib/generated/zod";

export const CustomerModelNew = z.object({
    name: z.string().min(1),
})

export type CustomerModelType = z.infer<typeof CustomerModelNew>
export type CustomerModelComplete = z.infer<typeof CustomerModel>
export type ProductModelType = z.infer<typeof ProductModel>
