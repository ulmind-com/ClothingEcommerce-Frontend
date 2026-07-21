import * as React from "react";
import { motion, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiagonalCarouselItem {
  src: string;
  title: string;
  alt?: string;
}

export interface DiagonalCarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: DiagonalCarouselItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  loop?: boolean;
  slideSize?: number;
  rotationStep?: number;
  verticalStep?: number;
  inactiveScale?: number;
  transition?: Transition;
  showControls?: boolean;
  showDots?: boolean;
  viewportClassName?: string;
  slideClassName?: string;
  imageClassName?: string;
  labelClassName?: string;
  controlsClassName?: string;
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.16,
  duration: 0.85,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function DiagonalCarousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  loop = false,
  slideSize = 260,
  rotationStep = 30,
  verticalStep = 120,
  inactiveScale = 0.6,
  transition = DEFAULT_TRANSITION,
  showControls = true,
  showDots = true,
  viewportClassName,
  slideClassName,
  imageClassName,
  labelClassName,
  controlsClassName,
  className,
  onKeyDown,
  tabIndex,
  ...props
}: DiagonalCarouselProps) {
  const maxIndex = Math.max(0, items.length - 1);
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() =>
    clamp(defaultActiveIndex, 0, maxIndex),
  );
  const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);
  const safeSlideSize = Math.max(120, slideSize);
  const safeInactiveScale = clamp(inactiveScale, 0.35, 1);

  const selectSlide = React.useCallback(
    (nextIndex: number) => {
      if (!items.length) return;
      const resolvedIndex = loop
        ? (nextIndex + items.length) % items.length
        : clamp(nextIndex, 0, maxIndex);
      if (activeIndex === undefined) setUncontrolledIndex(resolvedIndex);
      onActiveIndexChange?.(resolvedIndex);
    },
    [activeIndex, items.length, loop, maxIndex, onActiveIndexChange],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectSlide(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectSlide(currentIndex + 1);
    }
  };

  if (!items.length) return null;

  const isPreviousDisabled = !loop && currentIndex === 0;
  const isNextDisabled = !loop && currentIndex === maxIndex;

  return (
    <div
      {...props}
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center outline-none",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex w-full flex-1 items-center justify-center overflow-hidden",
          viewportClassName,
        )}
      >
        <div className="relative flex items-center justify-center" style={{ perspective: 1400 }}>
          {items.map((item, index) => {
            const isActive = currentIndex === index;
            const distance = index - currentIndex;
            const absDist = Math.abs(distance);
            const scale = isActive
              ? 1
              : Math.max(safeInactiveScale, 1 - absDist * (1 - safeInactiveScale) * 0.6);
            const translateX = distance * (safeSlideSize * 0.55);
            const translateY = distance * verticalStep;
            const rotate = distance * rotationStep;
            const zIndex = 100 - absDist;
            const opacity = absDist > 4 ? 0 : 1 - absDist * 0.12;

            return (
              <motion.div
                key={`${item.src}-${index}`}
                className={cn("absolute", slideClassName)}
                style={{ width: safeSlideSize, height: safeSlideSize * 1.35, zIndex }}
                animate={{
                  x: translateX,
                  y: translateY,
                  rotate,
                  scale,
                  opacity,
                }}
                transition={transition}
              >
                <button
                  type="button"
                  onClick={() => selectSlide(index)}
                  aria-label={item.title}
                  aria-current={isActive}
                  className={cn(
                    "group relative block h-full w-full overflow-hidden rounded-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] ring-1 ring-ink/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne",
                  )}
                >
                  <img
                    src={item.src}
                    alt={item.alt ?? item.title}
                    loading="lazy"
                    draggable={false}
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]",
                      imageClassName,
                    )}
                  />
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent px-4 py-4 opacity-0 transition-opacity duration-500",
                      isActive && "opacity-100",
                    )}
                  >
                    <p
                      className={cn(
                        "font-display text-lg leading-tight text-cream tracking-tight",
                        labelClassName,
                      )}
                    >
                      {item.title}
                    </p>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {showControls && (
        <div
          className={cn(
            "mt-8 flex items-center justify-center gap-6",
            controlsClassName,
          )}
        >
          <button
            type="button"
            aria-label="Previous slide"
            disabled={isPreviousDisabled}
            onClick={() => selectSlide(currentIndex - 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {showDots && (
            <div className="flex items-center gap-2">
              {items.map((item, index) => (
                <button
                  key={`dot-${item.src}-${index}`}
                  type="button"
                  aria-label={`Go to ${item.title}`}
                  aria-current={currentIndex === index}
                  onClick={() => selectSlide(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    currentIndex === index
                      ? "w-8 bg-ink"
                      : "w-1.5 bg-ink/25 hover:bg-ink/50",
                  )}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            aria-label="Next slide"
            disabled={isNextDisabled}
            onClick={() => selectSlide(currentIndex + 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default DiagonalCarousel;