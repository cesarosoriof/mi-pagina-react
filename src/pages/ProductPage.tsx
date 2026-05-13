import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/products";
import Footer from "../components/Footer";
import ImageZoom from "../components/ImageZoom";
import OrderForm from "../components/OrderForm";
import { useMeta } from "../hooks/useMeta";
import { Route } from "../App";

interface ProductPageProps { slug: string; navigate: (r: Route) => void; }

export default function ProductPage({ slug, navigate }: ProductPageProps) {
  const { getBySlug } = useStore();
  const product = getBySlug(slug);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  useMeta(product ? {
    title: product.nombre,
    description: product.descripcion || `${product.nombre} - ${formatPrice(product.precio)}. Pídelo en German Parra, Bogotá.`,
    image: product.imagen,
    url: `/producto/${product.slug}`,
    type: "product",
  } : {});

  if (!product) {
    return (
      <div className="not-found">
        <h2>Producto no encontrado</h2>
        <button className="btn-primary" onClick={() => navigate({ page: "home" })}>Volver al inicio</button>
      </div>
    );
  }

  const images = product.galeria.length > 0 ? product.galeria : [product.imagen];

  return (
    <>
      {zoomOpen && <ImageZoom images={images} activeIndex={activeImg} onClose={() => setZoomOpen(false)} />}
      {orderOpen && <OrderForm product={product} onClose={() => setOrderOpen(false)} />}

      <div className="producto-page">
        <button className="back-btn" onClick={() => navigate({ page: "catalog", category: product.categoria })}>← Volver</button>

        <div className="producto-detail">
          <div className="producto-gallery">
            <div className="gallery-main clickable" onClick={() => setZoomOpen(true)} title="Clic para ampliar">
              <img src={images[activeImg] ?? product.imagen} alt={product.nombre}
                onError={(e) => { (e.target as HTMLImageElement).src = "img/evoka-logo.png.png"; }} />
              <div className="gallery-zoom-hint">🔍 Ampliar</div>
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <button key={i} className={`thumb${i === activeImg ? " active" : ""}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`${product.nombre} ${i + 1}`}
                      onError={(e) => { (e.target as HTMLImageElement).src = "img/evoka-logo.png.png"; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="producto-info">
            {product.destacado && <span className="badge-destacado">⭐ Destacado</span>}
            <h1>{product.nombre}</h1>
            <div className="producto-precios">
              {product.precioAntes && <span className="precio-antes">{formatPrice(product.precioAntes)}</span>}
              <span className="producto-precio">{formatPrice(product.precio)}</span>
              {product.precioAntes && (
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
            <div className="producto-botones">
              <button className="btn-pedido" onClick={() => setOrderOpen(true)}>📋 Hacer pedido</button>
              <a href={`https://wa.me/573146377283?text=${encodeURIComponent(`Hola, me interesa: *${product.nombre}*`)}`}
                target="_blank" rel="noopener noreferrer" className="btn-wa-large">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer navigate={navigate} />
    </>
  );
}
