import { motion } from "framer-motion";

const float = (dur = 6, y = 10, r = 0) => ({
  animate: { y: [0, -y, 0], rotate: [0, r, 0] },
  transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const },
});

export function Sparkle({ className, color = "#EC4E9C" }: { className?: string; color?: string }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      {...float(5, 6, 8)}
    >
      <path
        d="M50 2 C 52 34, 66 48, 98 50 C 66 52, 52 66, 50 98 C 48 66, 34 52, 2 50 C 34 48, 48 34, 50 2 Z"
        fill={color}
      />
    </motion.svg>
  );
}

export function HalfCircle({ className, color = "#F5C518" }: { className?: string; color?: string }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className} {...float(7, 4, -3)}>
      <path d="M0 50 A50 50 0 0 1 100 50 Z" fill={color} />
    </motion.svg>
  );
}

export function Dot({ className, color = "#4C7BF3" }: { className?: string; color?: string }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className} {...float(5, 8)}>
      <circle cx="50" cy="50" r="46" fill={color} />
    </motion.svg>
  );
}

export function Donut({ className, color = "#F07A2E" }: { className?: string; color?: string }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className} {...float(6, 6, 6)}>
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="14" />
    </motion.svg>
  );
}

export function HalfMoon({ className, color = "#7C5CD6" }: { className?: string; color?: string }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className} {...float(8, 5, -4)}>
      <path d="M100 0 A50 50 0 0 0 100 100 Z" fill={color} />
    </motion.svg>
  );
}

export function Blob({
  className,
  color = "#F0A5B8",
  children,
}: {
  className?: string;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div className={className} {...float(7, 8, 3)}>
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          backgroundColor: color,
          borderRadius: "58% 42% 55% 45% / 50% 55% 45% 50%",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export function FilmStrip({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 260 60"
      className={className}
      fill="none"
      {...float(9, 4, 2)}
    >
      <path
        d="M4 30 C 40 4, 70 56, 110 30 S 190 4, 230 30 S 300 56, 340 30"
        stroke="#111"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={i}
          cx={12 + i * 18}
          cy={30}
          r={2.5}
          fill="#111"
        />
      ))}
    </motion.svg>
  );
}

export function Arch({
  className,
  color = "#7C5CD6",
  children,
}: {
  className?: string;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: color,
        borderTopLeftRadius: "9999px",
        borderTopRightRadius: "9999px",
      }}
    >
      <div className="relative h-full w-full overflow-hidden" style={{
        borderTopLeftRadius: "9999px",
        borderTopRightRadius: "9999px",
      }}>
        {children}
      </div>
    </div>
  );
}