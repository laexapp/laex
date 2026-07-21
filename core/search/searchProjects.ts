import { Project } from "@/core/types/project";

type SearchOptions = {
  query: string;
};

type SearchResult = {
  project: Project;
  score: number;
};

export function searchProjects(
  projects: Project[],
  { query }: SearchOptions
): SearchResult[] {
  const search = query.trim().toLowerCase();

  if (!search) {
    return projects.map((project) => ({
      project,
      score: 0,
    }));
  }

  return projects
    .map((project) => {
      let score = 0;

      if (project.name.toLowerCase().includes(search)) {
        score += 100;
      }

      if (project.category.toLowerCase().includes(search)) {
        score += 40;
      }

      if (
        project.description
          .toLowerCase()
          .includes(search)
      ) {
        score += 25;
      }

      if (
        project.tags.some((tag) =>
          tag.toLowerCase().includes(search)
        )
      ) {
        score += 20;
      }

      if (
        project.highlights.some((highlight) =>
          highlight.toLowerCase().includes(search)
        )
      ) {
        score += 10;
      }

      return {
        project,
        score,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}