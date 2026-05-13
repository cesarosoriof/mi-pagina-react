import { useState } from "react";
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

  return (
    <header className={`header${open ? " menu-open" : ""}`} id="mainHeader">
      <button
        className={`menu-toggle${open ? " open" : ""}`}
        onClick={toggleMenu}
        aria-label="Menú"
      >
        <span /><span /><span />
      </button>

      <div className="logo">
        <button onClick={() => handleNav({ page: "home" })} className="logo-btn">
          <img src="img/evoka-logo.png.png" alt="Évoka Studio" className="logo-img" />
        </button>
      </div>

      <nav className={`nav${open ? " open" : ""}`}>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => handleNav(l.route)}
                className={`nav-link${currentPage === "home" && l.route.page === "home" ? " active" : ""}`}
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
