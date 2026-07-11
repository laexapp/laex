export interface Project {
  id: string;

  name: string;

  slogan: string;

  description: string;

  banner: string;

  logo: string;

  coin?: string | null;

  price?: string | null;

  change24h?: string | null;

  users: string;

  badge: string;

  action: string;

  url: string;

  color: string;

  active: boolean;
}