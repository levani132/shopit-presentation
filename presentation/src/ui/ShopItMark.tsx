interface ShopItMarkProps {
  /** Pixel size of the square mark. */
  size?: number;
  /** Optional className for layout positioning. */
  className?: string;
}

/**
 * ShopIt brand mark — the real 1024×1024 PNG from the shopit repo, served
 * by Vite from /public. Rendered as a fixed-size <img> with object-contain
 * so it never distorts.
 */
export function ShopItMark({ size = 88, className }: ShopItMarkProps) {
  return (
    <img
      src="/icon-1024x1024.png"
      alt="ShopIt"
      width={size}
      height={size}
      className={className}
      style={{
        display: "block",
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
      }}
    />
  );
}
