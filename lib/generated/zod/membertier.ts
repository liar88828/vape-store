import * as z from "zod"

export const MemberTierModel = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    range: z.string().min(1),
    progress: z.number().int(),
    count: z.number().int(),
})
