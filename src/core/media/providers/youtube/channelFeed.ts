import type { MediaItem } from "../../types";
import { mapYouTubeVideo } from "./mapper";

export type YouTubeFeedEntry = {
  videoId: string;
  title: string;
  publishedAt?: string;
  description?: string;
};

export type YouTubeChannelFeedResult = {
  channelId: string;
  channelTitle?: string;
  channelUrl: string;
  videos: MediaItem[];
  status: "live" | "empty" | "unavailable";
};

const decodeXml = (value: string) => value
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&quot;", '"')
  .replaceAll("&#39;", "'");

const field = (xml: string, expression: RegExp) => {
  const match = xml.match(expression);
  return match?.[1] ? decodeXml(match[1].trim()) : undefined;
};

export function parseYouTubeChannelFeed(xml: string): { channelTitle?: string; entries: YouTubeFeedEntry[] } {
  const channelTitle = field(xml, /<title>([\s\S]*?)<\/title>/i);
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)].flatMap(match => {
    const entry = match[1];
    const videoId = field(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/i);
    const title = field(entry, /<title>([\s\S]*?)<\/title>/i);
    if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId) || !title) return [];
    return [{
      videoId,
      title,
      publishedAt: field(entry, /<published>([^<]+)<\/published>/i),
      description: field(entry, /<media:description>([\s\S]*?)<\/media:description>/i),
    }];
  });
  return { channelTitle, entries };
}

export class YouTubeChannelFeedProvider {
  constructor(private readonly request: typeof fetch = fetch) {}

  async list(channelId: string, channelUrl: string): Promise<YouTubeChannelFeedResult> {
    if (!/^UC[A-Za-z0-9_-]{22}$/.test(channelId)) throw new Error("YouTube Channel ID inválido.");
    try {
      const init: RequestInit & { next: { revalidate: number; tags: string[] } } = {
        headers: { accept: "application/atom+xml, application/xml;q=0.9" },
        next: { revalidate: 1800, tags: [`youtube-channel:${channelId}`] },
        signal: AbortSignal.timeout(8000),
      };
      const response = await this.request(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, init);
      if (!response.ok) return { channelId, channelUrl, videos: [], status: "unavailable" };
      const parsed = parseYouTubeChannelFeed(await response.text());
      const videos = parsed.entries.slice(0, 15).map(entry => mapYouTubeVideo({
        title: entry.title,
        description: entry.description || "Contenido oficial de OMD Miners Spanish en YouTube.",
        url: `https://www.youtube.com/watch?v=${entry.videoId}`,
        channelUrl,
        publishedAt: entry.publishedAt,
      })).filter((item): item is MediaItem => item !== null);
      return { channelId, channelTitle: parsed.channelTitle, channelUrl, videos, status: videos.length ? "live" : "empty" };
    } catch {
      return { channelId, channelUrl, videos: [], status: "unavailable" };
    }
  }
}

export const youtubeChannelFeedProvider = new YouTubeChannelFeedProvider();
