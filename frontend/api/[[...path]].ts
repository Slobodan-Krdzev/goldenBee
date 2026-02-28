import type { VercelRequest, VercelResponse } from "@vercel/node";

const BACKEND = (process.env.BACKEND_URL || "http://75.119.159.245:3001").replace(/\/$/, "");

export default async function proxy(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const raw = req.query.path;
  const pathSegments = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const path = pathSegments.join("/");
  const queryParams = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) {
    if (k !== "path" && v != null) {
      queryParams.set(k, Array.isArray(v) ? v[0] : String(v));
    }
  }
  const qs = queryParams.toString();
  const url = `${BACKEND}/api/${path}${qs ? `?${qs}` : ""}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (req.headers.authorization) {
    headers["Authorization"] = req.headers.authorization as string;
  }

  const init: RequestInit = {
    method: req.method || "GET",
    headers,
  };
  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    init.body =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  try {
    const response = await fetch(url, init);
    const data = await response.json().catch(() => ({}));
    res.status(response.status).json(data);
  } catch (err) {
    console.error("[goldenbee proxy] fetch failed:", url, err);
    res.status(502).json({ error: "Backend unreachable" });
  }
}
