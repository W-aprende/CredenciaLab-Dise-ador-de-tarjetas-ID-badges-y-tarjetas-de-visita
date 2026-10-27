# CredenciaLab · Diseñador de tarjetas ID, badges y tarjetas de visita

Aplicación web interactiva (SPA) para **crear, personalizar y exportar prototipos profesionales** de credenciales: carnés 3×2 (H/V), formato DNI (ISO ID-1) y tarjetas de visita (H/V). Todo se maqueta en un lienzo en vivo con arrastre libre, se edita con un panel de control de tres pestañas y se exporta en **alta resolución (~600 DPI)** a PNG, JPEG o PDF con medidas físicas exactas.

> 🔴 Todos los diseños incluyen por defecto el sello **«PROTOTIPO · EJEMPLO NO VÁLIDO»**: la app es una herramienta de maquetación y los documentos generados no acreditan identidad ni autorización alguna.

---

## 📖 Índice

1. [Características](#-características)
2. [Requisitos del ordenador](#-requisitos-del-ordenador)
3. [Instalación y arranque](#-instalación-y-arranque-paso-a-paso)
4. [Uso diario (arranque rápido)](#-uso-diario-arranque-rápido)
5. [Montar el servidor: modo desarrollo vs. producción](#-montar-el-servidor-modo-desarrollo-vs-producción)
6. [Configuraciones útiles](#-configuraciones-útiles)
7. [Funcionamiento sin internet (offline)](#-funcionamiento-sin-internet-offline)
8. [Guía de uso del editor](#-guía-de-uso-del-editor)
9. [Arquitectura técnica](#-arquitectura-técnica)
10. [Solución de problemas](#-solución-de-problemas)
11. [Licencia y aviso](#-licencia-y-aviso)

---

## ✨ Características

- **9 plantillas completas** (anverso + reverso) listas para editar: Clásico institucional, Ejecutivo grafito, Salud esmeralda, Acreditación de evento, Tecno violeta, Obra y mantenimiento, Visita minimal clara, Visita elegante serif y **Ministerio de Hacienda (Guinea Ecuatorial)** — carné vertical con cuña diagonal verde, escudo institucional, foto enmarcada, QR, holograma y arte financiero lineal.
- **18 paletas institucionales** de un clic (12 oscuras + 2 claras + 4 temáticas).
- **12 patrones de seguridad** procedurales: guilloché, ondas, circuito, retícula, puntos, rombos, panal hexagonal, espiga, anillos concéntricos, moiré, microimpresión y constelación.
- **13 decoraciones** de fondo: líneas, bandas, marcos, doble marco de seguridad, arcos y cuñas diagonales ministeriales.
- **12 tipografías del sistema** con fuente, tamaño, grosor, espaciado, altura de línea, alineación, mayúsculas y color **independientes por elemento de texto** (incluido el sello PROTOTIPO).
- **4 estilos de trazo** (sólido, rayas, puntos, doble) en líneas, anillos, rectángulos y sellos, con color y grosor propios.
- Elementos: texto, foto (recorte circular/redondeo), logo/marca de agua, **QR dinámico**, código de barras, holograma iridiscente y formas geométricas.
- **Arrastre libre** con imán a guías (centros y bordes), redimensionado por asas (Shift = proporción en imágenes), edición de texto en línea con doble clic y barra flotante de alineación/capas.
- **Exportación PNG/JPEG** a ~600 DPI y **PDF con medidas físicas exactas** del formato elegido (ej. 85,6 × 54 mm ISO ID-1).
- Tema claro/oscuro, historial de deshacer/rehacer (60 pasos) y diseño responsive (panel inferior en móvil).

---

## 💻 Requisitos del ordenador

| Requisito | Mínimo |
|---|---|
| Sistema operativo | Windows 10/11, macOS 12+, o Linux (Debian/Ubuntu/Fedora…) |
| **Node.js** | **v18 o superior (se recomienda la LTS)** → https://nodejs.org |
| RAM | 4 GB (8 GB recomendado) |
| Disco | ~1 GB libre (dependencias + caché de compilación) |
| Navegador | Chrome, Edge o Firefox actualizados |
| Internet | **Solo la primera vez** (para `npm install`) |

> No necesitas bun, Docker, bases de datos ni ningún servicio en la nube. El servidor corre **en tu propio ordenador**.

### Instalar Node.js (si no lo tienes)

1. Entra en **https://nodejs.org** y descarga la versión **LTS**.
2. Instálala con las opciones por defecto (en Windows, marca «Automatically install the necessary tools» si aparece, no es obligatorio).
3. Abre una terminal nueva y verifica:
   ```bash
   node --version    # debería mostrar v18.x, v20.x o v22.x
   npm --version
   ```

---

## 🚀 Instalación y arranque (paso a paso)

### Opción A · Automática (recomendada)

1. Descomprime el archivo ZIP del proyecto en una carpeta sin tildes ni espacios si es posible (ej. `C:\CredenciaLab`).
2. **Windows**: doble clic en **`iniciar-windows.bat`**
   **Linux / macOS**: abre una terminal en la carpeta y ejecuta `bash iniciar-linux-mac.sh`
3. El script comprueba Node.js, instala las dependencias (solo la primera vez) y arranca el servidor. Tras unos segundos se abrirá tu navegador en `http://localhost:3000`.

### Opción B · Manual (terminal)

```bash
# 1. Entra en la carpeta del proyecto
cd ruta/a/credencialab

# 2. Instala las dependencias (SOLO la primera vez; requiere internet)
npm install

# 3. Arranca la aplicación
npm run dev
```

Abre **http://localhost:3000** en tu navegador. La primera compilación tarda entre 10 y 40 segundos; las siguientes son casi instantáneas.

> 💡 ¿Prefieres **bun**? También funciona: `bun install` y `bun run dev`.

---

## 🖥️ Uso diario (arranque rápido)

Una vez instalado (`node_modules` ya existe), cada día solo necesitas:

- **Windows**: doble clic en `iniciar-windows.bat` → ya no reinstala nada, arranca directo.
- **Linux / macOS**: `bash iniciar-linux-mac.sh` (o `npm run dev`).
- Para **detener** el servidor: cierra la ventana o pulsa **Ctrl + C** en la terminal.
- Para **cambiar el puerto**: ver [Configuraciones útiles](#-configuraciones-útiles).

---

## 🌐 Montar el servidor: modo desarrollo vs. producción

### Modo desarrollo (`npm run dev`) — recomendado para diseñar

- Sirve la app en `http://localhost:3000` con *hot reload*: cualquier cambio en el código se refleja al instante.
- Compila bajo demanda, por lo que la primera visita tarda un poco más.
- No es necesario compilar nada antes.

### Modo producción (más rápido y estable, ideal si lo usarás muchas horas o en una red local)

```bash
npm run build     # compila una sola vez (~1 minuto)
npm start         # sirve la versión compilada en http://localhost:3000
```

- Arranca mucho más rápido que el modo dev y consume menos recursos.
- Si cambias algo del código, vuelve a ejecutar `npm run build` antes de `npm start`.

### Acceder desde otros dispositivos de tu red (móvil, otra sala)

1. Averigua la IP local de tu ordenador:
   - Windows: `ipconfig` → mira «Dirección IPv4» (ej. `192.168.1.40`).
   - Linux/macOS: `ifconfig` o `ip a` (ej. `192.168.1.40`).
2. Arranca el servidor aceptando conexiones externas:
   ```bash
   npx next dev -H 0.0.0.0 -p 3000        # desarrollo
   npx next start -H 0.0.0.0 -p 3000      # producción (tras build)
   ```
3. En el otro dispositivo (misma red Wi-Fi) abre `http://192.168.1.40:3000`.
4. Si no conecta, permite el puerto 3000 en el firewall:
   - Windows: `netsh advfirewall firewall add rule name="CredenciaLab" dir=in action=allow protocol=TCP localport=3000` (ejecutar como administrador).
   - Linux: `sudo ufw allow 3000`.

### Servir detrás de un proxy inverso (opcional, avanzado)

La app es una SPA estática servida por Next.js; detrás de **nginx** o **Caddy** basta con redirigir el dominio a `http://127.0.0.1:3000`. Ejemplo mínimo de Caddy:

````caddyfile
credenciales.midominio.local {
    reverse_proxy 127.0.0.1:3000
}
````

---

## ⚙️ Configuraciones útiles

| Qué | Cómo |
|---|---|
| Cambiar puerto permanente | Edita `package.json` → en `scripts` cambia `-p 3000` por `-p 8080` (dos sitios: `dev` y `start`) |
| Cambiar puerto solo una vez | Windows: `set PORT=3001 && npm run dev` · Linux/macOS: `PORT=3001 npm run dev` |
| Tema por defecto claro/oscuro | Se elige con el botón 🌙 de la barra superior (se recuerda en el navegador) |
| Copia de seguridad de diseños | Los diseños viven en el navegador (localStorage del lienzo); usa Exportar PNG/PDF para archivarlos |
| Restaurar proyecto | Borra la carpeta `.next` y vuelve a `npm run dev` (regenera la caché) |
| Reinstalar dependencias | Borra `node_modules` y ejecuta `npm install` |

**Variables de entorno**: la aplicación **no requiere ninguna**. No hay claves de API ni servicios externos.

**Base de datos**: no se usa ninguna; el editor funciona 100 % en el navegador.

---

## 📴 Funcionamiento sin internet (offline)

El proyecto está diseñado **offline-first**:

- ❌ **No** usa Google Fonts ni ninguna tipografía remota — las fuentes son del sistema operativo (Arial, Verdana, Georgia, Courier…) y se ven igual en pantalla y en la exportación.
- ❌ **No** carga iconos, librerías ni recursos desde CDN — todo va empaquetado por el compilador.
- ❌ **No** llama a ninguna API externa — los códigos QR y de barras se generan localmente.
- ✅ El favicon es un archivo local (`src/app/icon.svg`).

**Único momento con internet**: la primera instalación de dependencias (`npm install`), que descarga las librerías desde npmjs.com. A partir de ahí, puedes desconectarte: la app, el servidor y todas las exportaciones funcionan sin conexión.

> Si vas a instalar en un ordenador sin internet: instala primero en uno conectado, copia la carpeta `node_modules` completa junto al proyecto, y funcionará directamente.

---

## 🎨 Guía de uso del editor

### Las tres pestañas del panel izquierdo

1. **Diseño** — plantillas completas (anverso + reverso), formato físico, paletas institucionales, fondo (color sólido o degradado con 2–3 paradas), patrón de seguridad con color/opacidad, líneas y bandas decorativas, y brillos suaves.
2. **Elementos** — inserta texto (con presets: nombre, cargo, ID…), foto, logo, QR, holograma, formas, sello y código de barras. Las imágenes se cargan desde tu disco (FileReader, sin subirlas a ningún servidor).
3. **Propiedades** — edita el elemento seleccionado: contenido, **tipografía completa (fuente, tamaño, grosor, espaciado, interlineado, alineación, color)**, propiedades específicas (QR, trazo de formas, redondeos), posición/tamaño en %, rotación, opacidad, capas, bloqueo y borrado.

### Atajos y trucos

| Acción | Cómo |
|---|---|
| Deshacer / Rehacer | `Ctrl + Z` / `Ctrl + Y` |
| Editar texto en el lienzo | Doble clic sobre el texto |
| Duplicar / eliminar | Barra flotante sobre el elemento seleccionado |
| Mantener proporción al redimensionar fotos | Mantén `Shift` mientras arrastras el asa |
| Imán a guías | Arrastra: se activa sola cerca de centros y bordes |
| Cambiar de cara | Botones **Anverso / Reverso** de la barra superior |
| Exportar | Menú **Exportar** → PNG / JPEG / PDF (usa la cara activa) |

---

## 🧱 Arquitectura técnica

- **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4** con componentes shadcn/ui.
- Estado global con **Zustand** + historial de snapshots (deshacer/rehacer de 60 pasos).
- Posiciones y tamaños almacenados en **porcentajes**: el diseño es independiente de la resolución y se exporta idéntico en alta definición.
- **html2canvas-pro** para rasterizar (scale ×5 ≈ 600 DPI) y **jsPDF** para el PDF con MediaBox de medidas físicas exactas.
- Patrones y recursos gráficos como **SVG → data-URI** (guilloché, cuñas, escudo, arte financiero): fiables en pantalla y en exportación, sin peticiones de red.
- Sin base de datos ni backend con estado: todo el cómputo ocurre en el navegador.

```
src/
├─ app/                  # Entrada Next.js (layout, página, icono)
├─ components/
│  ├─ designer/          # UI del editor (lienzo, panel, elementos, patrones)
│  │  └─ tabs/           # Pestañas Diseño / Elementos / Propiedades
│  └─ ui/                # Componentes shadcn/ui
└─ lib/
   └─ designer/          # Modelo de datos y lógica pura
      ├─ types.ts        # Tipos (elementos, fondos, patrones, trazos…)
      ├─ presets.ts      # Formatos físicos, 18 paletas, 12 fuentes
      ├─ templates.ts    # 9 plantillas completas (anverso + reverso)
      ├─ defaults.ts     # Fábricas de elementos y diseño inicial
      ├─ assets.ts       # Escudo, arte financiero, avatar, logo (SVG data-URI)
      ├─ store.ts        # Estado Zustand + historial
      └─ export.ts       # Exportación PNG/JPEG/PDF
```

---

## 🛠️ Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| `node` no se reconoce | Node.js no instalado o terminal vieja | Instala la LTS y **reinicia** la terminal/ordenador |
| `EADDRINUSE: port 3000` | Otro programa usa el 3000 | Cierra ese programa o usa otro puerto (`set PORT=3001 && npm run dev`) |
| La página tarda en abrir | Primera compilación del modo dev | Normal (10–40 s); las siguientes cargas son rápidas |
| Página en blanco tras cambiar código | Caché corrupta | Detén con Ctrl+C, borra `.next`, vuelve a `npm run dev` |
| `npm install` falla | Sin internet o proxy corporativo | Revisa conexión; en redes corporativas configura el proxy de npm |
| La fuente X no se ve igual | Esa fuente no está instalada en tu SO | Se usa automáticamente una fuente similar de la pila de respaldo |
| El PDF sale con otro tamaño | — | El PDF usa el formato físico del proyecto (lo ves en Exportar); verifica haber elegido el formato correcto en Diseño |
| No abre desde el móvil | Servidor escuchando solo en localhost | Arranca con `npx next dev -H 0.0.0.0` y usa la IP local (ver sección servidor) |

---

## 📄 Licencia y aviso

Proyecto de demostración proporcionado «tal cual», sin garantía. Está pensado para **maquetar prototipos de credenciales**: todos los diseños llevan el sello «PROTOTIPO · EJEMPLO NO VÁLIDO» y no deben usarse para suplantar documentos oficiales. Respeta las leyes de tu país sobre documentos de identidad y la propiedad intelectual de logos e imágenes que subas.
