import { useMenu } from "../context/MenuContext";
import { CategorySection } from "../components/CategorySection";
import { AllergensSection } from "../components/AllergensSection";

export function MenuPage() {
  const {
    categories,
    renderPrice,
    getProductsByCategoryId,
    menuLoading,
    menuError,
    refreshMenu,
  } = useMenu();

  const hasContent = categories.some(
    (cat) => getProductsByCategoryId(cat.id).length > 0
  );

  if (menuLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
        <p className="text-[var(--color-ink-muted)]">Се вчитува менито...</p>
      </main>
    );
  }

  if (menuError) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 mb-3">{menuError}</p>
        <button
          type="button"
          onClick={refreshMenu}
          className="py-2 px-4 rounded-lg bg-[var(--color-accent)] text-white"
        >
          Обиди се повторно
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-2xl md:max-w-5xl mx-auto px-4 py-6 pb-12">
      {!hasContent ? (
        <div className="text-center py-12 text-[var(--color-ink-muted)]">
          <p className="text-lg">Нема ставки во мени!</p>
          <p className="text-sm mt-1">Проверете наскоро!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 transition-opacity duration-200">
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                products={getProductsByCategoryId(category.id)}
                showPrice={renderPrice}
              />
            ))}
          </div>
          <AllergensSection />
        </>
      )}
    </main>
  );
}
