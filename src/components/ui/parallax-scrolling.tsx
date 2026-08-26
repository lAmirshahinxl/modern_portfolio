import type { ReactNode } from "react";

interface ParallaxComponentProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}

export function ParallaxComponent({ children, className, id, labelledBy }: ParallaxComponentProps) {
  return (
    <section
      className={className ? `parallax ${className}` : "parallax"}
      id={id}
      aria-labelledby={labelledBy}
    >
      <div className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" aria-hidden="true" />
          <div className="parallax__layers">
            <div data-parallax-layer="1" className="parallax__layer-surface parallax__layer-surface-one" aria-hidden="true" />
            <div data-parallax-layer="2" className="parallax__layer-surface parallax__layer-surface-two" aria-hidden="true" />
            <div data-parallax-layer="3" className="parallax__layer-title">
              {children ?? <h2 className="parallax__title">Parallax</h2>}
            </div>
          </div>
          <div className="parallax__fade" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
