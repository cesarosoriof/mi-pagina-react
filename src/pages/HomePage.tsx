import { useStore } from "../context/StoreContext";
import Carousel from "../components/Carousel";
import Testimonios from "../components/Testimonios";
import Footer from "../components/Footer";
import { useMeta } from "../hooks/useMeta";
import { Route } from "../App";
import { waLink } from "../data/products";

interface HomePageProps { navigate: (r: Route) => void; }

export default function HomePage({ navigate }: HomePageProps) {
  const { getByCategory } = useStore();
  useMeta({});

  const detalles = getByCategory("detalles-sorpresa");
  const arreglos = getByCategory("arreglos-florales");
  const fresas = getByCategory("fresas-con-chocolate");

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <p className="hero-eyebrow">Bogotá, Colombia</p>
          <h1 className="hero-title">Momentos<br /><em>Inolvidables</em></h1>
          <p className="hero-sub">
            Desayunos sorpresa, arreglos florales y detalles únicos
            <br />entregados con amor a quien más quieres.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate({ page: "catalog", category: "detalles-sorpresa" })}>Detalles Sorpresa</button>
            <button className="btn-outline" onClick={() => navigate({ page: "catalog", category: "arreglos-florales" })}>Arreglos Florales</button>
            <button className="btn-two" onClick={() => navigate({ page: "catalog", category: "fresas-con-chocolate" })}>Fresas Con Chocolate</button>
          </div>
        </div>
        <div className="hero-decor">
          <div className="hero-circle c1" />
          <div className="hero-circle c2" />
          <div className="hero-circle c3" />
        </div>
      </section>

      {/* Cómo funciona – mini strip */}
      <section className="how-strip">
        <div className="how-strip-inner">
          {[
            { icono: "🛍️", paso: "Elige tu detalle" },
            { icono: "→", paso: null },
            { icono: "💬", paso: "Pide por WhatsApp" },
            { icono: "→", paso: null },
            { icono: "🎁", paso: "Recibe y sorprende" },
          ].map((item, i) =>
            item.paso ? (
              <div key={i} className="how-strip-step">
                <span className="how-strip-icon">{item.icono}</span>
                <p>{item.paso}</p>
              </div>
            ) : (
              <span key={i} className="how-strip-arrow">{item.icono}</span>
            )
          )}
          <button className="how-strip-link" onClick={() => navigate({ page: "how-it-works" })}>
            Ver proceso completo →
          </button>
        </div>
      </section>

      {/* Detalles Sorpresa */}
      <section className="catalogo-section">
        <div className="section-header">
          <span className="section-tag">✦ Colección</span>
          <h2>Detalles Sorpresa</h2>
          <p>Cada detalle pensado para hacer sonreír</p>
        </div>
        <Carousel products={detalles} navigate={navigate} />
        <div className="section-footer">
          <button className="btn-primary" onClick={() => navigate({ page: "catalog", category: "detalles-sorpresa" })}>Ver todos</button>
        </div>
      </section>

      {/* Arreglos Florales */}
      <section className="catalogo-section alt-bg">
        <div className="section-header">
          <span className="section-tag">✦ Colección</span>
          <h2>Arreglos Florales</h2>
          <p>Belleza natural para cada ocasión especial</p>
        </div>
        <Carousel products={arreglos} navigate={navigate} />
        <div className="section-footer">
          <button className="btn-primary" onClick={() => navigate({ page: "catalog", category: "arreglos-florales" })}>Ver todos</button>
        </div>
      </section>

      {/* Fresas Con Chocolate */}
      <section className="catalogo-section">
        <div className="section-header">
          <span className="section-tag">✦ Colección</span>
          <h2>Fresas Con Chocolate</h2>
          <p>Un toque dulce para endulzar el día</p>
        </div>
        <Carousel products={fresas} navigate={navigate} />
        <div className="section-footer">
          <button className="btn-primary" onClick={() => navigate({ page: "catalog", category: "fresas-con-chocolate" })}>Ver todos</button>
        </div>
      </section>

      {/* Testimonios */}
      <Testimonios />

      {/* WhatsApp Banner */}
      <section className="wa-banner">
        <div className="wa-banner-inner">
          <div>
            <h3>¿Tienes alguna duda?</h3>
            <p>Escríbenos por WhatsApp, con gusto te atendemos.</p>
          </div>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-wa">Escribir ahora</a>
        </div>
      </section>

      <Footer navigate={navigate} />
    </>
  );
}