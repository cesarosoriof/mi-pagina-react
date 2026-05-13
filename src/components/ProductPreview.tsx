import { useState } from "react";
import { Product, formatPrice } from "../data/products";

interface ProductPreviewProps {
  product: Omit<Product, "id" | "activo">;
  onClose: () => void;
  onConfirm: () => void;
  isEdit?: boolean;
}

export default function ProductPreview({ product, onClose, onConfirm, isEdit }: ProductPreviewProps) {
  const [activeImg, setActiveImg] = useState(0);
  const images = product.galeria.length > 0 ? product.galeria : product.imagen ? [product.imagen] : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="preview-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👁️ Vista previa del producto</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="preview-body">
          {/* Galería */}
          <div className="preview-gallery">
            <div className="preview-main-img">
              {images[activeImg]
                ? <img src={images[activeImg]} alt={product.nombre} onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
                : <div className="preview-no-img">📷 Sin imagen</div>}
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbs" style={{ marginTop: "0.75rem" }}>
                {images.map((img, i) => (
                  <button key={i} className={`thumb${i === activeImg ? " active" : ""}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`img ${i}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="preview-info">
            <div className="preview-cat">{product.categoria.replace(/-/g, " ")}</div>
            {product.destacado && <span className="badge-destacado">⭐ Destacado</span>}
            <h3 className="preview-nombre">{product.nombre || <em style={{ color: "#999" }}>Sin nombre</em>}</h3>

            <div className="producto-precios">
              {product.precioAntes && <span className="precio-antes">{formatPrice(product.precioAntes)}</span>}
              <span className="producto-precio">{product.precio ? formatPrice(product.precio) : "—"}</span>
              {product.precioAntes && product.precio && (
                <span className="descuento-badge">-{Math.round((1 - product.precio / product.precioAntes) * 100)}%</span>
              )}
            </div>

            {product.descripcion && <p className="producto-descripcion">{product.descripcion}</p>}

            {product.contenido.length > 0 && (
              <div className="producto-contenido">
                <h3>¿Qué incluye?</h3>
                <ul>{product.contenido.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
            )}
          </div>
        </div>

        <div className="preview-footer">
          <p className="preview-note">Así se verá el producto en el sitio web.</p>
          <div className="preview-actions">
            <button className="admin-btn secondary" onClick={onClose}>← Seguir editando</button>
            <button className="admin-btn primary" onClick={onConfirm}>
              ✓ {isEdit ? "Guardar cambios" : "Publicar producto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
