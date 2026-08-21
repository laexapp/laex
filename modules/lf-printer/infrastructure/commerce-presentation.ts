import type { CatalogItem } from "../domain/types";
import type { CommerceDeliveryPolicy } from "@/modules/business-engine/chapter-two/types";

export interface PublicCommerceImage {
  url: string;
  alt: string;
  order: number;
  purpose?: "carousel" | "card" | "detail" | "promotion";
  assetReference?: string;
  checksum?: string;
  version?: number;
  tool?: string;
}

export interface PublicCommerceProduct {
  productId?: string;
  projectionId?: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  images: PublicCommerceImage[];
  priceMinor: number;
  promotion?: { priceMinor:number; basePriceMinor?:number; startsAt:string; endsAt?:string; active:boolean; title?:string; description?:string; eligibilityMode?:"manual"; assetReference?:string };
  deliveryPolicy?: CommerceDeliveryPolicy;
  features: string[];
  featured: boolean;
  availability: "Disponible" | "Pocas unidades" | "Agotado" | "Por encargo" | "Consultar disponibilidad";
  availableQuantity?: number;
  model?: string;
  publicSku?: string;
  compatibility?: string[];
  url?: string;
}

export interface PublicCommerceCatalog {
  company: null | {
    name: string;
    logoUrl?: string;
    primaryColor?: string;
    phone?: string;
    address?: string;
  };
  products: PublicCommerceProduct[];
  categories?: string[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface LFPrinterCommerceCatalog extends PublicCommerceCatalog {
  companySlug: string;
  showroomItems: CatalogItem[];
}

function inferFamily(product: PublicCommerceProduct): CatalogItem["family"] {
  const searchable = [product.name, product.category, ...product.features].join(" ").toLowerCase();
  if (searchable.includes("ecotank") || searchable.includes("l3250")) return "EcoTank";
  if (searchable.includes("expression") || searchable.includes("xp-")) return "Expression Home";
  return "WorkForce Pro";
}

export function toShowroomItem(product: PublicCommerceProduct): CatalogItem {
  const family = inferFamily(product);
  const features = product.features.length ? product.features : [product.description || "Producto publicado por LF-PRINTER"];
  const image = product.images.find(item=>item.purpose==="carousel")??product.images[0];
  return {
    id: product.slug,
    brand: "Epson",
    family,
    model: product.name,
    category: "Multifuncional",
    technology: product.category,
    useCase: product.description || product.category,
    features,
    status: product.availability === "Agotado" ? "Consultar disponibilidad" : "Disponible",
    systemInstalled: features.some((feature) => /sistema|instalaci[oó]n/i.test(feature)),
    imageUrl: image?.url,
    imageAlt: image?.alt || product.name,
    sourceUrl: `/proyectos/lf-printer/productos/${product.slug}`,
    description: product.description,
    priceMinor: product.priceMinor,
    commerceAvailability: product.availability,
  };
}

export function toLFPrinterCommerceCatalog(companySlug: string, catalog: PublicCommerceCatalog): LFPrinterCommerceCatalog {
  const featured=catalog.products.filter(product=>product.featured),selection=(featured.length?featured:catalog.products.slice(0,1)).slice(0,8);
  return { ...catalog, companySlug, showroomItems: selection.map(toShowroomItem) };
}
