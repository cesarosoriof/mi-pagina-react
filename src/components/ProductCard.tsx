import { Product, formatPrice, waLink } from "../data/products";
import { Route } from "../App";

interface ProductCardProps {
  product: Product;
  navigate: (r: Route) => void;
}

export default function ProductCard({ product, navigate }: ProductCardProps) {
  return (
    <div className="card">
      <button
        className="card-img-wrap"
        onClick={() => navigate({ page: "product", slug: product.slug })}
      >
        <img
          src={product.imagen}
          alt={product.nombre}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "img/evoka-logo.png.png";
          }}
        />
      </button>
      <div className="card-body">
        <h3>{product.nombre}</h3>
        <p className="card-precio">{formatPrice(product.precio)}</p>
        <a
          href={waLink(product.nombre)}
          target="_blank"
          rel="noopener noreferrer"
          className="card-btn"
        >
          Pedir por WhatsApp
        </a>
      </div>
    </div>
  );
}
