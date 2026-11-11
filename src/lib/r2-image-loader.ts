export const R2_PUBLIC_URL =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev";

export default function r2ImageLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  if (src.startsWith("/images/") || src.startsWith("/videos/")) {
    return `${R2_PUBLIC_URL}${src}`;
  }
  return src;
}
