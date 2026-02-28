import { routes, deploymentEnv, type VercelConfig } from "@vercel/config/v1";

const backendBase =
  (deploymentEnv("BACKEND_URL") || process.env.BACKEND_URL || "").replace(
    /\/$/,
    ""
  ) || "http://75.119.159.245:3001";

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite("/api/(.*)", `${backendBase}/api/$1`),
  ],
};
