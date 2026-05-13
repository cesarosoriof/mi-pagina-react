import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { Product, Category, CATEGORY_LABELS, formatPrice, generateSlug } from "../data/products";
import ProductPreview from "../components/ProductPreview";
import { Route } from "../App";

interface AdminPanelProps { navigate: (r: Route) => void; }
type Tab = "productos" | "crear" | "reordenar" | "configuracion";

export default function AdminPanel({ navigate }: AdminPanelProps) {
  const { isAuthenticated, logout, changePassword } = useAuth();
  const { products, updateProduct, deleteProduct, restoreProduct, createProduct, reorderProducts } = useStore();
  const [tab, setTab] = useState<Tab>("productos");
  const [editId, setEditId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [showInactive, setShowInactive] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState("");

  useEffect(() => { if (!isAuthenticated) navigate({ page: "admin-login" }); }, [isAuthenticated]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const handleLogout = () => { logout(); navigate({ page: "home" }); };
  const handlePasswordChange = () => {
    if (!newPass || newPass.length < 4) { setPassMsg("Mínimo 4 caracteres."); return; }
    const ok = changePassword(newPass);
    setPassMsg(ok ? "✓ Contraseña actualizada." : "Error."); setNewPass("");
  };

  const visibleProducts = products.filter((p) => {
    if (!showInactive && !p.activo) return false;
    if (filterCat !== "all" && p.categoria !== filterCat) return false;
    return true;
  });

  return (
    <div className="admin-panel">
      {toast && <div className="admin-toast">{toast}</div>}

      {confirmDelete !== null && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>⚠️ ¿Eliminar este producto permanentemente?</p>
            <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>Esta acción no se puede deshacer.</p>
            <div className="confirm-actions">
              <button className="admin-btn danger" onClick={() => { deleteProduct(confirmDelete); showToast("🗑️ Eliminado"); setConfirmDelete(null); }}>Sí, eliminar</button>
              <button className="admin-btn secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <aside className="admin-sidebar">
        <div className="admin-brand">German<em>Parra</em></div>
        <nav className="admin-nav">
          <button className={`admin-nav-item${tab === "productos" ? " active" : ""}`} onClick={() => setTab("productos")}>📦 Productos</button>
          <button className={`admin-nav-item${tab === "crear" ? " active" : ""}`} onClick={() => { setEditId(null); setTab("crear"); }}>➕ Crear producto</button>
          <button className={`admin-nav-item${tab === "reordenar" ? " active" : ""}`} onClick={() => setTab("reordenar")}>↕️ Reordenar</button>
          <button className={`admin-nav-item${tab === "configuracion" ? " active" : ""}`} onClick={() => setTab("configuracion")}>⚙️ Configuración</button>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={() => navigate({ page: "home" })} className="admin-link-btn">← Ver sitio</button>
          <button onClick={handleLogout} className="admin-logout-btn">Cerrar sesión</button>
        </div>
      </aside>

      <main className="admin-main">
        {tab === "productos" && (
          <ProductsTab products={visibleProducts} filterCat={filterCat} setFilterCat={setFilterCat}
            showInactive={showInactive} setShowInactive={setShowInactive}
            onToggleActive={(id, active) => { if (active) restoreProduct(id); else deleteProduct(id); showToast(active ? "Restaurado" : "Desactivado"); }}
            onEdit={(id) => { setEditId(id); setTab("crear"); }}
            onDelete={(id) => setConfirmDelete(id)} />
        )}
        {tab === "crear" && (
          <CreateProductTab editId={editId} products={products}
            onCreate={(data) => { createProduct(data); showToast("✓ Producto publicado"); setTab("productos"); }}
            onUpdate={(id, data) => { updateProduct(id, data); showToast("✓ Guardado"); setEditId(null); setTab("productos"); }}
            onCancel={() => { setEditId(null); setTab("productos"); }} />
        )}
        {tab === "reordenar" && (
          <ReorderTab products={products.filter(p => p.activo)} onReorder={reorderProducts} showToast={showToast} />
        )}
        {tab === "configuracion" && (
          <div className="admin-section">
            <h2>Configuración</h2>
            <div className="config-card">
              <h3>Cambiar contraseña</h3>
              <div className="form-row">
                <input type="password" placeholder="Nueva contraseña" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="admin-input" />
                <button className="admin-btn primary" onClick={handlePasswordChange}>Actualizar</button>
              </div>
              {passMsg && <p className={`config-msg${passMsg.startsWith("✓") ? " ok" : " error"}`}>{passMsg}</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Products Tab ──
function ProductsTab({ products, filterCat, setFilterCat, showInactive, setShowInactive, onToggleActive, onEdit, onDelete }: {
  products: Product[]; filterCat: string; setFilterCat: (v: string) => void;
  showInactive: boolean; setShowInactive: (v: boolean) => void;
  onToggleActive: (id: number, active: boolean) => void;
  onEdit: (id: number) => void; onDelete: (id: number) => void;
}) {
  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Productos ({products.length})</h2>
        <div className="admin-filters">
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="admin-select">
            <option value="all">Todas las categorías</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <label className="admin-check">
            <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} /> Mostrar inactivos
          </label>
        </div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Promo</th><th>⭐</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={p.activo ? "" : "inactive-row"}>
                <td><img src={p.imagen} alt={p.nombre} className="admin-thumb" onError={(e) => { (e.target as HTMLImageElement).src = "img/evoka-logo.png.png"; }} /></td>
                <td>{p.nombre}</td>
                <td>{CATEGORY_LABELS[p.categoria]}</td>
                <td>{formatPrice(p.precio)}</td>
                <td>{p.precioAntes ? <span className="badge badge-orange">{formatPrice(p.precioAntes)}</span> : "—"}</td>
                <td>{p.destacado ? "⭐" : "—"}</td>
                <td><span className={`badge ${p.activo ? "badge-green" : "badge-gray"}`}>{p.activo ? "Activo" : "Inactivo"}</span></td>
                <td className="admin-actions">
                  <button className="admin-btn sm" onClick={() => onEdit(p.id)}>Editar</button>
                  <button className={`admin-btn sm ${p.activo ? "danger" : "secondary"}`} onClick={() => onToggleActive(p.id, p.activo)}>{p.activo ? "Desactivar" : "Restaurar"}</button>
                  <button className="admin-btn sm danger" onClick={() => onDelete(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Reorder Tab – drag & drop ──
function ReorderTab({ products, onReorder, showToast }: {
  products: Product[];
  onReorder: (from: number, to: number) => void;
  showToast: (msg: string) => void;
}) {
  const [filterCat, setFilterCat] = useState<string>("all");
  const dragIndex = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const filtered = products.filter(p => filterCat === "all" || p.categoria === filterCat);

  const handleDragStart = (globalIndex: number, id: number) => {
    dragIndex.current = globalIndex;
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, globalIndex: number) => {
    e.preventDefault();
    setOverIndex(globalIndex);
  };

  const handleDrop = (globalIndex: number) => {
    if (dragIndex.current === null || dragIndex.current === globalIndex) return;
    onReorder(dragIndex.current, globalIndex);
    showToast("↕️ Orden actualizado");
    dragIndex.current = null;
    setDraggingId(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDraggingId(null);
    setOverIndex(null);
  };

  // Map filtered index back to global products index
  const getGlobalIndex = (product: Product) => products.findIndex(p => p.id === product.id);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Reordenar productos</h2>
        <div className="admin-filters">
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="admin-select">
            <option value="all">Todas las categorías</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <p className="reorder-hint">Arrastra los productos para cambiar el orden en que aparecen en el catálogo.</p>
      <div className="reorder-list">
        {filtered.map((p) => {
          const globalIdx = getGlobalIndex(p);
          const isDragging = draggingId === p.id;
          const isOver = overIndex === globalIdx;
          return (
            <div
              key={p.id}
              className={`reorder-item${isDragging ? " dragging" : ""}${isOver ? " drag-over" : ""}`}
              draggable
              onDragStart={() => handleDragStart(globalIdx, p.id)}
              onDragOver={(e) => handleDragOver(e, globalIdx)}
              onDrop={() => handleDrop(globalIdx)}
              onDragEnd={handleDragEnd}
            >
              <div className="reorder-handle">⠿</div>
              <img src={p.imagen} alt={p.nombre} className="reorder-thumb"
                onError={(e) => { (e.target as HTMLImageElement).src = "img/evoka-logo.png.png"; }} />
              <div className="reorder-info">
                <p className="reorder-nombre">{p.nombre}</p>
                <p className="reorder-cat">{CATEGORY_LABELS[p.categoria]}</p>
              </div>
              {p.destacado && <span className="badge badge-yellow">⭐</span>}
              <span className="reorder-precio">{formatPrice(p.precio)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Create / Edit Tab ──
function CreateProductTab({ editId, products, onCreate, onUpdate, onCancel }: {
  editId: number | null; products: Product[];
  onCreate: (data: Omit<Product, "id" | "activo">) => void;
  onUpdate: (id: number, data: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const editing = editId !== null ? products.find((p) => p.id === editId) : null;
  const [nombre, setNombre] = useState(editing?.nombre ?? "");
  const [categoria, setCategoria] = useState<Category>(editing?.categoria ?? "detalles-sorpresa");
  const [precio, setPrecio] = useState(String(editing?.precio ?? ""));
  const [precioAntes, setPrecioAntes] = useState(String(editing?.precioAntes ?? ""));
  const [descripcion, setDescripcion] = useState(editing?.descripcion ?? "");
  const [destacado, setDestacado] = useState(editing?.destacado ?? false);
  const [imagenPreview, setImagenPreview] = useState(editing?.imagen ?? "");
  const [galeriaPreview, setGaleriaPreview] = useState<string[]>(editing?.galeria ?? []);
  const [contenidoRaw, setContenidoRaw] = useState(editing ? editing.contenido.join("\n") : "");
  const [showPreview, setShowPreview] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const galInputRef = useRef<HTMLInputElement>(null);

  const handleImagenUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenPreview(URL.createObjectURL(file));
  };
  const handleGaleriaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setGaleriaPreview((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };
  const removeGaleriaImg = (idx: number) => setGaleriaPreview((prev) => prev.filter((_, i) => i !== idx));

  const buildData = (): Omit<Product, "id" | "activo"> => ({
    nombre, slug: generateSlug(nombre), categoria,
    precio: Number(precio),
    precioAntes: precioAntes ? Number(precioAntes) : undefined,
    descripcion, destacado,
    imagen: imagenPreview,
    contenido: contenidoRaw.split("\n").map((s) => s.trim()).filter(Boolean),
    galeria: galeriaPreview,
  });

  const handleConfirm = () => {
    const data = buildData();
    if (editing) onUpdate(editing.id, data); else onCreate(data);
  };

  return (
    <div className="admin-section">
      {showPreview && (
        <ProductPreview
          product={buildData()}
          onClose={() => setShowPreview(false)}
          onConfirm={() => { setShowPreview(false); handleConfirm(); }}
          isEdit={!!editing}
        />
      )}

      <div className="admin-section-header">
        <h2>{editing ? `Editar: ${editing.nombre}` : "Crear producto"}</h2>
        <button className="admin-btn secondary" onClick={() => setShowPreview(true)}>👁️ Vista previa</button>
      </div>

      <div className="create-form">
        <div className="form-row"><label>Nombre *</label><input className="admin-input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del producto" /></div>
        <div className="form-row"><label>Categoría</label>
          <select className="admin-select" value={categoria} onChange={(e) => setCategoria(e.target.value as Category)}>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="form-two-col">
          <div className="form-row"><label>Precio actual (COP) *</label><input className="admin-input" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="98000" /></div>
          <div className="form-row"><label>Precio anterior / tachado</label><input className="admin-input" type="number" value={precioAntes} onChange={(e) => setPrecioAntes(e.target.value)} placeholder="120000 (opcional)" /></div>
        </div>
        <div className="form-row"><label>Descripción</label><textarea className="admin-input" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} placeholder="Descripción corta" /></div>
        <div className="form-row">
          <label className="admin-check" style={{ flexDirection: "row", gap: "0.75rem", alignItems: "center" }}>
            <input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} />
            <span>⭐ Marcar como producto destacado</span>
          </label>
        </div>
        <div className="form-row">
          <label>Imagen principal</label>
          <div className="img-upload-area" onClick={() => imgInputRef.current?.click()}>
            {imagenPreview
              ? <img src={imagenPreview} alt="preview" className="img-upload-preview" />
              : <div className="img-upload-placeholder"><span>📷</span><p>Haz clic para seleccionar imagen</p></div>}
          </div>
          <input ref={imgInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImagenUpload} />
          {imagenPreview && <button className="admin-btn sm danger" style={{ marginTop: "0.5rem" }} onClick={() => setImagenPreview("")}>Quitar imagen</button>}
        </div>
        <div className="form-row">
          <label>Galería de imágenes</label>
          <div className="galeria-grid">
            {galeriaPreview.map((url, i) => (
              <div key={i} className="galeria-item">
                <img src={url} alt={`g${i}`} />
                <button className="galeria-remove" onClick={() => removeGaleriaImg(i)}>✕</button>
              </div>
            ))}
            <button className="galeria-add" onClick={() => galInputRef.current?.click()}><span>+</span><p>Agregar</p></button>
          </div>
          <input ref={galInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleGaleriaUpload} />
        </div>
        <div className="form-row"><label>Contenido (una línea por ítem)</label>
          <textarea className="admin-input" value={contenidoRaw} onChange={(e) => setContenidoRaw(e.target.value)} rows={6} placeholder={"2 sandwich premium\n1 jugo de naranja"} />
        </div>
        <div className="form-actions">
          <button className="admin-btn primary" onClick={() => setShowPreview(true)}>👁️ Vista previa y publicar</button>
          <button className="admin-btn secondary" onClick={handleConfirm}>{editing ? "Guardar sin previsualizar" : "Publicar directo"}</button>
          <button className="admin-btn secondary" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
