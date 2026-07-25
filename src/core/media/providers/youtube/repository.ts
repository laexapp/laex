import type { MediaItem } from "@/src/core/media/types";
import type { YouTubeChannel } from "./types";

import { youtubeMediaService } from "@/src/core/media/services/youtube";

class YouTubeRepository {
  getFeaturedVideos(
    channel: YouTubeChannel,
    projectName: string
  ): MediaItem[] {
    return channel.featuredVideos
      .map((url, index) =>
        youtubeMediaService.mapVideo({
          title: `${projectName} • Video ${index + 1}`,
          url,
          description:
            "Contenido oficial obtenido desde YouTube.",
        })
      )
      .filter((item): item is MediaItem => item !== null);
  }
}

export const youtubeRepository =
  new YouTubeRepository();