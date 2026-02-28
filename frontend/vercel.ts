import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite("/api/(.*)", "/api/proxy?path=$1"),
    routes.rewrite("/((?!api/|assets/|logo\\.png|logo\\.svg|favicon\\.ico|favicon\\.svg|vite\\.svg).*)", "/index.html"),
  ],
};
