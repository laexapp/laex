import type { CampaignSummary, ConnectedChannel, MediaWorkspace, TenantId, UserId, WorkspaceId } from "../domain/types";

const tenantId = "tenant_laex_demo" as TenantId;

export const demoIdentity = {
  tenantId,
  userId: "user_demo_ceo" as UserId,
  displayName: "CEO",
};

export const demoWorkspaces: MediaWorkspace[] = [
  { id: "ws_omm" as WorkspaceId, tenantId, name: "OneMillionMiners", kind: "investment-project", role: "owner", color: "#55D9F4", channelCount: 7, campaignCount: 18 },
  { id: "ws_lfp" as WorkspaceId, tenantId, name: "LF-PRINTER", kind: "company", role: "admin", color: "#A78BFA", channelCount: 4, campaignCount: 9 },
  { id: "ws_personal" as WorkspaceId, tenantId, name: "Canal Personal", kind: "creator", role: "editor", color: "#F6C65B", channelCount: 3, campaignCount: 6 },
  { id: "ws_academy" as WorkspaceId, tenantId, name: "Academia", kind: "academy", role: "reviewer", color: "#4ADE80", channelCount: 5, campaignCount: 12 },
];

export const demoChannels: ConnectedChannel[] = [
  { id: "ch_youtube", tenantId, workspaceId: "ws_omm" as WorkspaceId, platform: "youtube", label: "OneMillionMiners", status: "connected", pluginVersion: "planned-v1" },
  { id: "ch_instagram", tenantId, workspaceId: "ws_omm" as WorkspaceId, platform: "instagram", label: "@onemillionminers", status: "connected", pluginVersion: "planned-v1" },
  { id: "ch_facebook", tenantId, workspaceId: "ws_omm" as WorkspaceId, platform: "facebook", label: "OneMillionMiners", status: "connected", pluginVersion: "planned-v1" },
  { id: "ch_tiktok", tenantId, workspaceId: "ws_omm" as WorkspaceId, platform: "tiktok", label: "@onemillionminers", status: "attention", pluginVersion: "planned-v1" },
];

export const demoCampaigns: CampaignSummary[] = [
  { id: "cmp_x03", tenantId, workspaceId: "ws_omm" as WorkspaceId, title: "Todo comienza con una decisión", sourceType: "video", status: "review", confidence: 94.8, generatedAssets: 16, updatedAt: "Hace 8 min" },
  { id: "cmp_education", tenantId, workspaceId: "ws_omm" as WorkspaceId, title: "Minería digital explicada", sourceType: "article", status: "scheduled", confidence: 91.2, generatedAssets: 11, updatedAt: "Hace 2 h" },
  { id: "cmp_community", tenantId, workspaceId: "ws_omm" as WorkspaceId, title: "Historias de la comunidad", sourceType: "video", status: "published", confidence: 96.1, generatedAssets: 14, updatedAt: "Ayer" },
];

export const learningTopics = [
  { id: "start", title: "Empieza aquí", description: "Qué es Media Intelligence y cómo transforma una pieza en un ecosistema.", duration: "3 min" },
  { id: "workspaces", title: "Workspaces", description: "Separa marcas, clientes o proyectos con permisos y datos independientes.", duration: "4 min" },
  { id: "channels", title: "Canales", description: "Comprende cómo funcionarán las conexiones seguras mediante plugins.", duration: "5 min" },
  { id: "analysis", title: "Análisis IA", description: "Aprende a interpretar confianza, riesgos, temas y procedencia.", duration: "6 min" },
  { id: "campaigns", title: "Campañas", description: "Organiza activos, revisiones, programación y decisiones humanas.", duration: "5 min" },
  { id: "analytics", title: "Analytics", description: "Convierte métricas multicanal en próximas acciones claras.", duration: "4 min" },
];

export const useCases = [
  ["Soy YouTuber", "Convierte cada video en clips, artículos, posts y aprendizaje editorial."],
  ["Tengo una empresa", "Coordina marcas, equipos, permisos y campañas sin mezclar información."],
  ["Tengo una academia", "Transforma clases en guías, microcontenidos, FAQs y campañas educativas."],
  ["Tengo un podcast", "Convierte episodios en conocimiento distribuible y medible."],
  ["Administro una comunidad", "Detecta conversaciones, prepara anuncios y aprende del impacto."],
  ["Promociono un proyecto", "Comunica con trazabilidad, revisión humana y control de riesgos."],
];
