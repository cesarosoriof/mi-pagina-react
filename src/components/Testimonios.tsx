import { useState } from "react";

interface Testimonio {
  id: number;
  nombre: string;
  ciudad: string;
  estrellas: number;
  texto: string;
  fecha: string;
  producto?: string;
}

const TESTIMONIOS_INICIALES: Testimonio[] = [
  {
    id: 1,
    nombre: "María Fernanda",
    ciudad: "Bogotá",
    estrellas: 5,
    texto: "El desayuno llegó puntual y presentado de una manera hermosa. Mi mamá lloró de la emoción. Definitivamente lo mejor para sorprender a alguien especial.",
    fecha: "Abril 2026",
    producto: "Sonata De Verano",
  },
  {
    id: 2,
    nombre: "Carlos Andrés",
    ciudad: "Bogotá",
    estrellas: 5,
    texto: "Pedí el arreglo de rosas para el aniversario de mi novia y quedó espectacular. La atención por WhatsApp fue muy rápida y el producto superó mis expectativas.",
    fecha: "Marzo 2026",
    producto: "Rosas Rosé",
  },
  {
    id: 3,
    nombre: "Valentina Torres",
    ciudad: "Chía",
    estrellas: 5,
    texto: "Las fresas con chocolate llegaron en perfecto estado, muy bien decoradas. El sabor increíble. Ya es la segunda vez que compro y siempre quedo feliz.",
    fecha: "Mayo 2026",
    producto: "Fresas con Chocolate",
  },
  {
    id: 4,
    nombre: "Sebastián Ruiz",
    ciudad: "Bogotá",
    estrellas: 5,
    texto: "Sorprendí a mi novia con el Diamante de la Corona y fue un éxito total. El detalle de las fotos personalizadas hizo que todo fuera muy especial.",
    fecha: "Febrero 2026",
    producto: "Diamante De La Corona",
  },
  {
    id: 5,
    nombre: "Luisa Gómez",
    ciudad: "Bogotá",
    estrellas: 4,
    texto: "Muy buen servicio y productos de calidad. La entrega fue a tiempo y el empaque muy cuidado. Lo recomiendo para cualquier ocasión especial.",
    fecha: "Enero 2026",
  },
];

function Stars({ count, interactive = false, onChange }: {
  count: number;
  interactive?: boolean;
  onChange?: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`star${(interactive ? (hover || count) : count) >= i ? " filled" : ""}`}
          onClick={() => interactive && onChange?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          style={{ cursor: interactive ? "pointer" : "default" }}
        >★</span>
      ))}
    </div>
  );
}

export default function Testimonios() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>(TESTIMONIOS_INICIALES);
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [texto, setTexto] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [producto, setProducto] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = () => {
    if (!nombre || !texto || estrellas === 0) return;
    const nuevo: Testimonio = {
      id: Date.now(),
      nombre, ciudad, texto, estrellas,
      producto: producto || undefined,
      fecha: new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" }),
    };
    setTestimonios((prev) => [nuevo, ...prev]);
    setEnviado(true);
    setNombre(""); setCiudad(""); setTexto(""); setEstrellas(5); setProducto("");
    setTimeout(() => { setShowForm(false); setEnviado(false); }, 2500);
  };

  const promedio = (testimonios.reduce((s, t) => s + t.estrellas, 0) / testimonios.length).toFixed(1);

  return (
    <section className="testimonios-section">
      <div className="section-header">
        <span className="section-tag">✦ Opiniones</span>
        <h2>Lo que dicen nuestros clientes</h2>
        <div className="testimonios-resumen">
          <span className="resumen-score">{promedio}</span>
          <Stars count={Math.round(Number(promedio))} />
          <span className="resumen-total">({testimonios.length} reseñas)</span>
        </div>
      </div>

      <div className="testimonios-grid">
        {testimonios.map((t) => (
          <div key={t.id} className="testimonio-card">
            <div className="testimonio-header">
              <div className="testimonio-avatar">
                {t.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="testimonio-nombre">{t.nombre}</p>
                <p className="testimonio-ciudad">{t.ciudad} · {t.fecha}</p>
              </div>
            </div>
            <Stars count={t.estrellas} />
            {t.producto && <p className="testimonio-producto">📦 {t.producto}</p>}
            <p className="testimonio-texto">"{t.texto}"</p>
          </div>
        ))}
      </div>

      <div className="testimonios-footer">
        {!showForm ? (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            ✍️ Dejar mi reseña
          </button>
        ) : (
          <div className="review-form">
            <h3>Comparte tu experiencia</h3>
            {enviado ? (
              <p className="review-thanks">🌸 ¡Gracias por tu reseña! Ya está publicada.</p>
            ) : (
              <>
                <div className="review-stars-select">
                  <label>Tu calificación</label>
                  <Stars count={estrellas} interactive onChange={setEstrellas} />
                </div>
                <div className="modal-row">
                  <label>Tu nombre *</label>
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="¿Cómo te llamas?" />
                </div>
                <div className="modal-row two-col">
                  <div>
                    <label>Ciudad</label>
                    <input value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Bogotá" />
                  </div>
                  <div>
                    <label>Producto (opcional)</label>
                    <input value={producto} onChange={(e) => setProducto(e.target.value)} placeholder="Nombre del producto" />
                  </div>
                </div>
                <div className="modal-row">
                  <label>Tu opinión *</label>
                  <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={3} placeholder="Cuéntanos tu experiencia..." />
                </div>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button className="btn-primary" onClick={handleSubmit}>Publicar reseña</button>
                  <button className="admin-btn secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
