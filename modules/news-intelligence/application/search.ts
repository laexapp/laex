import type { NewsEvent } from "../domain/types";

export function searchNews(events: NewsEvent[], query: string, category: string) {
  const needle = query.trim().toLocaleLowerCase("es");
  return events.filter(event => {
    const categoryMatch = category === "Todas" || event.category === category;
    const searchable = [event.title,event.summary,event.category,event.sector,...event.assets.flatMap(a=>[a.name,a.symbol]),...event.projects.map(p=>p.name)].join(" ").toLocaleLowerCase("es");
    return categoryMatch && (!needle || searchable.includes(needle));
  });
}
