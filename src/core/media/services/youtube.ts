import {
  MediaItem,
  YouTubeChannel,
} from "../types";

import {
  YouTubeVideoInput,
  mapYouTubeVideo,
} from "../providers/youtube";

export interface YouTubeMediaService {
  mapVideo(video: YouTubeVideoInput): MediaItem | null;

  getChannel(
    handle: string
  ): Promise<YouTubeChannel | null>;
}

export class DefaultYouTubeMediaService
  implements YouTubeMediaService
{
  mapVideo(
    video: YouTubeVideoInput
  ): MediaItem | null {
    return mapYouTubeVideo(video);
  }

  async getChannel(
    handle: string
  ): Promise<YouTubeChannel | null> {
    /**
     * Próximamente aquí consultaremos
     * la API de YouTube.
     */

    return {
      id: "",
      handle,
      title: "",
      url: `https://www.youtube.com/${handle}`,
    };
  }
}

export const youtubeMediaService =
  new DefaultYouTubeMediaService();