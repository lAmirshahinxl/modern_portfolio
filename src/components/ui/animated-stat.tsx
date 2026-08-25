"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import Counter, { getCounterPlaces } from "@/components/ui/counter";

function splitStatValue(value: string) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);

  return {
    prefix: match?.[1] ?? "",
    numericValue: match?.[2] ?? "0",
    suffix: match?.[3] ?? "",
  };
}

export function AnimatedStat({
  value,
  className = "",
  fontSize = 36,
}: {
  value: string;
  className?: string;
  fontSize?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.65 });
  const reducedMotion = useReducedMotion();
  const { prefix, numericValue, suffix } = splitStatValue(value);
  const target = Number(numericValue);
  const places = getCounterPlaces(target);
  const counterValue = reducedMotion || isInView ? target : 0;

  return (
    <span ref={ref} className={`animated-stat ${className}`}>
      <span className="animated-stat-visual" aria-hidden="true">
        {prefix ? <span className="animated-stat-affix">{prefix}</span> : null}
        <Counter
          value={counterValue}
          places={places}
          fontSize={fontSize}
          padding={2}
          gap={3}
          borderRadius={0}
          horizontalPadding={0}
          textColor="inherit"
          fontWeight="inherit"
          gradientHeight={9}
          gradientFrom="currentColor"
          gradientTo="transparent"
          topGradientStyle={{ display: "none" }}
          bottomGradientStyle={{ display: "none" }}
          instant={Boolean(reducedMotion)}
          direction="down"
        />
        {suffix ? <span className="animated-stat-affix">{suffix}</span> : null}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
