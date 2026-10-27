@echo off
chcp 65001 >nul 2>nul
title CredenciaLab - Inicio rapido
color 1F

echo ============================================================
echo    CredenciaLab  ·  Disenador de credenciales y badges
echo    Inicio rapido para Windows
echo ============================================================
echo.

REM ---- 1. Comprobar Node.js -------------------------------------------
where node >nul 2>nul
if errorlevel 1 (
    color 4F
    echo [ERROR] Node.js NO esta instalado en este ordenador.
    echo.
    echo   1. Descarga la version LTS desde:  https://nodejs.org
    echo   2. Instalala con las opciones por defecto (siguiente, siguiente...)
    echo   3. Vuelve a ejecutar este archivo.
    echo.
    pause
    exit /b 1
)
for /f "delims=" %%v in ('node --version') do set NODEVER=%%v
echo [OK] Node.js detectado: %NODEVER%
echo.

REM ---- 2. Instalar dependencias (solo la primera vez) ------------------
if not exist "node_modules\next" (
    echo [..] Primera ejecucion: instalando dependencias ^(puede tardar
    echo      unos minutos; requiere internet SOLO esta vez^)...
    echo.
    call npm install
    if errorlevel 1 (
        color 4F
        echo [ERROR] Fallo la instalacion. Comprueba tu conexion e intentalo de nuevo.
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencias ya instaladas.
)
echo.

REM ---- 3. Arrancar el servidor ----------------------------------------
echo [..] Arrancando el servidor local en http://localhost:3000
echo      (deja esta ventana abierta; para salir pulsa Ctrl+C)
echo.
start "" /b cmd /c "timeout /t 8 /nobreak >nul && start http://localhost:3000"
call npm run dev

echo.
echo El servidor se ha detenido. Hasta pronto.
pause
