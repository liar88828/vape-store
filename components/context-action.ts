// Generic helper to get any query param key dynamically
import { ContextPage } from "@/interface/actionType";

export async function getSearchParam<K extends keyof Awaited<ContextPage['searchParams']>>(
    context: ContextPage,
    key: K
): Promise<Awaited<ContextPage['searchParams']>[K]> {
    const searchParams = await context.searchParams;
    return searchParams[key];
}