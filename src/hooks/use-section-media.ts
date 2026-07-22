import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api/client";

export interface SiteMediaItem {
  id: string;
  section: string;
  url: string;
  poster: string | null;
  title: string;
  subtitle: string;
  order: number;
  active: boolean;
}

export type SiteMedia = Record<string, SiteMediaItem[]>;

/** One request for the whole page — every section reads from this cache. */
export const siteMediaOptions = () => ({
  queryKey: ["site-media"] as const,
  queryFn: async () => {
    try {
      return await get<SiteMedia>("/site-media");
    } catch {
      // The storefront must still render on its bundled artwork if the
      // media service is unreachable.
      return {} as SiteMedia;
    }
  },
  staleTime: 60_000,
});

export interface MediaSlot {
  src: string;
  alt: string;
  poster?: string;
  title?: string;
  subtitle?: string;
  /** True when an admin upload is filling this slot. */
  managed: boolean;
}

/**
 * Merges admin uploads over the bundled defaults slot by slot: the first N
 * slots take whatever the admin has uploaded, the rest keep their shipped
 * artwork. Uploading two photos therefore swaps two, not the whole section.
 */
export function useSectionMedia(
  section: string,
  fallback: { src: string; alt: string; poster?: string }[],
): MediaSlot[] {
  const { data } = useQuery(siteMediaOptions());
  const managed = (data?.[section] ?? [])
    .filter((m) => m.active)
    .sort((a, b) => a.order - b.order);

  const length = Math.max(fallback.length, managed.length);

  return Array.from({ length }, (_, i) => {
    const item = managed[i];
    const base = fallback[i];

    if (item) {
      return {
        src: item.url,
        alt: item.title || base?.alt || "",
        poster: item.poster ?? undefined,
        title: item.title || undefined,
        subtitle: item.subtitle || undefined,
        managed: true,
      };
    }
    return {
      src: base.src,
      alt: base.alt,
      poster: base.poster,
      managed: false,
    };
  });
}
