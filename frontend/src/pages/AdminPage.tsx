import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../context/MenuContext";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { LoginForm } from "../components/LoginForm";
import type { Category, Product } from "../types/menu.types";

export function AdminPage() {
  const navigate = useNavigate();
  const {
    adminAuth,
    login,
    logout,
    categories,
    products,
    renderPrice,
    setRenderPrice,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategoryId,
    resetToDefaultMenu,
    importFromJson,
    menuLoading,
    menuError,
    refreshMenu,
  } = useMenu();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "category" | "product";
    id: string;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const effectiveCategoryId = productForm.categoryId || categories[0]?.id || "";

  if (!adminAuth) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <LoginForm onLogin={login} />
      </main>
    );
  }

  if (menuLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
        <p className="text-[var(--color-ink-muted)]">Се вчитува...</p>
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

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    addCategory(name);
    setNewCategoryName("");
  }

  function startEditCategory(c: Category) {
    setEditingCategoryId(c.id);
    setEditingCategoryName(c.name);
  }

  function saveEditCategory() {
    if (editingCategoryId && editingCategoryName.trim()) {
      updateCategory(editingCategoryId, editingCategoryName.trim());
      setEditingCategoryId(null);
      setEditingCategoryName("");
    }
  }

  function handleDeleteCategory(id: string, name: string) {
    setDeleteConfirm({ type: "category", id, name });
  }

  function handleDeleteProduct(id: string, name: string) {
    setDeleteConfirm({ type: "product", id, name });
  }

  function confirmDelete() {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "category") {
      deleteCategory(deleteConfirm.id);
    } else {
      deleteProduct(deleteConfirm.id);
    }
    setDeleteConfirm(null);
  }

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!productForm.name.trim() || !effectiveCategoryId) return;
    addProduct({
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      price: Number(productForm.price) || 0,
      categoryId: effectiveCategoryId,
    });
    setProductForm({ name: "", description: "", price: 0, categoryId: categories[0]?.id ?? "" });
    setShowAddProduct(false);
  }

  function startEditProduct(p: Product) {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      description: p.description,
      price: p.price,
      categoryId: p.categoryId,
    });
  }

  function saveEditProduct() {
    if (!editingProductId) return;
    updateProduct(editingProductId, {
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      price: Number(productForm.price) || 0,
      categoryId: effectiveCategoryId,
    });
    setEditingProductId(null);
    setProductForm({ name: "", description: "", price: 0, categoryId: categories[0]?.id ?? "" });
  }

  function cancelEdit() {
    setEditingCategoryId(null);
    setEditingProductId(null);
    setShowAddProduct(false);
    setProductForm({ name: "", description: "", price: 0, categoryId: categories[0]?.id ?? "" });
  }

  function exportToJson() {
    const data = { categories, products, renderPrice };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `goldenbee-menu-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        importFromJson(data).catch((err) => {
          console.error(err);
          alert("Грешка при увоз. Проверете дали JSON датотеката е валидна.");
        });
      } catch {
        alert("Невалидна JSON датотека.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[var(--color-ink)]">Администратор</h1>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="text-sm py-1.5 px-3 rounded-lg border border-[var(--color-cardboard-dark)] 
            bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:bg-[var(--color-cardboard-dark)]/30"
        >
          Одјави се
        </button>
      </div>

      {/* Global settings */}
      <section className="mb-8 p-4 rounded-xl bg-[var(--color-cardboard)] border border-[var(--color-cardboard-dark)]">
        <h2 className="text-sm font-semibold text-[var(--color-ink-muted)] mb-3 uppercase tracking-wide">
          Глобални поставки
        </h2>
        <ToggleSwitch
          checked={renderPrice}
          onToggle={setRenderPrice}
          label="Прикажи цени"
        />
        <div className="mt-3 pt-3 border-t border-[var(--color-cardboard-dark)] flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetToDefaultMenu}
            className="text-sm py-1.5 px-3 rounded-lg border border-[var(--color-cardboard-dark)] 
              bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:bg-[var(--color-cardboard-dark)]/30"
          >
            Врати го менито од сликата
          </button>
          <button
            type="button"
            onClick={exportToJson}
            className="text-sm py-1.5 px-3 rounded-lg border border-[var(--color-cardboard-dark)] 
              bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:bg-[var(--color-cardboard-dark)]/30"
          >
            Извези во JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm py-1.5 px-3 rounded-lg border border-[var(--color-cardboard-dark)] 
              bg-[var(--color-bg)] text-[var(--color-ink-muted)] hover:bg-[var(--color-cardboard-dark)]/30"
          >
            Увези од JSON
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-[var(--color-ink)] mb-3">Категории</h2>
        <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Име на категорија"
            className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-cardboard-dark)] 
              bg-[var(--color-bg)] text-[var(--color-ink)]"
          />
          <button
            type="submit"
            className="py-2 px-4 rounded-lg font-medium bg-[var(--color-accent)] text-white"
          >
            Додај
          </button>
        </form>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-cardboard)]/60 border border-[var(--color-cardboard-dark)]/50"
            >
              {editingCategoryId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    className="flex-1 px-2 py-1 rounded border border-[var(--color-cardboard-dark)] bg-[var(--color-bg)]"
                    autoFocus
                  />
                  <button type="button" onClick={saveEditCategory} className="text-sm py-1 px-2 rounded bg-[var(--color-accent)] text-white">
                    Зачувај
                  </button>
                  <button type="button" onClick={cancelEdit} className="text-sm py-1 px-2 rounded border">
                    Откажи
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium">{cat.name}</span>
                  <button
                    type="button"
                    onClick={() => startEditCategory(cat)}
                    className="text-sm py-1 px-2 rounded border border-[var(--color-cardboard-dark)] hover:bg-[var(--color-cardboard-dark)]/30"
                  >
                    Измени
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="text-sm py-1 px-2 rounded border border-red-200 text-red-700 hover:bg-red-50"
                  >
                    Избриши
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        {categories.length === 0 && (
          <p className="text-sm text-[var(--color-ink-muted)]">Нема категории. Додајте однагоре.</p>
        )}
      </section>

      {/* Products */}
      <section>
        <h2 className="text-lg font-bold text-[var(--color-ink)] mb-3">Продукти</h2>
        {!showAddProduct && !editingProductId && (
          <button
            type="button"
            onClick={() => setShowAddProduct(true)}
            className="mb-4 py-2 px-4 rounded-lg font-medium bg-[var(--color-accent)] text-white"
          >
            Додај производ
          </button>
        )}
        {(showAddProduct || editingProductId) && (
          <form
            onSubmit={editingProductId ? (e) => { e.preventDefault(); saveEditProduct(); } : handleAddProduct}
            className="mb-6 p-4 rounded-xl bg-[var(--color-cardboard)] border border-[var(--color-cardboard-dark)] space-y-3"
          >
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Име на производ"
              required
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-cardboard-dark)] bg-[var(--color-bg)]"
            />
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Опис"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-cardboard-dark)] bg-[var(--color-bg)] resize-none"
            />
            <input
              type="number"
              step="1"
              min="0"
              value={productForm.price || ""}
              onChange={(e) => setProductForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
              placeholder="Цена (мкд)"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-cardboard-dark)] bg-[var(--color-bg)]"
            />
            <select
              value={effectiveCategoryId}
              onChange={(e) => setProductForm((p) => ({ ...p, categoryId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-cardboard-dark)] bg-[var(--color-bg)]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="py-2 px-4 rounded-lg font-medium bg-[var(--color-accent)] text-white">
                {editingProductId ? "Зачувај" : "Додај"}
              </button>
              <button type="button" onClick={cancelEdit} className="py-2 px-4 rounded-lg border">
                Откажи
              </button>
            </div>
          </form>
        )}
        <ul className="space-y-2">
          {categories.flatMap((cat) =>
            getProductsByCategoryId(cat.id).map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-cardboard)]/60 border border-[var(--color-cardboard-dark)]/50"
              >
                <span className="flex-1">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-[var(--color-ink-muted)] ml-2">({cat.name})</span>
                </span>
                <button
                  type="button"
                  onClick={() => startEditProduct(p)}
                  className="text-sm py-1 px-2 rounded border border-[var(--color-cardboard-dark)]"
                >
                  Измени
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(p.id, p.name)}
                  className="text-sm py-1 px-2 rounded border border-red-200 text-red-700"
                >
                  Избриши
                </button>
              </li>
            ))
          )}
        </ul>
        {products.length === 0 && (
          <p className="text-sm text-[var(--color-ink-muted)]">Нема продукти.</p>
        )}
      </section>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-[var(--color-bg)] rounded-xl p-6 max-w-sm w-full shadow-xl border border-[var(--color-cardboard-dark)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[var(--color-ink)] mb-4">
              Избриши &quot;{deleteConfirm.name}&quot;? Ова не може да се врати.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="py-2 px-4 rounded-lg border"
              >
                Откажи
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="py-2 px-4 rounded-lg bg-red-600 text-white"
              >
                Избриши
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
