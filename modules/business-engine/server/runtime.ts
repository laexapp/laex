import "server-only";
import { join } from "node:path";
import { ChapterTwoEngine } from "../chapter-two/ChapterTwoEngine";
import { LocalAssistantOrchestrator } from "../chapter-two/LocalAssistantOrchestrator";
import { PosEngine } from "../chapter-two/PosEngine";
import { ReceptionEngine } from "../chapter-two/ReceptionEngine";
import type { ChapterTwoStore } from "../chapter-two/types";
import { SqliteChapterTwoStore } from "../infrastructure/sqlite/SqliteChapterTwoStore";
import { PostgresChapterTwoStore } from "../infrastructure/postgres/PostgresChapterTwoStore";
import { BusinessIdentity } from "./BusinessIdentity";
import { ChapterFiveService } from "../chapter-five/ChapterFiveService";
import { ReportingService } from "../reporting/ReportingService";
import { DominicanFiscalEngine } from "../fiscal/DominicanFiscalEngine";
import { CommerceEngine } from "../commerce/CommerceEngine";
import { ProductMediaAutomation } from "../media/ProductMediaAutomation";
import { CommerceCatalogSearch } from "../commerce/CommerceCatalogSearch";
import { CommercePaymentEngine } from "../commerce/CommercePaymentEngine";

export const BUSINESS_SESSION_COOKIE = "laex_business_session";
export interface BusinessRuntime { store: ChapterTwoStore; businessEngine: ChapterTwoEngine; posEngine: PosEngine; assistantOrchestrator: LocalAssistantOrchestrator; businessIdentity: BusinessIdentity; chapterFive: ChapterFiveService; reporting: ReportingService; fiscal: DominicanFiscalEngine; commerce:CommerceEngine; commerceCatalog:CommerceCatalogSearch; commercePayments:CommercePaymentEngine }
let singleton: BusinessRuntime | undefined;
let laboratorySingleton: BusinessRuntime | undefined;

function createRuntime(store: ChapterTwoStore, secret: string): BusinessRuntime {
  const businessEngine = new ChapterTwoEngine(store), posEngine = new PosEngine(store), receptionEngine = new ReceptionEngine(store), reporting = new ReportingService(store);
  const businessIdentity = new BusinessIdentity(store, secret);
  const media=new ProductMediaAutomation(store);
  const chapterFive=new ChapterFiveService(store,businessIdentity,undefined,undefined,media),assistantOrchestrator=new LocalAssistantOrchestrator(store,businessEngine,receptionEngine,reporting,undefined,undefined,undefined,chapterFive);
  return { store, businessEngine, posEngine, assistantOrchestrator, businessIdentity, chapterFive, reporting, fiscal: new DominicanFiscalEngine(store),commerce:new CommerceEngine(store,undefined,undefined,media),commerceCatalog:new CommerceCatalogSearch(store),commercePayments:new CommercePaymentEngine(store) };
}

export function getBusinessRuntime(): BusinessRuntime {
  if (singleton) return singleton;
  const allowFallback = process.env.NODE_ENV !== "production" && process.env.BUSINESS_ALLOW_INSECURE_LOCAL_FALLBACK === "true" && !process.env.BUSINESS_DATABASE_URL;
  const secret = process.env.BUSINESS_SESSION_SECRET ?? (allowFallback ? "laex-business-local-session-secret-change-me" : "");
  if (!secret) throw new Error("BUSINESS_SESSION_SECRET is required in production");
  const store = process.env.BUSINESS_DATABASE_URL ? PostgresChapterTwoStore.fromUrl(process.env.BUSINESS_DATABASE_URL) : new SqliteChapterTwoStore(process.env.BUSINESS_DATABASE_PATH ?? join(process.cwd(), ".data", "business-engine.sqlite"));
  if (process.env.NODE_ENV === "production" && !(store instanceof PostgresChapterTwoStore)) throw new Error("PostgreSQL is required in production");
  singleton = createRuntime(store, secret);
  return singleton;
}

export function getLaboratoryBusinessRuntime(): BusinessRuntime {
  if (process.env.NODE_ENV === "production") throw new Error("laboratory_disabled_in_production");
  if (laboratorySingleton) return laboratorySingleton;
  const secret = process.env.BUSINESS_LAB_SESSION_SECRET ?? "laex-laboratory-session-secret-development-only";
  laboratorySingleton = createRuntime(new SqliteChapterTwoStore(process.env.BUSINESS_LAB_DATABASE_PATH ?? join(process.cwd(), ".data", "business-engine.sqlite")), secret);
  return laboratorySingleton;
}
