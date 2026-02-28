import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Category, Product } from "../types/menu.types";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "../data/seedMenu";
import * as api from "../api/client";

const STORAGE_KEYS = {
  CATEGORIES: "goldenbee_categories",
  PRODUCTS: "goldenbee_products",
  RENDER_PRICE: "goldenbee_renderPrice",
  ADMIN_AUTH: "goldenbee_adminAuth",
} as const;

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const useApi = api.isApiConfigured();

interface MenuContextValue {
  categories: Category[];
  products: Product[];
  renderPrice: boolean;
  adminAuth: boolean;
  menuLoading: boolean;
  menuError: string | null;
  setCategories: (categories: Category[] | ((prev: Category[]) => Category[])) => void;
  setProducts: (products: Product[] | ((prev: Product[]) => Product[])) => void;
  setRenderPrice: (value: boolean | ((prev: boolean) => boolean)) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addCategory: (name: string) => Category;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, updates: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: string) => void;
  getProductsByCategoryId: (categoryId: string) => Product[];
  resetToDefaultMenu: () => void;
  refreshMenu: () => Promise<void>;
  importFromJson: (data: { categories: Category[]; products: Product[]; renderPrice: boolean }) => Promise<void>;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [products, setProductsState] = useState<Product[]>([]);
  const [renderPrice, setRenderPriceState] = useState<boolean>(true);
  const [adminAuth, setAdminAuth] = useState<boolean>(() =>
    useApi ? api.hasStoredToken() : loadJson<boolean>(STORAGE_KEYS.ADMIN_AUTH, false)
  );
  const [menuLoading, setMenuLoading] = useState<boolean>(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  const refreshMenu = useCallback(async () => {
    if (!useApi) return;
    setMenuError(null);
    setMenuLoading(true);
    try {
      const data = await api.fetchMenu();
      setCategoriesState(data.categories ?? []);
      setProductsState(data.products ?? []);
      setRenderPriceState(data.renderPrice !== false);
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : "Грешка при вчитување");
      setCategoriesState([]);
      setProductsState([]);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  useEffect(() => {
    if (useApi) {
      refreshMenu();
    } else {
      const storedCat = loadJson<Category[]>(STORAGE_KEYS.CATEGORIES, []);
      const storedProd = loadJson<Product[]>(STORAGE_KEYS.PRODUCTS, []);
      setCategoriesState(storedCat.length > 0 ? storedCat : SEED_CATEGORIES);
      setProductsState(storedProd.length > 0 ? storedProd : SEED_PRODUCTS);
      setRenderPriceState(loadJson<boolean>(STORAGE_KEYS.RENDER_PRICE, true));
      setMenuLoading(false);
    }
  }, [refreshMenu]);

  useEffect(() => {
    if (!useApi) {
      saveJson(STORAGE_KEYS.CATEGORIES, categories);
      saveJson(STORAGE_KEYS.PRODUCTS, products);
      saveJson(STORAGE_KEYS.RENDER_PRICE, renderPrice);
      saveJson(STORAGE_KEYS.ADMIN_AUTH, adminAuth);
    }
  }, [useApi, categories, products, renderPrice, adminAuth]);

  const persistToApi = useCallback(
    async (nextCategories: Category[], nextProducts: Product[], nextRenderPrice: boolean) => {
      if (!useApi) return;
      try {
        await api.saveMenu({
          categories: nextCategories,
          products: nextProducts,
          renderPrice: nextRenderPrice,
        });
      } catch (err) {
        if (err instanceof api.UnauthorizedError) {
          api.setStoredToken(null);
          setAdminAuth(false);
        }
        console.error("Failed to save menu:", err);
        throw err;
      }
    },
    []
  );

  const setCategories = useCallback(
    (value: Category[] | ((prev: Category[]) => Category[])) => {
      setCategoriesState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        if (useApi && adminAuth) {
          persistToApi(next, products, renderPrice).catch(() => {});
        }
        return next;
      });
    },
    [adminAuth, products, renderPrice, persistToApi]
  );

  const setProducts = useCallback(
    (value: Product[] | ((prev: Product[]) => Product[])) => {
      setProductsState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        if (useApi && adminAuth) {
          persistToApi(categories, next, renderPrice).catch(() => {});
        }
        return next;
      });
    },
    [adminAuth, categories, renderPrice, persistToApi]
  );

  const setRenderPrice = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setRenderPriceState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        if (useApi && adminAuth) {
          persistToApi(categories, products, next).catch(() => {});
        }
        return next;
      });
    },
    [adminAuth, categories, products, persistToApi]
  );

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      if (useApi) {
        try {
          const { token } = await api.login(username, password);
          api.setStoredToken(token);
          setAdminAuth(true);
          return true;
        } catch {
          return false;
        }
      }
      const ok = username === "admin" && password === "goldenbee";
      setAdminAuth(ok);
      return ok;
    },
    []
  );

  const logout = useCallback(() => {
    if (useApi) api.setStoredToken(null);
    setAdminAuth(false);
  }, []);

  const addCategory = useCallback((name: string): Category => {
    const category: Category = { id: generateId(), name };
    setCategoriesState((prev) => {
      const next = [...prev, category];
      if (useApi && adminAuth) persistToApi(next, products, renderPrice).catch(() => {});
      return next;
    });
    return category;
  }, [adminAuth, products, renderPrice, persistToApi]);

  const updateCategory = useCallback((id: string, name: string) => {
    setCategoriesState((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, name } : c));
      if (useApi && adminAuth) persistToApi(next, products, renderPrice).catch(() => {});
      return next;
    });
  }, [adminAuth, products, renderPrice, persistToApi]);

  const deleteCategory = useCallback((id: string) => {
    const nextCategories = categories.filter((c) => c.id !== id);
    const nextProducts = products.filter((p) => p.categoryId !== id);
    setCategoriesState(nextCategories);
    setProductsState(nextProducts);
    if (useApi && adminAuth) persistToApi(nextCategories, nextProducts, renderPrice).catch(() => {});
  }, [adminAuth, categories, products, renderPrice, persistToApi]);

  const addProduct = useCallback((product: Omit<Product, "id">): Product => {
    const newProduct: Product = { ...product, id: generateId() };
    setProductsState((prev) => {
      const next = [...prev, newProduct];
      if (useApi && adminAuth) persistToApi(categories, next, renderPrice).catch(() => {});
      return next;
    });
    return newProduct;
  }, [adminAuth, categories, renderPrice, persistToApi]);

  const updateProduct = useCallback(
    (id: string, updates: Partial<Omit<Product, "id">>) => {
      setProductsState((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        if (useApi && adminAuth) persistToApi(categories, next, renderPrice).catch(() => {});
        return next;
      });
    },
    [adminAuth, categories, renderPrice, persistToApi]
  );

  const deleteProduct = useCallback((id: string) => {
    setProductsState((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (useApi && adminAuth) persistToApi(categories, next, renderPrice).catch(() => {});
      return next;
    });
  }, [adminAuth, categories, renderPrice, persistToApi]);

  const getProductsByCategoryId = useCallback(
    (categoryId: string) => products.filter((p) => p.categoryId === categoryId),
    [products]
  );

  const resetToDefaultMenu = useCallback(() => {
    setCategoriesState(SEED_CATEGORIES);
    setProductsState(SEED_PRODUCTS);
    if (useApi && adminAuth) {
      persistToApi(SEED_CATEGORIES, SEED_PRODUCTS, renderPrice).catch(() => {});
    }
  }, [adminAuth, renderPrice, persistToApi]);

  const importFromJson = useCallback(
    async (data: { categories: Category[]; products: Product[]; renderPrice: boolean }) => {
      const cats = Array.isArray(data.categories) ? data.categories : [];
      const prods = Array.isArray(data.products) ? data.products : [];
      const rp = data.renderPrice !== false;
      setCategoriesState(cats);
      setProductsState(prods);
      setRenderPriceState(rp);
      if (useApi && adminAuth) {
        await persistToApi(cats, prods, rp);
      }
    },
    [adminAuth, persistToApi]
  );

  const value = useMemo<MenuContextValue>(
    () => ({
      categories,
      products,
      renderPrice,
      adminAuth,
      menuLoading,
      menuError,
      setCategories,
      setProducts,
      setRenderPrice,
      login,
      logout,
      addCategory,
      updateCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByCategoryId,
      resetToDefaultMenu,
      refreshMenu,
      importFromJson,
    }),
    [
      categories,
      products,
      renderPrice,
      adminAuth,
      menuLoading,
      menuError,
      setCategories,
      setProducts,
      setRenderPrice,
      login,
      logout,
      addCategory,
      updateCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByCategoryId,
      resetToDefaultMenu,
      refreshMenu,
      importFromJson,
    ]
  );

  return (
    <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (ctx == null) {
    throw new Error("useMenu must be used within MenuProvider");
  }
  return ctx;
}
