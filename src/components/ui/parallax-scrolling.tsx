"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

interface ParallaxComponentProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}

export function ParallaxComponent({ children, className, id, labelledBy }: ParallaxComponentProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = parallaxRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const triggerElement = root.querySelector<HTMLElement>("[data-parallax-layers]");
    let timeline: gsap.core.Timeline | undefined;

    if (triggerElement && !prefersReducedMotion) {
      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: true,
        },
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
      ];

      layers.forEach((layerObj, index) => {
        timeline?.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none",
          },
          index === 0 ? undefined : "<",
        );
      });
    }

    const lenis = prefersReducedMotion ? null : new Lenis({ lerp: 0.09 });
    const handleScroll = () => ScrollTrigger.update();
    const ticker = (time: number) => lenis?.raf(time * 1000);

    if (lenis) {
      lenis.on("scroll", handleScroll);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }

    const handleRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleRefresh);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", handleRefresh);
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      if (triggerElement) gsap.killTweensOf(triggerElement);
      lenis?.off("scroll", handleScroll);
      gsap.ticker.remove(ticker);
      lenis?.destroy();
    };
  }, []);

  return (
    <div
      className={className ? `parallax ${className}` : "parallax"}
      ref={parallaxRef}
      id={id}
      aria-labelledby={labelledBy}
    >
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" />
          <div data-parallax-layers className="parallax__layers">
            <img
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp"
              loading="eager"
              width="800"
              data-parallax-layer="1"
              alt=""
              className="parallax__layer-img"
            />
            <img
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp"
              loading="eager"
              width="800"
              data-parallax-layer="2"
              alt=""
              className="parallax__layer-img"
            />
            <div data-parallax-layer="3" className="parallax__layer-title">
              {children ?? <h2 className="parallax__title">Parallax</h2>}
            </div>
          </div>
          <div className="parallax__fade" />
        </div>
      </section>
    </div>
  );
}
