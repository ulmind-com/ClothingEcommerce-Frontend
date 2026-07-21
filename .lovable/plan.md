## Add auto-playing Video Reel section after "Explore the world of Maison"

A new editorial section between `CategoriesBento` and `NewArrivalsRail` on the home page. Full-bleed cinematic video that autoplays muted, loops, and cycles to the next video automatically. Data-driven from a future `/videos` backend endpoint that you'll wire up from the existing admin panel — no backend/admin changes from my side.

### What it looks like

- Full-width section, `bg-ink`, generous vertical padding
- Centered eyebrow (`Film`) + display heading (e.g. "The House in Motion") + italic subtitle
- Below: large cinematic video stage, `aspect-[16/9]` on desktop / `aspect-[4/5]` on mobile, subtle vignette + grain overlay
- Video plays muted + inline + looped; when it ends (or after configured duration), crossfades to the next one
- Progress bar at the bottom fills across the current video's duration
- Small pagination dots + prev/next chevrons (desktop only, fade in on hover) — same visual language as the hero
- Optional per-video title/caption overlaid bottom-left with a mask reveal
- Mute/unmute toggle bottom-right (starts muted so autoplay works in every browser)
- Respects `prefers-reduced-motion`: no auto-advance, no crossfade scaling

### Data source

`GET /videos` — endpoint doesn't exist yet; you'll add it to the existing admin panel later. Frontend assumes this shape and gracefully renders nothing if the endpoint 404s or returns `[]`:

```ts
type VideoItem = {
  id: string;
  video_url: string;   // mp4/webm URL uploaded via admin
  poster?: string;     // optional thumbnail shown before first frame
  title?: string;
  subtitle?: string;
  order: number;
  active: boolean;
};
```

Filter `active === true`, sort by `order`. If the list is empty, the whole section is hidden — no placeholder content, no mocks.

### Files

- `src/types/api.ts` — add `VideoItem` type
- `src/lib/api/queries.ts` — add `qk.videos` and `videosOptions()` using existing `get<VideoItem[]>("/videos")`. `staleTime: 60_000`. Use `useQuery` (not `useSuspenseQuery`) so a 404 while the endpoint doesn't exist yet degrades quietly instead of throwing at the route boundary
- `src/components/home/VideoReel.tsx` — new client component; owns playback state, auto-advance, dots, chevrons, mute toggle, progress bar
- `src/routes/index.tsx` — import `VideoReel` and mount it between `<CategoriesBento />` and `<NewArrivalsRail />`. Do NOT add it to the route loader (keeps a 404 from blocking hydration)

### Playback behavior

- `<video autoPlay muted playsInline loop={false} preload="metadata">`
- `onEnded` → advance to next video (wraps around)
- Additional safety timeout using `video.duration` in case `onEnded` misfires
- Crossfade transition (Framer Motion `AnimatePresence`) between videos, ~700ms
- Pause auto-advance on hover; also pause when the section is offscreen (`IntersectionObserver`) to save bandwidth
- Reduced motion: hard cuts instead of crossfade, still auto-advances

### Admin-panel contract (for your reference only, no code from me)

When you build the admin side, expose it as `/videos` returning the array above, and support create/update/delete/reorder. Use the existing `/upload/image` pattern's storage for mp4 uploads (or accept an external URL — the frontend just consumes `video_url`).

### Out of scope

- No backend endpoint, no admin UI, no upload flow
- No changes to hero, categories, or any other section
- No changes to existing admin panel
