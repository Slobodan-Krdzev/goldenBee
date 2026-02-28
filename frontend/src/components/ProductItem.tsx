import type { Product } from "../types/menu.types";

interface ProductItemProps {
  product: Product;
  showPrice: boolean;
}

function formatPriceMkd(price: number): string {
  return `${price} мкд`;
}

export function ProductItem({ product, showPrice }: ProductItemProps) {
  return (
    <div
      className="flex items-start justify-between gap-4 py-3 px-4 rounded-lg
        bg-[var(--color-cardboard)]/80 border border-[var(--color-cardboard-dark)]/60
        transition-shadow hover:shadow-[var(--color-shadow)] font-[var(--font-sans)]"
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[var(--color-ink)] truncate">
          {product.name}
        </p>
        {product.description ? (
          <p className="text-sm text-[var(--color-ink-muted)] mt-0.5 line-clamp-2 italic">
            {product.description}
          </p>
        ) : null}
      </div>
      {showPrice && (
        <span className="shrink-0 font-medium text-[var(--color-ink)] tabular-nums">
          {formatPriceMkd(product.price)}
        </span>
      )}
    </div>
  );
}
