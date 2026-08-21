export type ProductMediaAsset=
 |{id:string;type:'image';src?:string;alt:string;label:string}
 |{id:string;type:'video';src:string;poster?:string;label:string}
 |{id:string;type:'model-3d';src:string;poster:string;label:string};
export interface ProductExperience{slug:string;tagline:string;promise:string;accent:'cyan'|'magenta'|'yellow';media:ProductMediaAsset[];metrics:{value:string;label:string;detail:string}[];benefits:{title:string;description:string}[];anatomy:{id:string;label:string;position:{x:number;y:number};what:string;why:string;benefit:string}[];accessories:string[];maintenance:string[];savings:{headline:string;explanation:string;disclaimer:string};faqs:{question:string;answer:string}[]}
