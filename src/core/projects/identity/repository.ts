import { projectIdentity } from "./projectIdentity";
import type { ProjectIdentity } from "./types";

class ProjectRepository {
  /**
   * Obtiene un proyecto por su slug.
   */
  getBySlug(slug: string): ProjectIdentity | null {
    const projects = Object.values(projectIdentity);

    return (
      projects.find(
        (project) => project.identity.slug === slug
      ) ?? null
    );
  }

  /**
   * Obtiene un proyecto por su ID.
   */
  getById(id: string): ProjectIdentity | null {
    const projects = Object.values(projectIdentity);

    return (
      projects.find(
        (project) => project.identity.id === id
      ) ?? null
    );
  }

  /**
   * Devuelve todos los proyectos.
   */
  getAll(): ProjectIdentity[] {
    return Object.values(projectIdentity);
  }
}

export const projectRepository = new ProjectRepository();