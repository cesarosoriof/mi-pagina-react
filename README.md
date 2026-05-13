# German Parra – Detalles & Sorpresas
## Migración a React + TypeScript

Este proyecto es la versión migrada del sitio web original (HTML/CSS/JS) a **React 18 + TypeScript + Vite**.

---

## 🚀 Cómo ejecutar

### Requisitos
- Node.js 18 o superior
- npm 9 o superior

### Instalación y desarrollo
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 📁 Estructura del proyecto

```
GermanParra-React/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx              # Punto de entrada
    ├── App.tsx               # Router principal (sin librerías externas)
    ├── styles/
    │   └── main.css          # Todos los estilos globales
    ├── data/
    │   └── products.ts       # Datos de productos tipados + utilidades
    ├── context/
    │   ├── StoreContext.tsx   # Estado global de productos (reemplaza localStorage)
    │   └── AuthContext.tsx    # Autenticación segura (Web Crypto API)
    ├── components/
    │   ├── Navbar.tsx
    │   ├── ProductCard.tsx
    │   ├── Carousel.tsx
    │   ├── Footer.tsx
    │   └── WhatsAppFloat.tsx
    └── pages/
        ├── HomePage.tsx
        ├── CatalogPage.tsx
        ├── ProductPage.tsx
        ├── AdminLogin.tsx
        └── AdminPanel.tsx
```

---

## 🔐 Panel de administración

Acceso en: `http://localhost:5173` → navegar al admin o ir directamente a la ruta admin.

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

> ⚠️ Cambia la contraseña inmediatamente desde el panel → Configuración.

---

## 🔄 Qué cambió vs la versión anterior

| Aspecto | Antes (HTML/JS) | Ahora (React + TypeScript) |
|---|---|---|
| **Lenguaje** | JavaScript puro | **TypeScript** – tipado estático, errores en compilación |
| **Framework** | Sin framework | **React 18** – componentes reutilizables |
| **Estado** | `localStorage` (se pierde al limpiar) | **React Context** – en memoria, seguro |
| **Autenticación hash** | SHA-256 implementado manualmente en JS | **Web Crypto API** nativa del navegador (más segura) |
| **Routing** | Múltiples archivos `.html` | SPA con estado React, sin recarga |
| **Datos** | `data.js` global | `products.ts` tipado con interfaces TypeScript |
| **Componentes** | Funciones JS sueltas | Componentes React con props tipadas |
| **Build** | Sin proceso de build | **Vite** – bundling, minificación, tree-shaking |
| **Escalabilidad** | Difícil de extender | Fácil de agregar páginas y features |

---

## 🖼️ Imágenes

Las imágenes del RAR original deben copiarse a la carpeta `public/`:

```
public/
└── img/
    ├── logo.png
    ├── evoka-logo.png.png
    ├── detalles_sorpresa/
    ├── fresas-con-chocolate/
    └── ...
```

Vite sirve automáticamente todo lo que esté en `public/` como archivos estáticos.

---

## 🌐 Despliegue

### Netlify / Vercel (recomendado)
```bash
npm run build
# Subir la carpeta dist/
```

### Configuración para SPA (Netlify)
Crear `public/_redirects`:
```
/*  /index.html  200
```

---

## 📦 Dependencias

Solo React y sus tipos. Sin librerías de UI externas, sin lodash, sin jQuery.

```json
"dependencies": {
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```
