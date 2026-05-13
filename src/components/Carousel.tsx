import { useRef } from "react";
import { Product } from "../data/products";
import ProductCard from "./ProductCard";
import { Route } from "../App";

interface CarouselProps {
  products: Product[];
  navigate: (r: Route) => void;
}

export default function Carousel({ products, navigate }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll(".card");
    if (cards.length < 2) return;
    const step =
      (cards[1] as HTMLElement).offsetLeft -
      (cards[0] as HTMLElement).offsetLeft;
    ref.current.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  return (
    <div className="carousel-wrapper">
      <button className="carousel-btn prev-btn" onClick={() => scroll("left")} aria-label="Anterior">
        ‹
      </button>
      <div className="carousel" ref={ref}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} navigate={navigate} />
        ))}
      </div>
      <button className="carousel-btn next-btn" onClick={() => scroll("right")} aria-label="Siguiente">
        ›
      </button>
    </div>
  );
}
