import { projectRepository } from "@/src/core/projects/identity";

import { youtubeSync } from "./sync";
import { youtubeMediaService } from "./services/youtube";

import type { MediaItem } from "./types";

class MediaRepository {
  getFeaturedVideos(projectSlug: string): MediaItem[] {
    const project = projectRepository.getBySlug(projectSlug);

    if (!project) {
      return [];
    }

    const result = youtubeSync.sync(projectSlug);

    if (!result.success || !result.data) {
      return [];
    }

    const { data } = result;

    return data.featuredVideos
      .map((url, index) =>
        youtubeMediaService.mapVideo({
          title: `${project.identity.name} • Video ${index + 1}`,
          url,
          channelUrl: data.channelUrl,
          description:
            "Contenido oficial obtenido desde el motor de sincronización.",
        })
      )
      .filter((item): item is MediaItem => item !== null);
  }
}

export const mediaRepository = new MediaRepository();