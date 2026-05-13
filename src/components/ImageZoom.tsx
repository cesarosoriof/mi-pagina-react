import { useState, useEffect } from "react";

interface ImageZoomProps {
  images: string[];
  activeIndex: number;
  onClose: () => void;
}

export default function ImageZoom({ images, activeIndex, onClose }: ImageZoomProps) {
  const [current, setCurrent] = useState(activeIndex);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % images.length);
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  return (
    <div className="zoom-overlay" onClick={onClose}>
      <button className="zoom-close" onClick={onClose}>✕</button>

      {images.length > 1 && (
        <button
          className="zoom-nav prev"
          onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); }}
        >‹</button>
      )}

      <div className="zoom-img-wrap" onClick={(e) => e.stopPropagation()}>
        <img src={images[current]} alt={`Imagen ${current + 1}`} className="zoom-img"
          onError={(e) => { (e.target as HTMLImageElement).src = "img/evoka-logo.png.png"; }} />
      </div>

      {images.length > 1 && (
        <button
          className="zoom-nav next"
          onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); }}
        >›</button>
      )}

      {images.length > 1 && (
        <div className="zoom-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`zoom-dot${i === current ? " active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            />
          ))}
        </div>
      )}

      <p className="zoom-hint">Presiona Esc para cerrar · ← → para navegar</p>
    </div>
  );
}
