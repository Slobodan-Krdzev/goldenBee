import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const isAdmin = location.pathname === "/edit";

  return (
    <header className="sticky top-0 z-10 bg-[var(--color-cardboard)] border-b border-[var(--color-cardboard-dark)] shadow-sm">
      <div className="max-w-2xl md:max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center hover:opacity-90">
          <img src="/logo.png" alt="Golden Bee Fresh Bar" className="h-10 w-auto" />
        </Link>
        {isAdmin ? (
          <Link
            to="/"
            className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            Погледни мени
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/goldenbeefreshbar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] no-underline"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="tel:078653765"
              className="flex items-center gap-1.5 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] no-underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 shrink-0"
                aria-hidden
              >
                <path d="M6.62 10.79a15.05 15.05 0 0 1 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.48.57 1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1A17 17 0 0 1 2 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.48 1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
              </svg>
              <span>078 653 765</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
