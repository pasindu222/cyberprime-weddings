import Image from "next/image";
import type { CSSProperties } from "react";

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
};

/** Fills its (position: relative) parent. SVGs skip the image optimiser. */
export default function Photo({
  src,
  alt,
  className,
  sizes = "100vw",
  priority,
  style,
}: PhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={style}
      unoptimized={src.endsWith(".svg")}
    />
  );
}
