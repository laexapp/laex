import type { ProjectIdentityRegistry } from "./types";

export const projectIdentity: ProjectIdentityRegistry = {
  oneMillionMiners: {
    identity: {
      id: "one-million-miners",
      name: "OneMillionMiners",
      slug: "one-million-miners",
    },

    social: {
      youtube: {
        channelHandle:
          "@OMDMinersSpanish",

        channelId:
          "UCkdBi4V7HJ8drz6gXkMVbug",

        channelUrl:
          "https://www.youtube.com/@OMDMinersSpanish/shorts",

        featuredVideo:
          "https://youtu.be/JkaRmGY0cbo",

        featuredVideos: [
          "https://youtu.be/JkaRmGY0cbo",
        ],
      },

      whatsapp:
        "https://chat.whatsapp.com/HZMa95USZvnBITd7NI4Ot5",
    },
  },

  omdBlockchain: {
    identity: {
      id: "omd-blockchain",
      name: "OMDBlockchain",
      slug: "omd-blockchain",
    },

    social: {
      youtube: {
        channelHandle:
          "@OMDBlockchainOMDB",

        channelUrl:
          "https://www.youtube.com/@OMDBlockchainOMDB/videos",

        featuredVideos: [],
      },
    },
  },

  oneMillionDollar: {
    identity: {
      id: "one-million-dollar",
      name: "OneMillionDollar",
      slug: "one-million-dollar",
    },

    social: {
      youtube: {
        channelUrl:
          "https://www.youtube.com/channel/UCuDXXETbxXAUUIaabeGtqWg",

        featuredVideos: [],
      },
    },
  },
};
