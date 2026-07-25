import { youtubeMediaService } from "./services/youtube";
import type { MediaItem } from "./types";

class MediaRepository {
  getFeaturedVideos(urls: string[], projectName: string): MediaItem[] {
    return urls
      .map((url, index) =>
        youtubeMediaService.mapVideo({
          title: `${projectName} • Video ${index + 1}`,
          url,
          description:
            "Contenido oficial obtenido desde la configuración multimedia del proyecto.",
        })
      )
      .filter((item): item is MediaItem => item !== null);
  }
}

export const mediaRepository = new MediaRepository();