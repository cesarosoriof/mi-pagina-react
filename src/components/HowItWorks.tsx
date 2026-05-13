import { useState } from "react";
import { waLink } from "../data/products";

const PASOS = [
  {
    numero: "01",
    icono: "🛍️",
    titulo: "Elige tu detalle",
    descripcion: "Explora nuestro catalogo de desayunos sorpresa, arreglos florales y fresas con chocolate. Filtra por precio o categoria hasta encontrar el regalo perfecto.",
    detalle: ["Mas de 20 productos disponibles", "Filtro por presupuesto", "Fotos reales de cada producto"],
  },
  {
    numero: "02",
    icono: "💬",
    titulo: "Haz tu pedido",
    descripcion: "Haz clic en Hacer pedido e indica nombre, fecha, hora y direccion de entrega. El mensaje llega directamente a nuestro WhatsApp.",
    detalle: ["Confirma en segundos por WhatsApp", "Selecciona fecha y hora", "Personaliza con dedicatoria"],
  },
  {
    numero: "03",
    icono: "🎁",
    titulo: "Recibe y sorprende",
    descripcion: "Preparamos tu pedido con amor y lo entregamos puntualmente. Embalado con detalle para que la experiencia sea perfecta.",
    detalle: ["Entrega a domicilio en Bogota", "Empaque premium incluido", "Fotos del pedido antes de entregar"],
  },
];

const FAQS = [
  { pregunta: "Con cuanto tiempo de anticipacion debo pedir?", respuesta: "Recomendamos hacer el pedido con al menos 24 horas de anticipacion. Para fechas especiales como 14 de febrero o Dia de la Madre, se recomienda con 3-5 dias." },
  { pregunta: "Hacen entregas a domicilio?", respuesta: "Si, hacemos entregas a domicilio en Bogota y municipios cercanos. El costo de envio varia segun la zona y se confirma al momento del pedido." },
  { pregunta: "Puedo personalizar mi pedido?", respuesta: "Claro! Escribenos por WhatsApp y con gusto te ayudamos a personalizar tu detalle con fotos, dedicatorias o productos adicionales." },
  { pregunta: "Cuales son los metodos de pago?", respuesta: "Aceptamos transferencia bancaria, Nequi, Daviplata y efectivo contra entrega. El pago se confirma por WhatsApp antes de preparar el pedido." },
  { pregunta: "Que pasa si no hay nadie en la direccion de entrega?", respuesta: "Nos comunicamos previamente para confirmar la entrega. Si no es posible entregar, coordinamos una nueva fecha sin costo adicional." },
];

export default function HowItWorks() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="how-page">
      <section className="how-hero">
        <div className="how-hero-content">
          <span className="section-tag">Proceso</span>
          <h1>Como funciona?</h1>
          <p>Sorprender a quien amas es mas facil de lo que crees. Solo 3 pasos.</p>
        </div>
      </section>

      <section className="how-steps">
        <div className="how-steps-inner">
          {PASOS.map((paso, i) => (
            <div key={i} className="how-step">
              <div className="how-step-numero">{paso.numero}</div>
              <div className="how-step-icono">{paso.icono}</div>
              <div className="how-step-body">
                <h3>{paso.titulo}</h3>
                <p>{paso.descripcion}</p>
                <ul className="how-step-detalle">
                  {paso.detalle.map((d, j) => (
                    <li key={j}>ok {d}</li>
                  ))}
                </ul>
              </div>
              {i < PASOS.length - 1 && <div className="how-step-arrow">&#8594;</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="how-stats">
        <div className="how-stats-inner">
          {[
            { numero: "500+", label: "Pedidos entregados" },
            { numero: "4.9", label: "Calificacion promedio" },
            { numero: "24h", label: "Tiempo de respuesta" },
            { numero: "100%", label: "Clientes satisfechos" },
          ].map((s, i) => (
            <div key={i} className="how-stat">
              <p className="how-stat-num">{s.numero}</p>
              <p className="how-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-faq">
        <div className="section-header">
          <span className="section-tag">Preguntas frecuentes</span>
          <h2>Tienes dudas?</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item${faqOpen === i ? " open" : ""}`}>
              <button className="faq-question" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                <span>{faq.pregunta}</span>
                <span className="faq-arrow">{faqOpen === i ? "-" : "+"}</span>
              </button>
              {faqOpen === i && (
                <div className="faq-answer"><p>{faq.respuesta}</p></div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="how-cta">
        <div className="how-cta-inner">
          <h2>Listo para sorprender?</h2>
          <p>Escribenos ahora y te ayudamos a elegir el detalle perfecto.</p>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-wa">
            Hablar con nosotros
          </a>
        </div>
      </section>
    </div>
  );
}