import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { videosOptions } from "@/lib/api/queries";
import type { VideoItem } from "@/types/api";
import { MaskReveal } from "@/lib/motion/Reveal";
import reel1 from "@/assets/reel-1.mp4.asset.json";
import reel2 from "@/assets/reel-2.mp4.asset.json";
import reel3 from "@/assets/reel-3.mp4.asset.json";
import reel4 from "@/assets/reel-4.mp4.asset.json";
import reel5 from "@/assets/reel-5.mp4.asset.json";
import reel6 from "@/assets/reel-6.mp4.asset.json";

const FALLBACK: VideoItem[] = [reel1, reel2, reel3, reel4, reel5, reel6].map((a, i) => ({
  id: `fallback-${i + 1}`,
  video_url: a.url,
  order: i,
  active: true,
}));

function ReelCard({ item }: { item: VideoItem }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const play = () => v.play().catch(() => {});
    if (v.readyState >= 2) play();
    else v.addEventListener("loadeddata", play, { once: true });
  }, []);
  return (
    <Link
      to="/shop"
      className="group relative block shrink-0 w-[180px] md:w-[220px] aspect-[9/16] overflow-hidden bg-ink border border-border/40 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] transition-all duration-700 hover:shadow-[0_30px_80px_-20px_rgba(180,140,80,0.35)] hover:border-champagne/60"
    >
      <video
        ref={ref}
        src={item.video_url}
        poster={item.poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </Link>
  );
}

export function VideoReel() {
  const { data: videos = [] } = useQuery(videosOptions());
  const source = videos.length > 0 ? videos : FALLBACK;
  const [paused, setPaused] = useState(false);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const loop = [...source, ...source];
  const duration = Math.max(30, source.length * 7);

  return (
    <section className="py-24 md:py-32 bg-secondary/40 overflow-hidden">
      <div className="mx-auto max-w-[900px] px-6 text-center mb-14 md:mb-20">
        <div className="eyebrow mb-4">In Motion</div>
        <MaskReveal>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
            The Maison, in frames
          </h2>
        </MaskReveal>
        <p className="mt-6 font-display italic text-warm-gray text-lg md:text-xl leading-relaxed">
          Fleeting moments from the atelier —
          <br className="hidden md:block" /> woven, worn, remembered.
        </p>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-secondary/40 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-secondary/40 to-transparent z-10" />
        <div
          className="flex gap-4 md:gap-6 w-max reel-marquee"
          style={{
            animationDuration: `${duration}s`,
            animationPlayState: paused || reduce ? "paused" : "running",
          }}
        >
          {loop.map((item, i) => (
            <ReelCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
