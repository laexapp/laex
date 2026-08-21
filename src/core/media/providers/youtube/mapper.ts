import { MediaItem } from "../../types";
import { getYouTubeThumbnail } from "./thumbnails";
import { getYouTubeVideoId } from "./urls";

export interface YouTubeVideoInput {
  title: string;
  url: string;
  channelUrl?: string;
  description?: string;
  publishedAt?: string;
  duration?: string;
  category?: "video" | "short";
}

export function mapYouTubeVideo(
  video: YouTubeVideoInput
): MediaItem | null {
  const id = getYouTubeVideoId(video.url);

  if (!id) {
    return null;
  }

  return {
    id,
    title: video.title,
    description: video.description,
    thumbnail: getYouTubeThumbnail(video.url) ?? "",
    category: video.category ?? "video",
    publishedAt: video.publishedAt,
    duration: video.duration,
    source: {
      provider: "youtube",
      id,
      url: video.url,
      channelUrl: video.channelUrl,
    },
  };
}
