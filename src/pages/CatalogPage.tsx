import { useState, useMemo } from "react";
import { useStore } from "../context/StoreContext";
import { Category, CATEGORY_LABELS, formatPrice, waLink } from "../data/products";
import PriceRange from "../components/PriceRange";
import Footer from "../components/Footer";
import { Route } from "../App";

interface CatalogPageProps {
  category: string;
  navigate: (r: Route) => void;
}

export default function CatalogPage({ category, navigate }: CatalogPageProps) {
  const { getByCategory } = useStore();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const cat = category as Category;
  const allProducts = getByCategory(cat);

  const prices = allProducts.map((p) => p.precio);
  const globalMin = prices.length ? Math.min(...prices) : 0;
  const globalMax = prices.length ? Math.max(...prices) : 500000;

  const [priceRange, setPriceRange] = useState<[number, number]>([globalMin, globalMax]);

  const products = useMemo(() => {
    let list = allProducts;
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter((p) => p.nombre.toLowerCase().includes(term) || (p.descripcion || "").toLowerCase().includes(term));
    }
    list = list.filter((p) => p.precio >= priceRange[0] && p.precio <= priceRange[1]);
    if (sort === "precio-asc") list = [...list].sort((a, b) => a.precio - b.precio);
    else if (sort === "precio-desc") list = [...list].sort((a, b) => b.precio - a.precio);
    else if (sort === "nombre") list = [...list].sort((a, b) => a.nombre.localeCompare(b.nombre));
    else list = [...list].sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
    return list;
  }, [cat, search, sort, priceRange, allProducts]);

  return (
    <>
      <div className="catalogo-page">
        <div className="catalogo-hero">
          <span className="section-tag">✦ Colección</span>
          <h1>{CATEGORY_LABELS[cat] ?? category}</h1>
          <p className="catalogo-count">{products.length} producto{products.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="catalogo-sidebar-layout">
          {/* Sidebar filtros */}
          <aside className="catalogo-filters">
            <h3>Filtros</h3>
            <div className="filter-section">
              <label className="filter-label">Buscar</label>
              <input
                type="text"
                placeholder="Nombre o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-section">
              <label className="filter-label">Ordenar por</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                <option value="default">Destacados primero</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>
            <div className="filter-section">
              <label className="filter-label">Rango de precio</label>
              <PriceRange
                min={globalMin}
                max={globalMax}
                value={priceRange}
                onChange={setPriceRange}
              />
            </div>
            <button
              className="filter-reset"
              onClick={() => { setSearch(""); setSort("default"); setPriceRange([globalMin, globalMax]); }}
            >
              Limpiar filtros
            </button>
          </aside>

          {/* Grid productos */}
          <div className="catalogo-content">
            {products.length === 0 ? (
              <div className="empty-state">
                <p>🌸</p>
                <p>No se encontraron productos con estos filtros.</p>
                <button className="btn-primary" style={{ marginTop: "1rem" }}
                  onClick={() => { setSearch(""); setPriceRange([globalMin, globalMax]); }}>
                  Ver todos
                </button>
              </div>
            ) : (
              <div className="productos-grid">
                {products.map((p) => (
                  <div key={p.id} className={`producto-card${p.destacado ? " card-destacado" : ""}`}>
                    {p.destacado && <div className="card-badge-top">⭐ Destacado</div>}
                    {p.precioAntes && (
                      <div className="card-badge-descuento">
                        -{Math.round((1 - p.precio / p.precioAntes) * 100)}%
                      </div>
                    )}
                    <button className="producto-card-img" onClick={() => navigate({ page: "product", slug: p.slug })}>
                      <img src={p.imagen} alt={p.nombre} loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = "img/evoka-logo.png.png"; }} />
                    </button>
                    <div className="producto-card-body">
                      <h3>{p.nombre}</h3>
                      <div className="card-precios">
                        {p.precioAntes && <span className="card-precio-antes">{formatPrice(p.precioAntes)}</span>}
                        <span className="card-precio">{formatPrice(p.precio)}</span>
                      </div>
                      <div className="card-actions">
                        <button className="card-btn-detail" onClick={() => navigate({ page: "product", slug: p.slug })}>Ver detalle</button>
                        <a href={waLink(p.nombre)} target="_blank" rel="noopener noreferrer" className="card-btn">WhatsApp</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer navigate={navigate} />
    </>
  );
}
