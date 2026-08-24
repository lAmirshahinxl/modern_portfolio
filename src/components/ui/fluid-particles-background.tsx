"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface FluidParticlesBackgroundProps {
  children?: React.ReactNode;
  particleCount?: number;
  noiseIntensity?: number;
  particleSize?: { min: number; max: number };
  particleColor?: string;
  className?: string;
}

function createNoise() {
  const permutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
    234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
    134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
    230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
    1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
    116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
    124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
    47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
    154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
    108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
    242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
    239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
    50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
    141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];

  const p = new Array(512);
  for (let index = 0; index < 256; index += 1) p[256 + index] = p[index] = permutation[index];

  const fade = (value: number) => value * value * value * (value * (value * 6 - 15) + 10);
  const lerp = (amount: number, start: number, end: number) => start + amount * (end - start);
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return {
    simplex3: (inputX: number, inputY: number, inputZ: number) => {
      const X = Math.floor(inputX) & 255;
      const Y = Math.floor(inputY) & 255;
      const Z = Math.floor(inputZ) & 255;
      const x = inputX - Math.floor(inputX);
      const y = inputY - Math.floor(inputY);
      const z = inputZ - Math.floor(inputZ);
      const u = fade(x);
      const v = fade(y);
      const w = fade(z);
      const A = p[X] + Y;
      const AA = p[A] + Z;
      const AB = p[A + 1] + Z;
      const B = p[X + 1] + Y;
      const BA = p[B] + Z;
      const BB = p[B + 1] + Z;

      return lerp(
        w,
        lerp(
          v,
          lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
          lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z)),
        ),
        lerp(
          v,
          lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
          lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1)),
        ),
      );
    },
  };
}

interface Particle {
  x: number;
  y: number;
  size: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

export function FluidParticlesBackground({
  children,
  particleCount = 850,
  noiseIntensity = 0.003,
  particleSize = { min: 0.4, max: 1.8 },
  particleColor = "#8ad9f6",
  className,
}: FluidParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise = useMemo(() => createNoise(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const responsiveCount = width < 640 ? Math.round(particleCount * 0.42) : particleCount;
      particles = Array.from({ length: responsiveCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (particleSize.max - particleSize.min) + particleSize.min,
        velocity: { x: 0, y: 0 },
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 70,
      }));
    };

    const draw = (time: number) => {
      context.fillStyle = "rgba(5, 15, 25, 0.11)";
      context.fillRect(0, 0, width, height);

      for (const particle of particles) {
        particle.life += reducedMotion ? 0 : 1;
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * width;
          particle.y = Math.random() * height;
        }

        const lifeOpacity = Math.sin((particle.life / particle.maxLife) * Math.PI) * 0.26 + 0.1;
        const flow = noise.simplex3(
          particle.x * noiseIntensity,
          particle.y * noiseIntensity,
          time * 0.0001,
        );
        const angle = flow * Math.PI * 4;
        particle.velocity.x = Math.cos(angle) * 1.35;
        particle.velocity.y = Math.sin(angle) * 1.35;

        if (!reducedMotion) {
          particle.x = (particle.x + particle.velocity.x + width) % width;
          particle.y = (particle.y + particle.velocity.y + height) % height;
        }

        context.globalAlpha = lifeOpacity;
        context.fillStyle = particleColor;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;

      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw(0);
    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, [noise, noiseIntensity, particleColor, particleCount, particleSize]);

  return (
    <div className={cn("fluid-particles-background", className)} aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="fluid-particles-content">{children}</div>
    </div>
  );
}
