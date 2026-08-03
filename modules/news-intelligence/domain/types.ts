export type NewsCategory = "Última hora" | "Mercados" | "IA" | "Blockchain" | "Regulación" | "Seguridad" | "Ecosistema LAEX";
export type ImpactLevel = "Bajo" | "Medio" | "Alto" | "Crítico";
export type Sentiment = "Positivo" | "Neutral" | "Negativo";

export interface NewsSource { name: string; url: string; publishedAt: string }
export interface RelatedAsset { name: string; symbol: string; slug: string; change: number; volumeChange: number }
export interface IntelligenceBrief {
  meaning: string;
  facts: string[];
  interpretation: string;
  impact: ImpactLevel;
  sentiment: Sentiment;
  risk: string;
  opportunity: string;
  confidence: number;
}
export interface NewsEvent {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: NewsCategory;
  sector: string;
  urgency: "normal" | "urgent" | "critical";
  publishedAt: string;
  sources: NewsSource[];
  assets: RelatedAsset[];
  projects: { name: string; slug: string; status: string }[];
  intelligence: IntelligenceBrief;
  timeline: { date: string; label: string }[];
  imageTone: "cyan" | "purple" | "orange" | "green";
}
