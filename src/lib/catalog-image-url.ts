/** Cover + gallery: HTTPS remote or same-origin path (e.g. /mockups/...). */
export function isAllowedCatalogImageUrl(raw: unknown): raw is string {
  if (typeof raw !== "string") return false;
  const u = raw.trim();
  return u.startsWith("https://") || (u.startsWith("/") && !u.startsWith("//"));
}
