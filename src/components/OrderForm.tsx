import { useState } from "react";
import { Product, formatPrice, WA_NUMBER } from "../data/products";

interface OrderFormProps {
  product: Product;
  onClose: () => void;
}

export default function OrderForm({ product, onClose }: OrderFormProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");

  // Fecha mínima: mañana
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleSend = () => {
    if (!nombre || !fecha || !direccion) {
      setError("Por favor completa: nombre, fecha y dirección.");
      return;
    }
    setError("");

    const msg = [
      `🌸 *NUEVO PEDIDO – German Parra*`,
      ``,
      `📦 *Producto:* ${product.nombre}`,
      `💰 *Precio:* ${formatPrice(product.precio)}`,
      ``,
      `👤 *Nombre:* ${nombre}`,
      telefono ? `📱 *Teléfono:* ${telefono}` : null,
      `📅 *Fecha de entrega:* ${fecha}`,
      hora ? `🕐 *Hora:* ${hora}` : null,
      `📍 *Dirección:* ${direccion}`,
      nota ? `📝 *Nota:* ${nota}` : null,
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Hacer pedido</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-product-preview">
          <img src={product.imagen} alt={product.nombre}
            onError={(e) => { (e.target as HTMLImageElement).src = "img/evoka-logo.png.png"; }} />
          <div>
            <p className="modal-product-name">{product.nombre}</p>
            <p className="modal-product-price">{formatPrice(product.precio)}</p>
          </div>
        </div>

        <div className="modal-form">
          <div className="modal-row">
            <label>Tu nombre *</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="¿Cómo te llamas?" />
          </div>
          <div className="modal-row">
            <label>Teléfono de contacto</label>
            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Tu número (opcional)" type="tel" />
          </div>
          <div className="modal-row two-col">
            <div>
              <label>Fecha de entrega *</label>
              <input type="date" value={fecha} min={minDate} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div>
              <label>Hora aproximada</label>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
            </div>
          </div>
          <div className="modal-row">
            <label>Dirección de entrega *</label>
            <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Barrio, calle, ciudad..." />
          </div>
          <div className="modal-row">
            <label>Nota especial (opcional)</label>
            <textarea value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Dedicatoria, instrucciones especiales..." rows={2} />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <button className="btn-wa-large" onClick={handleSend}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
