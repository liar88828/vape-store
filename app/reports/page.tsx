import { ReportsPage } from "@/components/reports-page"
import { SaleCustomers } from "@/action/sale-action";

export default async function Reports() {

    return <ReportsPage sales={ await SaleCustomers() }

    />
}
