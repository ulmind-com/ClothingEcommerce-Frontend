import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { videosOptions } from "@/lib/api/queries";
import { MaskReveal } from "@/lib/motion/Reveal";
import type { VideoItem } from "@/types/api";

export function VideoReel() {
  const { data = [] } = useQuery(videosOptions());
  const videos: VideoItem[] = data
    .filter((v) => v.active && v.video_url)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused || !inView) v.pause();
    else v.play().catch(() => {});
  }, [paused, inView, index]);

  if (videos.length === 0) return null;

  const current = videos[index];
  const advance = (dir: number) => {
    setProgress(0);
    setIndex((i) => (i + dir + videos.length) % videos.length);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink text-cream py-20 md:py-28 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[900px] px-6 text-center mb-12 md:mb-16">
        <div className="eyebrow !text-cream/60 mb-4">Film</div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
          The House in motion
        </h2>
        <p className="mt-5 font-display italic text-cream/70 text-lg md:text-xl leading-relaxed">
          Moving portraits from the atelier — a season captured in light and thread.
        </p>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="relative w-full overflow-hidden bg-black aspect-[4/5] md:aspect-[16/9] group">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={`v-${current.id}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] } }}
              className="absolute inset-0"
            >
              <video
                ref={videoRef}
                src={current.video_url}
                poster={current.poster}
                autoPlay
                muted={muted}
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
                onEnded={() => advance(1)}
                onTimeUpdate={(e) => {
                  const t = e.currentTarget;
                  if (t.duration > 0) setProgress(t.currentTime / t.duration);
                }}
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

          {(current.title || current.subtitle) && (
            <div className="absolute left-6 md:left-10 bottom-10 md:bottom-14 max-w-lg z-10">
              {current.title && (
                <MaskReveal key={`t-${current.id}`}>
                  <h3 className="font-display text-2xl md:text-4xl leading-tight">
                    {current.title}
                  </h3>
                </MaskReveal>
              )}
              {current.subtitle && (
                <p className="mt-3 text-cream/75 text-sm md:text-base max-w-md">
                  {current.subtitle}
                </p>
              )}
            </div>
          )}

          {videos.length > 1 && (
            <>
              <button
                aria-label="Previous video"
                onClick={() => advance(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:grid place-items-center h-12 w-12 rounded-full border border-cream/30 text-cream/70 opacity-0 hover:opacity-100 hover:text-cream hover:border-cream/70 transition-all duration-500 group-hover:opacity-60"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                aria-label="Next video"
                onClick={() => advance(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:grid place-items-center h-12 w-12 rounded-full border border-cream/30 text-cream/70 opacity-0 hover:opacity-100 hover:text-cream hover:border-cream/70 transition-all duration-500 group-hover:opacity-60"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <button
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => setMuted((m) => !m)}
            className="absolute right-4 bottom-4 z-10 grid place-items-center h-10 w-10 rounded-full border border-cream/30 bg-ink/40 backdrop-blur-sm text-cream/80 hover:text-cream hover:border-cream/70 transition-all"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-cream/15 z-10">
            <div
              className="h-full bg-champagne transition-[width] duration-150 ease-linear"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
        </div>

        {videos.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {videos.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to video ${i + 1}`}
                onClick={() => {
                  setProgress(0);
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-cream" : "w-1.5 bg-cream/40 hover:bg-cream/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}