import type { PaymentMethodProfile } from "../domain/types";
const common=["Realiza el pago a la cuenta indicada por LF-PRINTER.","Conserva el Hash o ID y toma una captura legible del comprobante."];
export const lfPrinterPaymentMethods:readonly PaymentMethodProfile[]=[
 {id:"omd",name:"OMD",category:"token",currencies:["OMD"],instructions:common,destinationLabel:"Dirección OMD",destinationValue:"Solicitar dirección oficial al confirmar",enabled:true},
 {id:"omdb",name:"OMDB",category:"token",currencies:["OMDB"],instructions:common,destinationLabel:"Dirección OMDB",destinationValue:"Solicitar dirección oficial al confirmar",enabled:true},
 {id:"usdt",name:"USDT",category:"crypto",currencies:["USDT"],instructions:[...common,"Confirma la red antes de transferir."],destinationLabel:"Wallet y red",destinationValue:"Se confirman de forma privada antes del pago",enabled:true},
 {id:"bnb",name:"BNB",category:"crypto",currencies:["BNB"],instructions:common,destinationLabel:"Wallet BNB",destinationValue:"Se confirma de forma privada antes del pago",enabled:true},
 {id:"paypal",name:"PayPal",category:"wallet",currencies:["USD"],instructions:common,destinationLabel:"Cuenta PayPal",destinationValue:"Se comparte al confirmar la orden",enabled:true},
 {id:"bhd",name:"Banco BHD",category:"bank",currencies:["DOP","USD"],instructions:[...common,"Incluye tu nombre o referencia de proyecto en el concepto."],destinationLabel:"Cuenta bancaria",destinationValue:"Los datos se entregan por un canal seguro",enabled:true},
];
