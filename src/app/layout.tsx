import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

/*
 * ============================================================================
 *  NOTA DE FUNCIONAMIENTO SIN CONEXIÓN (offline-first)
 * ============================================================================
 *  Esta aplicación NO usa next/font/google ni ninguna fuente remota: la pila
 *  tipográfica se resuelve con fuentes instaladas en el sistema operativo
 *  (ver @theme en globals.css y CARD_FONTS en src/lib/designer/presets.ts).
 *  El favicon es un archivo local (src/app/icon.svg). Así, tras `npm install`,
 *  la aplicación funciona 100 % sin conexión a internet.
 * ============================================================================
 */

export const metadata: Metadata = {
  title: "CredenciaLab · Diseñador de tarjetas ID, badges y tarjetas de visita",
  description:
    "Crea, personaliza y exporta prototipos profesionales de tarjetas de identificación, badges y tarjetas de visita con fondos degradados, patrones de seguridad guilloché, códigos QR y sellos holográficos.",
  keywords: ["tarjetas ID", "badges", "diseñador de credenciales", "prototipos", "tarjetas de visita"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0f12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
