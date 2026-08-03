import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:["/market","/market/","/methodology","/promote","/promote/","/proyectos"],disallow:["/api/","/settings","/configuracion","/profile","/perfil"]},sitemap:"https://laex.vercel.app/sitemap.xml"};}
