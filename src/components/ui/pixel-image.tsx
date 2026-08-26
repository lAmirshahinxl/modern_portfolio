import Image from "next/image";
import { cn } from "@/lib/utils";

interface PixelImageProps {
  src: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}

export function PixelImage({
  src,
  alt,
  priority = false,
  className,
}: PixelImageProps) {
  return (
    <div className={cn("pixel-image", className)}>
      <Image
        src={src}
        alt={alt ?? ""}
        fill
        priority={priority}
        sizes="(max-width: 820px) 100vw, 560px"
        className="pixel-image-source"
        draggable={false}
      />
    </div>
  );
}
