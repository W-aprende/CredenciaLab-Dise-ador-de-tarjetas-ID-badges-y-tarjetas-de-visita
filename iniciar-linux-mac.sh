#!/usr/bin/env bash
# ============================================================================
#  CredenciaLab — Inicio rápido para Linux y macOS
#  Uso:   bash iniciar-linux-mac.sh     (o ./iniciar-linux-mac.sh)
# ============================================================================
set -e
cd "$(dirname "$0")"

echo "============================================================"
echo "  CredenciaLab · Diseñador de credenciales y badges"
echo "  Inicio rápido para Linux / macOS"
echo "============================================================"
echo

# ---- 1. Comprobar Node.js --------------------------------------------------
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js NO está instalado."
    echo "  · Debian/Ubuntu:  sudo apt install nodejs npm"
    echo "  · macOS (Homebrew): brew install node"
    echo "  · O descarga la LTS desde:  https://nodejs.org"
    exit 1
fi
echo "[OK] Node.js $(node --version) detectado"
echo

# ---- 2. Instalar dependencias (solo la primera vez) ------------------------
if [ ! -x "node_modules/.bin/next" ]; then
    echo "[..] Primera ejecución: instalando dependencias (requiere internet SOLO esta vez)…"
    npm install
else
    echo "[OK] Dependencias ya instaladas."
fi
echo

# ---- 3. Arrancar el servidor ------------------------------------------------
echo "[..] Arrancando el servidor local en http://localhost:3000"
echo "     (deja esta terminal abierta; para salir pulsa Ctrl+C)"
echo
( sleep 8; xdg-open http://localhost:3000 2>/dev/null || open http://localhost:3000 2>/dev/null || true ) &
npm run dev
