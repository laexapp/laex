const root='/assets/lf-printer/official';
export const mediaManifest={
 logo:{primary:`${root}/logos/lf-printer-logo-primary.png`,light:`${root}/logos/lf-printer-logo-on-dark.png`,dark:`${root}/logos/lf-printer-logo-on-dark.png`},
 printer:(slug:string)=>({hero:`${root}/printers/${slug}-hero.webp`,transparent:`${root}/printers/${slug}-transparent.png`,desktop:`${root}/printers/${slug}-desktop.webp`,tablet:`${root}/printers/${slug}-tablet.webp`,mobile:`${root}/printers/${slug}-mobile.webp`,video:`${root}/videos/${slug}-demo.mp4`,spin:`${root}/360/${slug}/manifest.json`}),
 background:(id:string)=>`${root}/backgrounds/${id}.webp`,icon:(id:string)=>`${root}/icons/${id}.svg`,
}as const;
