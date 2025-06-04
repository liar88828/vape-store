import { ReportsPage } from "@/components/reports-page"
import { ContextPage, RangeStats } from "@/interface/actionType";
import { getChartData, getDashboardStats, getMonthlySalesChange, SaleCustomers } from "@/action/sale-action";

export default async function Reports({ searchParams }: ContextPage) {
    const range = (await searchParams).range as RangeStats || "today"

    return <ReportsPage
        range={ range }
        sales={ await SaleCustomers(range) }
        chartData={ await getChartData(range) }
        trending={ await getMonthlySalesChange(range) }
        stats={ await getDashboardStats(range) }
    />
}
