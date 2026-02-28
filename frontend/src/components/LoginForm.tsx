import { useState, type FormEvent } from "react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => boolean | Promise<boolean>;
  errorMessage?: string;
}

export function LoginForm({ onLogin, errorMessage }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorMessage ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ok = await Promise.resolve(onLogin(username.trim(), password.trim()));
      if (!ok) {
        setError("Погрешно корисничко име или лозинка.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 rounded-xl bg-[var(--color-cardboard)] 
        border border-[var(--color-cardboard-dark)] shadow-lg"
    >
      <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4">
        Најава за администратор
      </h2>
      {error ? (
        <p className="text-sm text-red-600 mb-3" role="alert">
          {error}
        </p>
      ) : null}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="login-username"
            className="block text-sm font-medium text-[var(--color-ink-muted)] mb-1"
          >
            Корисничко име
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            className="w-full px-3 py-2 rounded-lg border border-[var(--color-cardboard-dark)] 
              bg-[var(--color-bg)] text-[var(--color-ink)] 
              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-[var(--color-ink-muted)] mb-1"
          >
            Лозинка
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full px-3 py-2 rounded-lg border border-[var(--color-cardboard-dark)] 
              bg-[var(--color-bg)] text-[var(--color-ink)] 
              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-medium bg-[var(--color-accent)] 
            text-white hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? "Се најавува..." : "Најави се"}
        </button>
      </div>
    </form>
  );
}
