import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { toLFPrinterCommerceCatalog } from "../../modules/lf-printer/infrastructure/commerce-presentation";

const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("Chapter 11 LF-PRINTER Commerce presentation", () => {
  it("adapts only published Commerce presentation data to the cinematic showroom contract", () => {
    const catalog = toLFPrinterCommerceCatalog("company-a", {
      company: { name: "LF-PRINTER" },
      products: [{
        slug: "epson-l3250",
        name: "Epson L3250",
        description: "Impresora para hogar y oficina",
        category: "Impresoras",
        images: [{ url: "/media/l3250.webp", alt: "Epson L3250", order: 0 }],
        priceMinor: 65000,
        features: ["EcoTank", "Wi-Fi"],
        featured: true,
        availability: "Pocas unidades",
      }],
    });
    assert.equal(catalog.companySlug, "company-a");
    assert.equal(catalog.showroomItems[0].id, "epson-l3250");
    assert.equal(catalog.showroomItems[0].priceMinor, 65000);
    assert.equal(catalog.showroomItems[0].family, "EcoTank");
    assert.equal(catalog.showroomItems[0].imageUrl, "/media/l3250.webp");
  });

  it("keeps missing product media explicit and never substitutes corporate branding", () => {
    const catalog = toLFPrinterCommerceCatalog("company-a", {
      company: { name: "LF-PRINTER", logoUrl: "/branding/lf-printer-logo.png" },
      products: [{ slug: "without-media", name: "Producto sin imagen", description: "Pendiente", category: "Repuestos", images: [], priceMinor: 10000, features: [], featured: false, availability: "Disponible" }],
    });
    assert.equal(catalog.showroomItems[0].imageUrl, undefined);
    assert.notEqual(catalog.showroomItems[0].imageUrl, catalog.company?.logoUrl);
    const presentation = [source("modules/lf-printer/infrastructure/commerce-presentation.ts"), source("modules/lf-printer/components/LFCommerceShop.tsx")].join("\n");
    assert.doesNotMatch(presentation, /lf-printer-logo\.png/);
    assert.match(source("modules/lf-printer/components/PrinterVisual.tsx"), /Imagen pendiente/);
  });

  it("keeps official LF-PRINTER routes independent from demo catalog sources", () => {
    const routes = [
      source("app/proyectos/lf-printer/page.tsx"),
      source("app/proyectos/lf-printer/productos/[slug]/page.tsx"),
      source("modules/lf-printer/infrastructure/commerce-public.ts"),
    ].join("\n");
    assert.doesNotMatch(routes, /demo-data|\bcatalog\s*from|infrastructure\/demo-data/);
    assert.match(routes, /getLFPrinterCommerceCatalog/);
    assert.match(routes, /ProductCommerceDetail|LFPrinterCommerceExperience/);
  });

  it("uses the specialized LF-PRINTER commerce surface and dynamic product decision page", () => {
    const showroom = source("app/proyectos/lf-printer/page.tsx");
    const reactiveExperience = source("modules/lf-printer/components/LFPrinterCommerceExperience.tsx");
    const detail = source("app/proyectos/lf-printer/productos/[slug]/page.tsx");
    assert.match(showroom, /<LFPrinterCommerceExperience/);
    assert.match(reactiveExperience, /<CommerceCatalog/);
    assert.match(reactiveExperience, /subscribeToCommerceChanges/);
    assert.doesNotMatch(reactiveExperience, /<Showroom|<PrintAdvisor/);
    assert.match(detail, /ProductCommerceDetail/);
    assert.doesNotMatch(detail, /product-experiences|ProductAnatomy|demo-data/);
    assert.doesNotMatch(detail, /redirect\(/);
  });

  it("keeps search, category, cart and Lía connected to the same public Commerce DTO", () => {
    const home = source("modules/lf-printer/components/CommerceCatalog.tsx");
    const detail = source("modules/lf-printer/components/ProductCommerceDetail.tsx");
    assert.match(home, /api\/commerce\/\$\{companySlug\}\/search/);
    assert.match(home, /data\.categories/);
    assert.match(home, /idempotency-key/);
    assert.match(detail, /api\/commerce\/\$\{companySlug\}/);
    assert.match(detail, /LiaQuickPanel/);
    for (const sourceText of [home, detail]) assert.doesNotMatch(sourceText, /EP-WF-4830|Epson WorkForce|demo-data/);
  });
  it("keeps the technological header and both desktop rails sticky with isolated Lía scrolling",()=>{
    const page=source("app/proyectos/lf-printer/page.tsx"),home=source("modules/lf-printer/components/CommerceCatalog.tsx"),styles=source("modules/lf-printer/components/commerce-three-zone.css");
    assert.match(page,/overflow-x-clip/);assert.doesNotMatch(page,/overflow-x-hidden/);
    assert.match(home,/commerce-header sticky top-0/);assert.match(home,/id="lia-aside"/);assert.match(home,/id="pedido-aside"/);
    assert.match(styles,/--lf-commerce-header-height:7\.5rem/);assert.match(home,/commerce-fixed-header/);assert.match(styles,/\.commerce-fixed-header\{position:fixed/);assert.match(styles,/#lia-aside,#pedido-aside\{position:sticky/);assert.match(styles,/#lia-aside\{overflow-x:hidden;overflow-y:auto;overscroll-behavior-y:contain/);assert.match(styles,/#catalogo,#taller\{scroll-margin-top:calc/);
  });
  it("offers WhatsApp payment coordination only after the order has a public identifier", () => {
    const home = source("modules/lf-printer/components/CommerceCatalog.tsx"), detail = source("modules/lf-printer/components/ProductCommerceDetail.tsx"), handoff = source("modules/lf-printer/infrastructure/order-whatsapp.ts");
    assert.match(home, /setLastOrderPublicId\(body\.publicId\)/);
    assert.match(home, /setLastOrderWhatsappUrl\(whatsappUrl\)/);
    assert.match(home, /setLastOrder\(body\)/);
    assert.match(home, /lastOrderPublicId&&lastOrderWhatsappUrl&&<a href=\{lastOrderWhatsappUrl\}/);
    assert.match(home, /Procesar pago por WhatsApp/);
    assert.match(detail, /setWhatsappUrl\(orderWhatsappUrl\(body\)\)/);
    assert.match(detail, /Continuar pago por WhatsApp/);
    assert.match(handoff, /Pedido: \$\{order\.publicId\}/);
    assert.match(handoff, /Método solicitado:/);
    assert.match(source("modules/lf-printer/components/LFPrinterCommerceFooter.tsx"), /Pagar con \$\{method\.name\} por WhatsApp/);
  });
});

describe("LF-PRINTER catalog navigation",()=>{
  it("provides a scalable menu without a second product source",()=>{
    const home=source("modules/lf-printer/components/CommerceCatalog.tsx");
    assert.match(home,/aria-controls="lf-catalog-menu"/);
    assert.match(home,/Menú completo LF-PRINTER/);
    assert.match(home,/data-commerce-promotion-slots="offers benefits featured-projects lf-printer-laex"/);
    assert.match(home,/Próximamente/);
    assert.doesNotMatch(home,/demo-data|catalog\.ts/);
  });
});
