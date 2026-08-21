export const LF_PRINTER_CONTACT={whatsappNumber:"18493581132",whatsappMessage:"Hola LF-PRINTER, necesito orientación."}as const;
export const lfPrinterWhatsappUrl=`https://wa.me/${LF_PRINTER_CONTACT.whatsappNumber}?text=${encodeURIComponent(LF_PRINTER_CONTACT.whatsappMessage)}`;
