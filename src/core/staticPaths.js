export function resolveStaticRequest(rawPath) {
  if (rawPath === "/") return "index.html";

  const relativePath = rawPath.replace(/^\/+/, "");
  return rawPath.startsWith("/assets/")
    ? `public/${relativePath}`
    : relativePath;
}
