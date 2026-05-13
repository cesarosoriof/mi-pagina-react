import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, INITIAL_PRODUCTS, Category, generateSlug } from "../data/products";

const STORAGE_KEY = "germanparra_products";

function loadProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_PRODUCTS;
}

function saveProducts(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn("localStorage lleno, no se pudieron guardar los productos:", e);
  }
}

// Convierte un blob URL a base64 para persistir en localStorage
async function blobToBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return url; // si falla, retorna la url original
  }
}

async function convertProductImages(product: Omit<Product, "id" | "activo"> | Partial<Product>): Promise<typeof product> {
  const result = { ...product };

  // Convertir imagen principal
  if (result.imagen && result.imagen.startsWith("blob:")) {
    result.imagen = await blobToBase64(result.imagen);
  }

  // Convertir galería
  if (result.galeria) {
    result.galeria = await Promise.all(
      result.galeria.map(async (url) =>
        url.startsWith("blob:") ? await blobToBase64(url) : url
      )
    );
  }

  return result;
}

interface StoreContextType {
  products: Product[];
  getBySlug: (slug: string) => Product | undefined;
  getByCategory: (category: Category) => Product[];
  createProduct: (data: Omit<Product, "id" | "activo">) => Promise<Product>;
  updateProduct: (id: number, data: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: number) => boolean;
  restoreProduct: (id: number) => boolean;
  reorderProducts: (fromIndex: number, toIndex: number) => void;
  resetToDefault: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const getBySlug = (slug: string) =>
    products.find((p) => p.slug === slug && p.activo);

  const getByCategory = (category: Category) =>
    products.filter((p) => p.categoria === category && p.activo);

  const createProduct = async (data: Omit<Product, "id" | "activo">): Promise<Product> => {
    const converted = await convertProductImages(data) as Omit<Product, "id" | "activo">;
    const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
    const slug = converted.slug || generateSlug(converted.nombre);
    const nuevo: Product = { ...converted, id: maxId + 1, slug, activo: true };
    setProducts((prev) => {
      const next = [...prev, nuevo];
      saveProducts(next);
      return next;
    });
    return nuevo;
  };

  const updateProduct = async (id: number, data: Partial<Product>): Promise<boolean> => {
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    const converted = await convertProductImages(data) as Partial<Product>;
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...converted } : p));
      saveProducts(next);
      return next;
    });
    return true;
  };

  const deleteProduct = (id: number): boolean => {
    setProducts((prev) => {
      const next = prev.map((p) => p.id === id ? { ...p, activo: false } : p);
      saveProducts(next);
      return next;
    });
    return true;
  };

  const restoreProduct = (id: number): boolean => {
    setProducts((prev) => {
      const next = prev.map((p) => p.id === id ? { ...p, activo: true } : p);
      saveProducts(next);
      return next;
    });
    return true;
  };

  const reorderProducts = (fromIndex: number, toIndex: number) => {
    setProducts((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      saveProducts(next);
      return next;
    });
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts(INITIAL_PRODUCTS);
  };

  return (
    <StoreContext.Provider value={{
      products, getBySlug, getByCategory,
      createProduct, updateProduct, deleteProduct,
      restoreProduct, reorderProducts, resetToDefault,
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