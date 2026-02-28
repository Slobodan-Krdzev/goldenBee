/** API base URL. In dev, uses same host as the page (so phone/tablet can use your machine's IP). */
function getBase(): string {
  const env = import.meta.env.VITE_API_URL;
  if (env) return env.replace(/\/$/, "");
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:3001`;
  }
  return "";
}

/** True when we have an API base URL (env or same host:3001 in browser). Used so renderPrice etc. are global from the server. */
export function isApiConfigured(): boolean {
  return getBase().length > 0;
}

function getToken(): string | null {
  return localStorage.getItem("goldenbee_token");
}

export interface MenuPayload {
  categories: { id: string; name: string }[];
  products: { id: string; name: string; description: string; price: number; categoryId: string }[];
  renderPrice: boolean;
}

export async function fetchMenu(): Promise<MenuPayload> {
  const res = await fetch(`${getBase()}/api/menu`);
  if (!res.ok) throw new Error("Неуспешно вчитување на менито");
  return res.json();
}

export async function login(username: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${getBase()}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Најавата не успеа");
  return data;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Сесијата истече");
    this.name = "UnauthorizedError";
  }
}

export async function saveMenu(payload: MenuPayload): Promise<MenuPayload> {
  const token = getToken();
  if (!token) throw new Error("Не сте најавени");
  const res = await fetch(`${getBase()}/api/menu`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (res.status === 401) {
    setStoredToken(null);
    throw new UnauthorizedError();
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Зачувувањето не успеа");
  return data;
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem("goldenbee_token", token);
  else localStorage.removeItem("goldenbee_token");
}

export function hasStoredToken(): boolean {
  return !!getToken();
}
