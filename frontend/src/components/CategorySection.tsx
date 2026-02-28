import type { Category } from "../types/menu.types";
import type { Product } from "../types/menu.types";
import { ProductItem } from "./ProductItem";

interface CategorySectionProps {
  category: Category;
  products: Product[];
  showPrice: boolean;
}

export function CategorySection({
  category,
  products,
  showPrice,
}: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mb-8">
      <h2
        className="text-2xl font-normal text-[var(--color-ink)] mb-3 px-1 border-b-2 border-[var(--color-accent)] pb-2 text-center"
        style={{ fontFamily: "var(--font-script)" }}
      >
        {category.name}
      </h2>
      <ul className="space-y-2 list-none p-0 m-0">
        {products.map((product) => (
          <li key={product.id}>
            <ProductItem product={product} showPrice={showPrice} />
          </li>
        ))}
      </ul>
    </section>
  );
}
