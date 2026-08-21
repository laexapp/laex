import { OrderTracking } from "@/modules/lf-printer/components/OrderTracking";
import { LF_PRINTER_COMMERCE_COMPANY } from "@/modules/lf-printer/infrastructure/commerce-public";

export const metadata={title:"Seguimiento de pedido · LF-PRINTER"};
export default function TrackingPage(){return <OrderTracking companySlug={LF_PRINTER_COMMERCE_COMPANY}/>}
