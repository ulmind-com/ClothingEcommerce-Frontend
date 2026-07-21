import { motion } from "framer-motion";

const float = (dur: number, delay = 0) => ({
  animate: { y: [0, -14, 0], rotate: [0, 6, 0] },
  transition: { duration: dur, repeat: Infinity, ease: "easeInOut", delay },
});

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 80 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      {...float(6)}
      aria-hidden
    >
      <path d="M2 10 Q 12 -2 22 10 T 42 10 T 62 10 T 78 10" />
    </motion.svg>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      {...float(5, 0.6)}
      aria-hidden
    >
      <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M19 5 L5 19" />
    </motion.svg>
  );
}

export function Arc({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 60 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      {...float(7, 1)}
      aria-hidden
    >
      <path d="M6 54 A 30 30 0 0 1 54 6" />
    </motion.svg>
  );
}

export function Dot({ className = "" }: { className?: string }) {
  return (
    <motion.span
      className={`inline-block rounded-full ${className}`}
      animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    />
  );
}

export function Ring({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      {...float(9, 0.3)}
      aria-hidden
    >
      <circle cx="20" cy="20" r="18" />
    </motion.svg>
  );
}