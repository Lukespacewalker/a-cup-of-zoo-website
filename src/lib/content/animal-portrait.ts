import type { ImageFocus } from "@lukespace-cms/client";

export function portraitGeometry(
  sourceWidth: number | null,
  sourceHeight: number | null,
  focus?: ImageFocus | null,
) {
  const { x, y, zoom } = focus ?? { x: 50, y: 50, zoom: 1 };
  const source =
    sourceWidth && sourceHeight
      ? { width: sourceWidth, height: sourceHeight }
      : { width: 1, height: 1 };
  const scale = (100 * zoom) / Math.min(source.width, source.height);
  const width = source.width * scale;
  const height = source.height * scale;
  // Center the focal point, clamped so the original image always fills the square.
  const offset = (size: number, point: number) =>
    Math.max(100 - size, Math.min(0, 50 - (size * point) / 100));
  return { width, height, left: offset(width, x), top: offset(height, y) };
}
