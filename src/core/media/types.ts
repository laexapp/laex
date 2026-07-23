export type MediaProvider =
  | "youtube"
  | "vimeo"
  | "tiktok"
  | "facebook"
  | "instagram"
  | "local";

export type MediaCategory =
  | "video"
  | "short"
  | "live"
  | "playlist";

export interface MediaSource {
  provider: MediaProvider;
  url: string;
  id: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  source: MediaSource;
  category: MediaCategory;
  publishedAt?: string;
  duration?: string;
}

export interface ProjectMediaConfig {
  provider: MediaProvider;
  channelId?: string;
  playlistId?: string;
  featured?: boolean;
}

/**
 * Información de un canal de YouTube
 * almacenada por LAEX.
 */
export interface YouTubeChannel {
  id: string;
  handle: string;
  title: string;
  url: string;

  thumbnail?: string;
  banner?: string;

  subscribers?: number;
  videos?: number;

  description?: string;

  verified?: boolean;

  lastSync?: string;
}