import { projects } from "./projects";

export function getProject(id: string) {
  return projects.find((project) => project.id === id);
}

export function getProjects() {
  return projects;
}