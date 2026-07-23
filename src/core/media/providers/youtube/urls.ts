const YOUTUBE_DOMAINS = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
] as const;

export function isYouTubeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    return YOUTUBE_DOMAINS.includes(
      parsed.hostname as (typeof YOUTUBE_DOMAINS)[number]
    );
  } catch {
    return false;
  }
}

export function getYouTubeVideoId(url: string): string | null {
  if (!isYouTubeUrl(url)) {
    return null;
  }

  const parsed = new URL(url);

  if (parsed.hostname === "youtu.be") {
    return parsed.pathname.replace("/", "") || null;
  }

  const id = parsed.searchParams.get("v");

  if (id) {
    return id;
  }

  const parts = parsed.pathname.split("/");

  const embedIndex = parts.indexOf("embed");

  if (embedIndex >= 0 && parts[embedIndex + 1]) {
    return parts[embedIndex + 1];
  }

  const shortsIndex = parts.indexOf("shorts");

  if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
    return parts[shortsIndex + 1];
  }

  return null;
}

export function getYouTubeChannelHandle(
  url: string
): string | null {
  if (!isYouTubeUrl(url)) {
    return null;
  }

  const parsed = new URL(url);

  const parts = parsed.pathname
    .split("/")
    .filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  if (parts[0].startsWith("@")) {
    return parts[0];
  }

  return null;
}

export function isYouTubeChannelUrl(
  url: string
): boolean {
  return getYouTubeChannelHandle(url) !== null;
}