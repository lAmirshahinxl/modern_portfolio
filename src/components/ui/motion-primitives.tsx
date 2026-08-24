"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ComponentProps, type PointerEvent, type ReactNode, type RefObject } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function ScrollReveal({
  children,
  className,
  delay = 0,
  amount = 0.16,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.72, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function useSpotlight({ tilt = false, tiltStrength = 7 }: { tilt?: boolean; tiltStrength?: number } = {}) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const element = ref.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    element.style.setProperty("--spotlight-x", `${x}%`);
    element.style.setProperty("--spotlight-y", `${y}%`);

    if (tilt && !reducedMotion) {
      rotateY.set(((x - 50) / 50) * tiltStrength);
      rotateX.set(-((y - 50) / 50) * tiltStrength);
    }
  }

  function handlePointerLeave() {
    ref.current?.style.setProperty("--spotlight-x", "50%");
    ref.current?.style.setProperty("--spotlight-y", "50%");
    rotateX.set(0);
    rotateY.set(0);
  }

  return {
    ref,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    style: tilt && !reducedMotion
      ? { rotateX, rotateY, transformPerspective: 900 }
      : undefined,
  };
}

export function TextReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <span className={`text-reveal ${className}`} aria-label={text}>
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="text-reveal-word"
          aria-hidden="true"
          initial={reducedMotion ? false : { opacity: 0, y: 18, rotateX: -70 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.62, delay: delay + index * 0.055, ease }}
        >
          {word}{index < text.split(" ").length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

export function BorderBeam({ className = "" }: { className?: string }) {
  return <span className={`border-beam ${className}`} aria-hidden="true"><span /></span>;
}

export function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`aurora-background ${className}`} aria-hidden="true">
      <span className="aurora-blob aurora-blob-one" />
      <span className="aurora-blob aurora-blob-two" />
      <span className="aurora-blob aurora-blob-three" />
    </div>
  );
}

export function TracingBeam({ className = "" }: { className?: string }) {
  return <span className={`tracing-beam ${className}`} aria-hidden="true"><i /></span>;
}

export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.75 });
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = Number(match?.[2] ?? 0);
  const suffix = match?.[3] ?? "";
  const [count, setCount] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (reducedMotion || !isInView) return;

    const start = performance.now();
    const duration = 950;
    let frame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [isInView, reducedMotion, target]);

  return <span ref={ref} className={className}>{prefix}{reducedMotion ? target : count}{suffix}</span>;
}

export function MagneticLink({
  children,
  className,
  href,
  ...props
}: ComponentProps<typeof motion.a>) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 340, damping: 24, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 340, damping: 24, mass: 0.35 });

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    if (reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * 0.16);
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * 0.16);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      {...props}
      href={href}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ ...props.style, x: reducedMotion ? 0 : springX, y: reducedMotion ? 0 : springY }}
    >
      {children}
    </motion.a>
  );
}

export function ScrollProgress({ className = "" }: { className?: string }) {
  const { scrollYProgress } = useScroll();

  return <motion.div className={`scroll-progress ${className}`} style={{ scaleX: scrollYProgress }} aria-hidden="true" />;
}

export function ContainerScrollProgress({
  containerRef,
  className = "",
}: {
  containerRef: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const { scrollYProgress } = useScroll({ container: containerRef });

  return <motion.div className={`scroll-progress ${className}`} style={{ scaleX: scrollYProgress }} aria-hidden="true" />;
}

export function PointerGlow({ className = "" }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(-120);
  const y = useMotionValue(-120);
  const springX = useSpring(x, { stiffness: 160, damping: 28, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 160, damping: 28, mass: 0.45 });

  useEffect(() => {
    if (reducedMotion) return;

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reducedMotion, x, y]);

  return (
    <motion.div
      className={`pointer-glow ${className}`}
      style={{ left: reducedMotion ? -120 : springX, top: reducedMotion ? -120 : springY }}
      aria-hidden="true"
    />
  );
}

export function MotionLine({ className = "" }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const scaleX = useMotionValue(0);
  const springScale = useSpring(scaleX, { stiffness: 180, damping: 26 });

  useEffect(() => {
    scaleX.set(1);
  }, [scaleX]);

  return (
    <motion.span
      className={`motion-line ${className}`}
      style={{ scaleX: reducedMotion ? 1 : springScale }}
      aria-hidden="true"
    />
  );
}

export type AnimatedStyle = {
  x: MotionValue<number>;
  y: MotionValue<number>;
};
