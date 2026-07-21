## Add 2 demo fallback videos to VideoReel

Backend `/videos` endpoint ekhono nei, tai `videosOptions()` empty array return korche ar section hidden. Fix: jokhon backend theke kichhu ashe na, temporary 2 te fashion stock video fallback dekhabo. Backend ready hole automatically real data prevail korbe.

### Change

- `src/components/home/VideoReel.tsx`:
  - Add a `FALLBACK_VIDEOS: VideoItem[]` const with 2 curated Pexels fashion/editorial mp4 URLs (CDN-hosted, no upload needed):
    1. Runway/fashion editorial clip — title: "Woven by hand", subtitle: "A study in couture craft."
    2. Model/atelier clip — title: "The atelier at work", subtitle: "Every stitch, a signature."
  - Compute `const source = videos.length > 0 ? videos : FALLBACK_VIDEOS;` and drive the section from `source`.
  - Real backend data continues to take priority — the moment `/videos` returns anything active, the fallback is never used.

### Out of scope

- No backend changes
- No changes to other sections
- Fallback removed automatically once admin uploads real videos
