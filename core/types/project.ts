export type TimelineItem = {
  date: string;
  title: string;
  description: string;
};

export type GalleryItem = {
  title: string;
  image: string;
};

export type Project = {
  id: string;

  name: string;

  category: string;

  status: string;

  launchDate: string;

  lastUpdate: string;

  description: string;

  website: string;

  registerLink: string;

  referralCode: string;

  whitepaper: string;

  telegram: string;

  twitter: string;

  youtube: string;

  logo: string;

  banner: string;

  trustIndex: number;

  communityScore: number;

  aiScore: number;

  riskLevel: number;

  highlights: string[];

  tags: string[];

  timeline: TimelineItem[];

  gallery: GalleryItem[];
};