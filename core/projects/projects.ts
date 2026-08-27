import { Project } from "../types/project";
import { PUBLIC_ORIGINS } from "../config/public-origins";

export const projects: Project[] = [
  {
    id: "onemillionminers",

    name: "OneMillionMiners",

    category: "Minería Digital",

    status: "En Desarrollo",

    launchDate: "Julio 2026",

    lastUpdate: "01 Julio 2026",

    description:
      "Primer proyecto que será analizado mediante el sistema inteligente de confianza de LAEX.",

    website: "https://onemillionminers.com",

    registerLink: "https://TU-LINK-DE-REGISTRO",

    referralCode: "TU-USUARIO",

    whitepaper: "",

    telegram: "",

    twitter: "",

    youtube: "",

    logo: "/projects/onemillionminers/logo.png",

    banner: "/projects/onemillionminers/launch-official-2026.png",

    trustIndex: 0,

    riskLevel: 0,

    communityScore: 0,

    aiScore: 0,

    highlights: [
      "Minería digital automatizada",
      "Análisis mediante IA de LAEX",
      "Tecnología Blockchain",
    ],

    tags: [
      "Minería",
      "Blockchain",
      "Web3",
      "IA",
    ],

    timeline: [
      {
        date: "Junio 2026",
        title: "Presentación del Proyecto",
        description:
          "OneMillionMiners fue presentado oficialmente a la comunidad.",
      },
      {
        date: "Julio 2026",
        title: "Inicio del Desarrollo",
        description:
          "Comienza la integración dentro del ecosistema LAEX.",
      },
    ],

    gallery: [],
  },

  {
    id: "omd",

    name: "OMD Pool",

    category: "Staking",

    status: "Pre-Lanzamiento",

    launchDate: "2026",

    lastUpdate: "2026",

    description:
      "Pool inteligente del ecosistema OMD integrado a LAEX.",

    website: "",

    registerLink: "",

    referralCode: "",

    whitepaper: "",

    telegram: "",

    twitter: "",

    youtube: "",

    logo: "/projects/omd/coin.png",

    banner: "/projects/omd/banner.png",

    trustIndex: 0,

    riskLevel: 0,

    communityScore: 0,

    aiScore: 0,

    highlights: [
      "Pool inteligente",
      "Staking automatizado",
      "Integración con el ecosistema OMD",
    ],

    tags: [
      "Pool",
      "Staking",
    ],

    timeline: [],

    gallery: [],
  },

  {
    id: "omdb",

    name: "DIGITAL ASSET INTELLIGENCE",

    category: "Mercado · Blockchain · Evidencia",

    status: "Activo",

    launchDate: "2026",

    lastUpdate: "2026",

    description:
      "Terminal multi-activo con datos de mercado, actividad on-chain y evidencia verificable. Incluye OMDB y OMD.",

    website: "",

    registerLink: "",

    referralCode: "",

    whitepaper: "",

    telegram: "",

    twitter: "",

    youtube: "",

    logo: "/projects/omdb/coin.png",

    banner: "/projects/omdb/banner.png",

    trustIndex: 0,

    riskLevel: 0,

    communityScore: 0,

    aiScore: 0,

    highlights: [
      "Blockchain propia",
      "Infraestructura descentralizada",
      "Integración con el ecosistema LAEX",
    ],

    tags: [
      "Blockchain",
    ],

    timeline: [],

    gallery: [],
  },
  {
    id: "lf-printer",
    name: "LF-PRINTER",
    category: "Empresa / Comercio",
    status: "Activo",
    launchDate: "2026",
    lastUpdate: "Agosto 2026",
    description:
      "Tienda, servicios técnicos y soluciones de impresión integradas al ecosistema LAEX.",
    website: PUBLIC_ORIGINS.lfPrinter,
    cardCta: "Ir a la empresa",
    cardExternal: true,
    registerLink: "",
    referralCode: "",
    whitepaper: "",
    telegram: "",
    twitter: "",
    youtube: "",
    logo: "/assets/lf-printer/official/logos/lf-printer-logo-on-dark.png",
    banner: "/assets/lf-printer/official/printers/wf-4830-desktop.webp",
    trustIndex: 0,
    riskLevel: 0,
    communityScore: 0,
    aiScore: 0,
    highlights: ["Tienda y catálogo comercial", "Servicios técnicos especializados", "Experiencia empresarial integrada a LAEX"],
    tags: ["Empresa", "Comercio", "Impresión", "Servicios técnicos"],
    timeline: [],
    gallery: [],
  },
];
