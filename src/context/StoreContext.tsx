import { createContext, useContext, useState, ReactNode } from "react";
import { Product, INITIAL_PRODUCTS, Category, generateSlug } from "../data/products";

interface StoreContextType {
  products: Product[];
  getBySlug: (slug: string) => Product | undefined;
  getByCategory: (category: Category) => Product[];
  createProduct: (data: Omit<Product, "id" | "activo">) => Product;
  updateProduct: (id: number, data: Partial<Product>) => boolean;
  deleteProduct: (id: number) => boolean;
  restoreProduct: (id: number) => boolean;
  reorderProducts: (fromIndex: number, toIndex: number) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const getBySlug = (slug: string) =>
    products.find((p) => p.slug === slug && p.activo);

  const getByCategory = (category: Category) =>
    products.filter((p) => p.categoria === category && p.activo);

  const createProduct = (data: Omit<Product, "id" | "activo">): Product => {
    const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
    const slug = data.slug || generateSlug(data.nombre);
    const nuevo: Product = { ...data, id: maxId + 1, slug, activo: true };
    setProducts((prev) => [...prev, nuevo]);
    return nuevo;
  };

  const updateProduct = (id: number, data: Partial<Product>): boolean => {
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    return true;
  };

  const deleteProduct = (id: number): boolean => updateProduct(id, { activo: false });
  const restoreProduct = (id: number): boolean => updateProduct(id, { activo: true });

  const reorderProducts = (fromIndex: number, toIndex: number) => {
    setProducts((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <StoreContext.Provider value={{
      products, getBySlug, getByCategory,
      createProduct, updateProduct, deleteProduct, restoreProduct, reorderProducts,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
