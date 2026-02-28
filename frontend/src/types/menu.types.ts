export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
}

export const STORAGE_KEYS = {
  CATEGORIES: "goldenbee_categories",
  PRODUCTS: "goldenbee_products",
  RENDER_PRICE: "goldenbee_renderPrice",
  ADMIN_AUTH: "goldenbee_adminAuth",
} as const;

export const ADMIN_CREDENTIALS = {
  USERNAME: "admin",
  PASSWORD: "goldenbee",
} as const;
