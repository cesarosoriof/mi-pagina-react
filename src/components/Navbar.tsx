import { useState, useEffect } from "react";
import { Route } from "../App";

interface NavbarProps {
  navigate: (r: Route) => void;
  currentPage: string;
}

export default function Navbar({ navigate, currentPage }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const links: { label: string; route: Route }[] = [
    { label: "Inicio", route: { page: "home" } },
    { label: "Detalles Sorpresa", route: { page: "catalog", category: "detalles-sorpresa" } },
    { label: "Arreglos Florales", route: { page: "catalog", category: "arreglos-florales" } },
    { label: "Fresas Con Chocolate", route: { page: "catalog", category: "fresas-con-chocolate" } },
    { label: "Como funciona", route: { page: "how-it-works" } },
  ];

  const handleNav = (route: Route) => {
    navigate(route);
    setOpen(false);
    document.body.style.overflow = "";
  };

  const toggleMenu = () => {
    setOpen((v) => {
      document.body.style.overflow = !v ? "hidden" : "";
      return !v;
    });
  };

  // Cerrar con tecla Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className="header"
      style={{ background: open ? "#111" : undefined }}
    >
      {/* Hamburger */}
      <button
        className={`menu-toggle${open ? " open" : ""}`}
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span style={{ background: open ? "#fff" : undefined }} />
        <span style={{ background: open ? "#fff" : undefined }} />
        <span style={{ background: open ? "#fff" : undefined }} />
      </button>

      {/* Logo */}
      <div className="logo">
        <button onClick={() => handleNav({ page: "home" })} className="logo-btn">
          <img
            src="img/evoka-logo.png.png"
            alt="German Parra"
            className="logo-img"
            style={open ? { filter: "invert(1)" } : {}}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className={`nav${open ? " open" : ""}`}>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => handleNav(l.route)}
                className="nav-link"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="header-right" />
    </header>
  );
}