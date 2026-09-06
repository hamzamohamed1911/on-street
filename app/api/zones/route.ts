import { type NextRequest } from "next/server";

const QUERY_KEYS = ["search", "page", "page_size"] as const;

export async function GET(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!apiUrl) {
    return Response.json(
      { detail: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  const upstream = new URL("zones/", `${apiUrl}/`);

  for (const key of QUERY_KEYS) {
    const value = request.nextUrl.searchParams.get(key);

    if (value) {
      upstream.searchParams.set(key, value);
    }
  }

  const response = await fetch(upstream, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({
    detail: "Unable to load zones.",
  }));

  return Response.json(data, { status: response.status });
}
