import { getYouTubeVideoId } from "./urls";

export function getYouTubeThumbnail(
  url: string,
  quality: "default" | "mq" | "hq" | "sd" | "max" = "hq"
): string | null {
  const id = getYouTubeVideoId(url);

  if (!id) {
    return null;
  }

  const qualityMap = {
    default: "default",
    mq: "mqdefault",
    hq: "hqdefault",
    sd: "sddefault",
    max: "maxresdefault",
  } as const;

  return `https://img.youtube.com/vi/${id}/${qualityMap[quality]}.jpg`;
}