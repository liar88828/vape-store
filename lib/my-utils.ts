
export function variantStatus(flags: {
    default?: boolean;
    secondary?: boolean;
    destructive?: boolean
}): "default" | "secondary" | "destructive" | "outline" | null | undefined {
    if (flags.default) return "default";
    if (flags.secondary) return "secondary";
    if (flags.destructive) return "destructive";
    return "default"; // fallback
}

export function formatRupiah(amount: number): string {
    return amount.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

export function getStatusLabel(status: string): string {
    switch (status) {
        case "verified":return "Terverifikasi";
        case "pending":return "Pending";
        default:return "Ditolak";
    }
}

export function choose<T>(...cases: [condition: boolean, result: T][]): T | undefined {
    for (const [cond, result] of cases) {
        if (cond) return result;
    }
    return undefined;
}