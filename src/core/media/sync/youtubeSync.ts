import { projectRepository } from "@/src/core/projects/identity";
import type { SyncResult } from "./types";

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

    return {
      success: true,
      data: {
        channelUrl: project.social.youtube.channelUrl,
        featuredVideo: project.social.youtube.featuredVideo,
        featuredVideos: project.social.youtube.featuredVideos,
      },
    };
  }
}

export const youtubeSync = new YouTubeSync();