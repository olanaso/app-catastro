# App Catastro

Aplicación híbrida moderna basada en **React**, **Framework7** y **Capacitor** para el registro de fichas catastrales con soporte de trabajo offline y sincronización manual.

## Características principales

- Inicio de sesión simple con modo offline de contingencia.
- Visualización de fichas en un mapa interactivo de **Mapbox GL JS**.
- Registro de fichas con captura de fotografía utilizando el plugin de cámara de Capacitor.
- Obtención automática de coordenadas mediante el plugin de geolocalización.
- Almacenamiento local persistente con SQLite (fallback a almacenamiento web durante el desarrollo).
- Sincronización manual de fichas pendientes con un backend REST configurable desde `src/config/config.js`.

## Requisitos

- Node.js 18+
- Cuenta y token de Mapbox para definir la variable `VITE_MAPBOX_TOKEN`.

## Scripts disponibles

```bash
npm install
npm run dev    # Levanta el entorno de desarrollo con Vite
npm run build  # Genera la build de producción
npm run preview
```

> Nota: En entornos web la integración con SQLite y los plugins nativos requieren ejecutarse dentro de un contenedor de Capacitor o un dispositivo real. Durante el desarrollo en navegador se utilizan *fallbacks* a APIs web.

## Estructura principal

- `src/App.jsx`: Configuración base de Framework7 y navegación.
- `src/pages/`: Páginas principales (login, mapa, formulario, pendientes y sincronización).
- `src/services/`: Abstracciones de API REST, base de datos, geolocalización y cámara.
- `src/config/config.js`: Definición de URLs del backend y constantes globales.

## Capacitor

Para compilar de forma nativa:

```bash
npm install @capacitor/cli --save-dev
npx cap init
npx cap add android
npx cap add ios
npx cap sync
```

Luego abra el proyecto nativo correspondiente (`android/` o `ios/`) y ejecute en un dispositivo o emulador.
