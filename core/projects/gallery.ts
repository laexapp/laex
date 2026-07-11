export type GalleryImage = {
  id: string;

  title: string;

  image: string;
};

export function getProjectGallery(projectId: string): GalleryImage[] {
  switch (projectId) {
    case "onemillionminers":
      return [
        {
          id: "ecosystem",
          title: "LAEX Ecosystem",
          image: "/projects/onemillionminers/ecosystem.png",
        },

        {
          id: "strategy",
          title: "Estrategia 10x10",
          image: "/projects/onemillionminers/strategy.png",
        },

        {
          id: "gallery-01",
          title: "Presentación Oficial",
          image: "/projects/onemillionminers/gallery-01.png",
        },

        {
          id: "banner",
          title: "Banner",
          image: "/projects/onemillionminers/banner.png",
        },

        {
          id: "spotlight",
          title: "Spotlight",
          image: "/projects/onemillionminers/spotlight.png",
        },
      ];

    default:
      return [];
  }
}