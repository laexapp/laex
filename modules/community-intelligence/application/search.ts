import type { KnowledgeItem } from "../domain/types";
export function filterKnowledge(items:KnowledgeItem[],query:string,kind:string){const q=query.trim().toLocaleLowerCase("es");return items.filter(i=>(kind==="all"||i.kind===kind)&&(!q||[i.title,i.summary,i.ai.summary,...i.entities.flatMap(e=>[e.label,e.type])].join(" ").toLocaleLowerCase("es").includes(q)));}
