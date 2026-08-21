"use client";
import { Bot,CreditCard,MessageCircle } from "lucide-react";import { PaymentCenter,lfPrinterPaymentMethods } from "@/modules/payment-center";import { FloatingQuickActions,type FloatingQuickAction } from "@/modules/shared/components/FloatingQuickActions";import { lfPrinterWhatsappUrl } from "../config/quick-actions";import { LiaQuickPanel } from "./LiaQuickPanel";
import { LiaAvatar } from "@/modules/shared/components/LiaAvatar";
const actions:FloatingQuickAction[]=[{id:"whatsapp",label:"WhatsApp",icon:MessageCircle,accent:"green",href:lfPrinterWhatsappUrl},{id:"payments",label:"Métodos de pago",icon:CreditCard,accent:"gold",panel:()=><PaymentCenter methods={lfPrinterPaymentMethods} projectName="LF-PRINTER"/>},{id:"lia",label:"Conversar con Lía",icon:Bot,visual:()=><LiaAvatar size={50} state="assistance"/>,accent:"violet",panel:()=><LiaQuickPanel/>}];
export function LFPrinterQuickActions(){return <FloatingQuickActions actions={actions}/>}
