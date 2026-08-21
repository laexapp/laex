import type { ChapterTwoStore, CommerceDeliveryPolicy } from "../chapter-two/types";
import type { CompanyId, TenantId } from "../domain/types";

export type PublicAvailability = "Disponible"|"Pocas unidades"|"Agotado"|"Por encargo"|"Consultar disponibilidad";
export interface CommerceCatalogQuery { query?:string; category?:string; availability?:PublicAvailability; page?:number; pageSize?:number }
export interface PublicCatalogProduct { productId:string; projectionId:string; slug:string; name:string; model?:string; publicSku?:string; description:string; category:string; compatibility:string[]; images:Array<{url:string;alt:string;order:number;purpose?:string}>; priceMinor:number; basePriceMinor:number; promotion?:{priceMinor:number;basePriceMinor?:number;startsAt:string;endsAt?:string;active:boolean;title?:string;description?:string;eligibilityMode?:"manual";assetReference?:string}; deliveryPolicy:CommerceDeliveryPolicy; features:string[]; featured:boolean; availability:PublicAvailability; availableQuantity?:number; url:string }

const normalize=(value:string)=>value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("es").replace(/[^a-z0-9]+/g," ").trim();
const score=(haystack:string,needle:string)=>haystack===needle?100:haystack.startsWith(needle)?70:haystack.includes(needle)?40:needle.split(" ").filter(Boolean).every(token=>haystack.includes(token))?20:0;

/** Public discovery boundary: reads only published Commerce projections and returns an allow-listed DTO. */
export class CommerceCatalogSearch {
  constructor(private readonly store:ChapterTwoStore,private readonly now=()=>new Date()){}
  async search(scope:{tenantId:TenantId;companyId:CompanyId},input:CommerceCatalogQuery={}){
    const buckets:Array<keyof import("../chapter-two/types").ChapterTwoState>=["platformCompanies","products","inventory","commerceProjections","commerceReservations"];
    const state=this.store.snapshotForCompany?await this.store.snapshotForCompany(scope.tenantId,scope.companyId,buckets):await this.store.snapshot(),company=state.platformCompanies.find(item=>item.id===scope.companyId&&item.tenantId===scope.tenantId&&item.enabledModules.includes("commerce"));
    if(!company)return{company:null,query:"",categories:[],total:0,page:1,pageSize:24,products:[] as PublicCatalogProduct[]};
    const requested=normalize(input.query??""),category=normalize(input.category??""),page=Math.max(1,Math.trunc(input.page??1)),pageSize=Math.min(48,Math.max(1,Math.trunc(input.pageSize??24)));
    const products=state.commerceProjections.filter(item=>item.tenantId===scope.tenantId&&item.companyId===scope.companyId&&item.publicationStatus==="published").flatMap(projection=>{
      const product=state.products.find(item=>item.id===projection.productId&&item.tenantId===scope.tenantId&&item.companyId===scope.companyId&&item.status!=="disabled");if(!product)return[];
      const stock=state.inventory.filter(item=>item.tenantId===scope.tenantId&&item.companyId===scope.companyId&&item.productId===product.id).reduce((sum,item)=>sum+item.delta,0),reserved=state.commerceReservations.filter(item=>item.tenantId===scope.tenantId&&item.companyId===scope.companyId&&item.productId===product.id&&item.status==="active"&&new Date(item.expiresAt)>this.now()).reduce((sum,item)=>sum+item.quantity,0),available=Math.max(0,stock-reserved),deliveryPolicy=projection.deliveryPolicy??{mode:"in-stock",priceType:"fixed",paymentRequirement:"full",estimatedDelivery:"1–2 días"},availability=deliveryPolicy.mode==="on-order"?"Por encargo" as const:deliveryPolicy.mode==="confirm-availability"?"Consultar disponibilidad" as const:available<=0?"Agotado" as const:available<=2?"Pocas unidades" as const:"Disponible" as const,promotionActive=projection.promotion?.active&&new Date(projection.promotion.startsAt)<=this.now()&&(!projection.promotion.endsAt||new Date(projection.promotion.endsAt)>=this.now()),priceMinor=promotionActive?projection.promotion!.priceMinor:projection.publicPriceMinor;
      const dto:PublicCatalogProduct={productId:product.id,projectionId:projection.id,slug:projection.slug,name:projection.publicName,model:projection.publicModel,publicSku:projection.publicSku,description:projection.publicDescription,category:projection.commercialCategory,compatibility:projection.compatibility??[],images:projection.images.filter(image=>!image.hidden).sort((a,b)=>a.order-b.order).map(image=>({url:image.url,alt:image.alt,order:image.order,purpose:image.purpose})),priceMinor,basePriceMinor:projection.publicPriceMinor,promotion:projection.promotion,deliveryPolicy,features:projection.features,featured:projection.featured,availability,availableQuantity:deliveryPolicy.mode==="in-stock"?available:undefined,url:`/proyectos/lf-printer/productos/${projection.slug}`};
      const searchable=normalize([dto.name,dto.model,dto.publicSku,dto.category,dto.description,...dto.features,...dto.compatibility].filter(Boolean).join(" ")),matchScore=requested?score(searchable,requested):1;
      if(!matchScore||(category&&normalize(dto.category)!==category)||(input.availability&&availability!==input.availability))return[];
      return[{dto,matchScore}];
    }).sort((left,right)=>right.matchScore-left.matchScore||Number(right.dto.featured)-Number(left.dto.featured)||left.dto.name.localeCompare(right.dto.name,"es"));
    const categories=[...new Set(state.commerceProjections.filter(item=>item.tenantId===scope.tenantId&&item.companyId===scope.companyId&&item.publicationStatus==="published").map(item=>item.commercialCategory))].sort((a,b)=>a.localeCompare(b,"es"));
    return{company:{name:company.name,logoUrl:company.logoUrl,primaryColor:company.primaryColor,phone:company.phone,address:company.address},query:input.query?.trim()??"",categories,total:products.length,page,pageSize,products:products.slice((page-1)*pageSize,page*pageSize).map(item=>item.dto)};
  }
}
