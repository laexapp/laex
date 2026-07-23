/**
 * ==========================================================
 * LAEX Media Engine
 * ==========================================================
 * Tipos universales para cualquier proveedor multimedia.
 * Ningún componente debe depender directamente de YouTube,
 * Vimeo u otra plataforma.
 * ==========================================================
 */

export type MediaProvider =
  | "youtube"
  | "vimeo"
  | "podcast"
  | "custom";

export type MediaCategory =
  | "featured"
  | "presentation"
  | "tutorial"
  | "launch"
  | "event"
  | "interview"
  | "ama"
  | "education"
  | "news"
  | "other";

export interface MediaItem {
  /**
   * Identificador interno del contenido.
   */
  id: string;

  /**
   * Plataforma de origen.
   */
  provider: MediaProvider;

  /**
   * ID del video en la plataforma.
   * Ejemplo YouTube:
   * kFlxBEQCnYc
   */
  sourceId: string;

  /**
   * URL pública.
   */
  url: string;

  /**
   * Título.
   */
  title: string;

  /**
   * Descripción.
   */
  description?: string;

  /**
   * Imagen principal.
   */
  thumbnail: string;

  /**
   * Categoría.
   */
  category: MediaCategory;

  /**
   * Video destacado.
   */
  featured?: boolean;

  /**
   * Contenido oficial.
   */
  official?: boolean;

  /**
   * Fecha de publicación.
   */
  publishedAt?: string;

  /**
   * Duración.
   * Ejemplo:
   * 12:35
   */
  duration?: string;
}

export interface MediaSource {
  provider: MediaProvider;

  /**
   * Identificador del canal.
   * Ejemplo:
   * UCxxxxxxxxxxxx
   */
  channelId?: string;

  /**
   * Playlist específica.
   */
  playlistId?: string;
}

export interface ProjectMediaConfig {
  enabled: boolean;

  sources: MediaSource[];
}