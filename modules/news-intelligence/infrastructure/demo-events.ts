import type { NewsEvent } from "../domain/types";

export const newsEvents: NewsEvent[] = [
  {
    id:"evt-001", slug:"bitcoin-liquidez-institucional", title:"Bitcoin concentra la atención institucional mientras mejora la liquidez", summary:"Las mesas de mercado observan un aumento de profundidad y volumen. LAEX agrupa cinco coberturas que describen el mismo movimiento.", category:"Mercados", sector:"Activos digitales", urgency:"urgent", publishedAt:"2026-08-03T13:42:00-04:00", imageTone:"orange",
    sources:["CoinDesk","Reuters","The Block","Bloomberg","Cointelegraph"].map((name,i)=>({name,url:"#fuentes",publishedAt:`2026-08-03T${13-i}:20:00-04:00`})),
    assets:[{name:"Bitcoin",symbol:"BTC",slug:"bitcoin",change:2.84,volumeChange:18.6}], projects:[],
    intelligence:{meaning:"Más capital puede entrar o salir sin mover tanto el precio, una señal de mercado más profundo; no garantiza una tendencia alcista.",facts:["Cinco fuentes cubren el mismo evento.","El volumen observado aumentó 18,6% en la ventana asociada.","Bitcoin avanzó 2,84% en la ventana mostrada."],interpretation:"La coincidencia entre precio, volumen y cobertura institucional eleva la relevancia, aunque aún falta confirmación en horizontes más largos.",impact:"Alto",sentiment:"Positivo",risk:"Una reversión rápida invalidaría la lectura de continuidad.",opportunity:"Vigilar confirmación de volumen y profundidad antes de interpretar una ruptura.",confidence:87},
    timeline:[{date:"Hoy · 13:42",label:"LAEX consolida cinco coberturas"},{date:"Hoy · 12:55",label:"Acelera el volumen agregado"},{date:"30 jul",label:"Primer incremento de profundidad"}]
  },
  {
    id:"evt-002", slug:"solana-estabilidad-red", title:"Solana refuerza la estabilidad de red tras una actualización coordinada", summary:"Validadores y equipos del ecosistema reportan mejoras operativas. El impacto se concentra en infraestructura, DeFi y aplicaciones de alto tráfico.", category:"Blockchain", sector:"Infraestructura", urgency:"normal", publishedAt:"2026-08-03T11:18:00-04:00", imageTone:"purple",
    sources:["Solana Foundation","The Block","Decrypt"].map((name,i)=>({name,url:"#fuentes",publishedAt:`2026-08-03T${11-i}:18:00-04:00`})),
    assets:[{name:"Solana",symbol:"SOL",slug:"solana",change:1.36,volumeChange:7.9}], projects:[],
    intelligence:{meaning:"Una red más estable reduce interrupciones para usuarios y aplicaciones, pero su efecto debe validarse durante periodos de alta demanda.",facts:["Tres fuentes describen la misma actualización.","La variación de SOL es 1,36% en la ventana asociada."],interpretation:"La mejora operativa fortalece la confianza de desarrolladores si se mantiene bajo carga real.",impact:"Medio",sentiment:"Positivo",risk:"La actualización todavía debe superar episodios de congestión extrema.",opportunity:"Aplicaciones sensibles a latencia podrían beneficiarse de mayor previsibilidad.",confidence:82}, timeline:[{date:"Hoy · 11:18",label:"Actualización coordinada"},{date:"1 ago",label:"Validadores completan pruebas"}]
  },
  {
    id:"evt-003", slug:"marco-stablecoins-latam", title:"Nuevo marco regional para stablecoins entra en fase de consulta", summary:"La propuesta aborda reservas, transparencia y protección al usuario. Empresas y emisores preparan observaciones técnicas.", category:"Regulación", sector:"Stablecoins", urgency:"critical", publishedAt:"2026-08-03T09:05:00-04:00", imageTone:"cyan",
    sources:["Regulador regional","Reuters"].map((name,i)=>({name,url:"#fuentes",publishedAt:`2026-08-03T0${9-i}:05:00-04:00`})), assets:[], projects:[],
    intelligence:{meaning:"Las reglas podrían cambiar cómo se emiten y ofrecen stablecoins en la región; por ahora es una consulta, no una norma vigente.",facts:["La propuesta está en consulta pública.","Incluye requisitos sobre reservas y divulgación."],interpretation:"El texto apunta a mayor trazabilidad, con costes adicionales de cumplimiento para operadores.",impact:"Alto",sentiment:"Neutral",risk:"Confundir una consulta con una obligación vigente puede llevar a decisiones prematuras.",opportunity:"Participar temprano permite anticipar procesos y aportar evidencia técnica.",confidence:91}, timeline:[{date:"Hoy · 09:05",label:"Se abre consulta pública"},{date:"15 jul",label:"Mesa técnica preliminar"}]
  },
  {
    id:"evt-004", slug:"laex-media-market-signal", title:"LAEX conecta señales de mercado con el flujo de Media Intelligence", summary:"El nuevo puente convierte eventos verificados en briefs reutilizables sin duplicar información editorial.", category:"Ecosistema LAEX", sector:"LAEX", urgency:"normal", publishedAt:"2026-08-02T18:30:00-04:00", imageTone:"green",
    sources:[{name:"LAEX · Registro de producto",url:"#fuentes",publishedAt:"2026-08-02T18:30:00-04:00"}], assets:[], projects:[{name:"Media Intelligence",slug:"media-intelligence",status:"Operativo"}],
    intelligence:{meaning:"Una misma evidencia puede alimentar análisis y producción editorial conservando su procedencia.",facts:["El flujo usa un identificador único por evento.","Las salidas editoriales mantienen vínculo con las fuentes."],interpretation:"La conexión reduce duplicación y mejora la trazabilidad entre equipos.",impact:"Medio",sentiment:"Positivo",risk:"Una fuente mal clasificada puede propagarse a varios formatos.",opportunity:"Crear artículos, videos y publicaciones desde un brief validado.",confidence:96}, timeline:[{date:"Ayer · 18:30",label:"Puente habilitado"},{date:"31 jul",label:"Prueba de trazabilidad completada"}]
  }
];

export function findNewsEvent(slug:string){ return newsEvents.find(event=>event.slug===slug); }
