"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Grid = {
  rows: number;
  cols: number;
};

const DEFAULT_GRIDS: Record<string, Grid> = {
  "6x4": { rows: 4, cols: 6 },
  "8x8": { rows: 8, cols: 8 },
  "8x3": { rows: 3, cols: 8 },
  "4x6": { rows: 6, cols: 4 },
  "3x8": { rows: 8, cols: 3 },
};

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS;

interface PixelImageProps {
  src: string;
  alt?: string;
  grid?: PredefinedGridKey;
  customGrid?: Grid;
  grayscaleAnimation?: boolean;
  pixelFadeInDuration?: number;
  maxAnimationDelay?: number;
  colorRevealDelay?: number;
  className?: string;
}

function getDeterministicDelay(index: number, maxDelay: number) {
  if (maxDelay <= 0) return 0;

  const value = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return Math.floor((value - Math.floor(value)) * maxDelay);
}

export function PixelImage({
  src,
  alt,
  grid = "6x4",
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  customGrid,
  className,
}: PixelImageProps) {
  const [showColor, setShowColor] = useState(false);

  const { rows, cols } = useMemo(() => {
    const isValidGrid = (candidate?: Grid) => {
      if (!candidate) return false;

      return Number.isInteger(candidate.rows)
        && Number.isInteger(candidate.cols)
        && candidate.rows >= 1
        && candidate.cols >= 1
        && candidate.rows <= 16
        && candidate.cols <= 16;
    };

    return isValidGrid(customGrid) ? customGrid! : DEFAULT_GRIDS[grid];
  }, [customGrid, grid]);

  useEffect(() => {
    const colorTimeout = window.setTimeout(() => {
      setShowColor(true);
    }, colorRevealDelay);

    return () => window.clearTimeout(colorTimeout);
  }, [colorRevealDelay]);

  const pieces = useMemo(() => {
    const total = rows * cols;

    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const left = col * (100 / cols);
      const right = (col + 1) * (100 / cols);
      const top = row * (100 / rows);
      const bottom = (row + 1) * (100 / rows);

      return {
        clipPath: `polygon(${left}% ${top}%, ${right}% ${top}%, ${right}% ${bottom}%, ${left}% ${bottom}%)`,
        delay: getDeterministicDelay(index, maxAnimationDelay),
      };
    });
  }, [cols, maxAnimationDelay, rows]);

  return (
    <div
      className={cn("pixel-image", className)}
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
    >
      {pieces.map((piece, index) => (
        <div
          className="pixel-image-piece"
          key={index}
          style={{
            clipPath: piece.clipPath,
            "--pixel-delay": `${piece.delay}ms`,
            "--pixel-duration": `${pixelFadeInDuration}ms`,
          } as CSSProperties}
          aria-hidden="true"
        >
          <img
            src={src}
            alt=""
            className={cn(
              "pixel-image-source",
              grayscaleAnimation && (showColor ? "pixel-image-color" : "pixel-image-grayscale"),
            )}
            style={{
              transition: grayscaleAnimation
                ? `filter ${pixelFadeInDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`
                : "none",
            }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
