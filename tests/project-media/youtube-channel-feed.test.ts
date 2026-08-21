import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseYouTubeChannelFeed, YouTubeChannelFeedProvider } from "../../src/core/media/providers/youtube/channelFeed";

const feed = `<?xml version="1.0"?><feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/"><title>OMDMiners Spanish</title><entry><yt:videoId>AbCdEf123_4</yt:videoId><title>Minería &amp; comunidad</title><published>2026-08-16T10:00:00+00:00</published><media:description>Video oficial</media:description></entry></feed>`;

describe("OneMillionMiners YouTube channel feed", () => {
  it("parses official Atom entries without a catalog hardcoded in the page", () => {
    const parsed = parseYouTubeChannelFeed(feed);
    assert.equal(parsed.channelTitle, "OMDMiners Spanish");
    assert.deepEqual(parsed.entries, [{ videoId: "AbCdEf123_4", title: "Minería & comunidad", publishedAt: "2026-08-16T10:00:00+00:00", description: "Video oficial" }]);
  });

  it("maps feed videos and keeps official YouTube URLs", async () => {
    const provider = new YouTubeChannelFeedProvider(async () => new Response(feed, { status: 200 }));
    const result = await provider.list("UCkdBi4V7HJ8drz6gXkMVbug", "https://www.youtube.com/@OMDMinersSpanish/shorts");
    assert.equal(result.status, "live");
    assert.equal(result.videos[0]?.source.url, "https://www.youtube.com/watch?v=AbCdEf123_4");
    assert.equal(result.videos[0]?.source.channelUrl, "https://www.youtube.com/@OMDMinersSpanish/shorts");
  });

  it("fails closed and allows the repository fallback when YouTube is unavailable", async () => {
    const provider = new YouTubeChannelFeedProvider(async () => { throw new Error("offline"); });
    const result = await provider.list("UCkdBi4V7HJ8drz6gXkMVbug", "https://www.youtube.com/@OMDMinersSpanish/shorts");
    assert.equal(result.status, "unavailable");
    assert.deepEqual(result.videos, []);
  });

  it("rejects malformed channel identifiers before making a request", async () => {
    const provider = new YouTubeChannelFeedProvider(async () => { throw new Error("must not run"); });
    await assert.rejects(() => provider.list("not-a-channel", "https://youtube.com"), /Channel ID inválido/);
  });
});
