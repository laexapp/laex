export type ShowroomMedia={type:'image'|'video'|'spin-360'|'model-3d'|'comparison';src?:string;poster?:string;alt:string};
export interface ShowroomScene{id:string;kind:string;eyebrow:string;title:string;subtitle:string;description:string;features:string[];metrics:{value:string;label:string}[];lia:string;cta:{label:string;href:string};media:ShowroomMedia;accent:string}
