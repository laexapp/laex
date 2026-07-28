import { projectRepository } from "@/src/core/projects/identity";

import type { SyncResult } from "./types";
import type { YouTubeSyncConfig } from "./contracts";

export interface YouTubeSyncData {
  channelUrl: string;
  featuredVideo?: string;
  featuredVideos: string[];
}

class YouTubeSync {
  sync(projectSlug: string): SyncResult<YouTubeSyncData> {
    const project = projectRepository.getBySlug(projectSlug);

    if (!project?.social.youtube) {
      return {
        success: false,
        data: null,
        error: "Project does not have a YouTube channel.",
      };
    }

    const config: YouTubeSyncConfig = {
      channelUrl: project.social.youtube.channelUrl,
      featuredVideo: project.social.youtube.featuredVideo,
      featuredVideos: project.social.youtube.featuredVideos,
    };

    return {
      success: true,
      data: config,
    };
  }
}

export const youtubeSync = new YouTubeSync();