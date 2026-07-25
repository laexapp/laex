export interface ProjectIdentityInfo {
  id: string;
  name: string;
  slug: string;
}

export interface ProjectYouTube {
  channelHandle?: string;

  channelUrl: string;

  /**
   * Video principal mostrado
   * en la página del proyecto.
   */
  featuredVideo?: string;

  /**
   * Lista de videos destacados.
   */
  featuredVideos: string[];
}

export interface ProjectSocial {
  youtube?: ProjectYouTube;

  facebook?: string;
  instagram?: string;
  x?: string;
  telegram?: string;
  discord?: string;
  whatsapp?: string;
  website?: string;
}

export interface ProjectIdentity {
  identity: ProjectIdentityInfo;
  social: ProjectSocial;
}

export type ProjectIdentityRegistry = Record<
  string,
  ProjectIdentity
>;