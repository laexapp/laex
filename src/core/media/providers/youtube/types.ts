export interface YouTubeChannel {
  handle?: string;

  url: string;

  featuredVideo?: string;

  featuredVideos: string[];
}

export interface YouTubeVideoInput {
  title: string;

  url: string;

  description?: string;

  channelHandle?: string;

  channelUrl?: string;
}