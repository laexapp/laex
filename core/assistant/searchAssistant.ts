import { Project } from "@/core/types/project";

export type AssistantAnswer = {
  project: Project;
  title: string;
  message: string;
};

const STOP_WORDS = [
  "que",
  "qué",
  "es",
  "el",
  "la",
  "los",
  "las",
  "de",
  "del",
  "sobre",
  "acerca",
  "informacion",
  "información",
  "quiero",
  "saber",
  "hablame",
  "háblame",
  "dime",
  "explica",
  "explicame",
  "explícame",
  "mostrar",
  "muestrame",
  "muéstrame",
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function extractKeywords(question: string): string[] {
  return normalize(question)
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !STOP_WORDS.includes(word));
}

export function searchAssistant(
  projects: Project[],
  question: string
): AssistantAnswer | null {
  const keywords = extractKeywords(question);

  if (keywords.length === 0) {
    return null;
  }

  const project = projects.find((project) => {
    const searchable = normalize(
      [
        project.name,
        project.category,
        project.description,
        ...project.tags,
        ...project.highlights,
      ].join(" ")
    );

    return keywords.every((keyword) =>
      searchable.includes(keyword)
    );
  });

  if (!project) {
    return null;
  }

  return {
    project,
    title: project.name,
    message: project.description,
  };
}