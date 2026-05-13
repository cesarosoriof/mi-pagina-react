import { createContext, useContext, useState, ReactNode } from "react";

// ── Credenciales simples — cámbialas aquí cuando quieras ──
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  changePassword: (newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState(ADMIN_PASSWORD);

  const login = (username: string, pass: string): { ok: boolean; error?: string } => {
    if (username === ADMIN_USERNAME && pass === password) {
      setAuthenticated(true);
      return { ok: true };
    }
    return { ok: false, error: "Usuario o contraseña incorrectos." };
  };

  const logout = () => setAuthenticated(false);

  const changePassword = (newPassword: string): boolean => {
    if (!newPassword || newPassword.length < 4) return false;
    setPassword(newPassword);
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: authenticated, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
