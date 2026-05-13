import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Route } from "../App";

interface AdminLoginProps {
  navigate: (r: Route) => void;
}

export default function AdminLogin({ navigate }: AdminLoginProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!username || !password) {
      setError("Completa todos los campos.");
      return;
    }
    const result = login(username, password);
    if (result.ok) {
      navigate({ page: "admin-panel" });
    } else {
      setError(result.error ?? "Error desconocido");
      setPassword("");
    }
  };

  return (
    <div className="admin-login-bg">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <div className="login-logo">
            German<em>Parra</em>
          </div>
          <p className="login-subtitle">Panel de administración</p>
        </div>

        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button
          className="btn-login"
          onClick={handleLogin}
        >
          Ingresar al panel
        </button>

        {error && <div className="error-msg visible">{error}</div>}

        <div className="login-footer">
          <button onClick={() => navigate({ page: "home" })}>← Volver al sitio</button>
        </div>
      </div>
    </div>
  );
}
