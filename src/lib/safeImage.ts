export function isValidImageSrc(src?: string | null): src is string {
  if (!src) return false;

  if (src.startsWith("http://") || src.startsWith("https://")) return true;

  if (src.startsWith("/")) return true;

  return false;
}
