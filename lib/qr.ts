const LOCALE_SEGMENTS = new Set(["ar", "en"]);

export function parseQrId(raw: string) {
  const value = raw.trim();

  if (!value) {
    return null;
  }

  const fromPath = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const last = segments.at(-1);

    if (!last || LOCALE_SEGMENTS.has(last)) {
      return null;
    }

    return decodeURIComponent(last);
  };

  try {
    return fromPath(new URL(value).pathname);
  } catch {
    return fromPath(value.startsWith("/") ? value : `/${value}`);
  }
}
