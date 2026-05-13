import { useState } from "react";
import { StoreProvider } from "./context/StoreContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

export type Route =
  | { page: "home" }
  | { page: "catalog"; category: string }
  | { page: "product"; slug: string }
  | { page: "how-it-works" }
  | { page: "admin-login" }
  | { page: "admin-panel" };

export default function App() {
  const [route, setRoute] = useState<Route>(
    window.location.hash === "#admin" ? { page: "admin-login" } : { page: "home" }
  );

  const navigate = (r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isAdmin = route.page === "admin-login" || route.page === "admin-panel";

  return (
    <AuthProvider>
      <StoreProvider>
        {!isAdmin && <Navbar navigate={navigate} currentPage={route.page} />}

        {route.page === "home" && <HomePage navigate={navigate} />}
        {route.page === "catalog" && <CatalogPage category={route.category} navigate={navigate} />}
        {route.page === "product" && <ProductPage slug={route.slug} navigate={navigate} />}
        {route.page === "how-it-works" && (
          <>
            <HowItWorks />
            <Footer navigate={navigate} />
          </>
        )}
        {route.page === "admin-login" && <AdminLogin navigate={navigate} />}
        {route.page === "admin-panel" && <AdminPanel navigate={navigate} />}

        {!isAdmin && <WhatsAppFloat />}
      </StoreProvider>
    </AuthProvider>
  );
}
