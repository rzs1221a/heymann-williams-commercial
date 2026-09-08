import type { ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** candidate widths; must exist under /photos/w/ (see scripts/images.mjs) */
  widths?: number[];
};

/**
 * One property photo with responsive WebP candidates. The raw JPG stays as
 * `src` so nothing breaks if the resized set hasn't been generated; SVG
 * placeholders pass straight through.
 */
export default function Photo({ src, alt, widths = [480, 960], loading = "lazy", sizes, ...rest }: Props) {
  if (/\.svg$/i.test(src)) return <img src={src} alt={alt} loading={loading} {...rest} />;
  const base = src.replace(/^\/photos\//, "").replace(/\.(jpe?g|png)$/i, "");
  const srcSet = widths.map((w) => `/photos/w/${base}-${w}.webp ${w}w`).join(", ");
  return <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} loading={loading} decoding="async" {...rest} />;
}
