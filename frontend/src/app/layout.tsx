import { Montserrat, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { DeveloperGuideWidget } from "@/components/shared/developer-guide-widget";

import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/es.json";

/*
  TIPOGRAFÍAS
  ------------------------------------------------------------

  Montserrat:
  Se utiliza como tipografía principal para textos, formularios,
  tablas, botones, menús y navegación.

  Nunito:
  Se utiliza para títulos, subtítulos y encabezados institucionales.

  Las variables creadas aquí se conectan con las variables
  configuradas en globals.css:

  --font-heading: var(--font-nunito);
  --font-sans: var(--font-montserrat);
*/

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata = {
  title: "GRisk KIT UX / UI",
  description: "Base frontend y sistema de diseño de GRisk.",
  icons: [
    {
      url: "/Favicon.svg",
      href: "/Favicon.svg",
    }
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps) {
  /*
    Tema por defecto para renderizado estático.
    El script en el <head> se encarga de aplicar el tema correcto 
    desde localStorage o las preferencias del sistema.
  */
  const theme = "light";

  return (
    <html
      lang="es"
      data-theme={theme}
      className={cn(
        /*
          Se registran las dos variables tipográficas en el documento.
        */
        montserrat.variable,
        nunito.variable,

        /*
          Montserrat será la fuente predeterminada del proyecto.
        */
        "font-sans"
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem("glocation-theme");
                  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  const theme = storedTheme || systemTheme;
                  document.documentElement.setAttribute("data-theme", theme);
                  if (!document.cookie.includes("glocation-theme=")) {
                    document.cookie = "glocation-theme=" + theme + "; path=/; max-age=31536000; SameSite=Lax";
                  }
                } catch (error) {}
              })();
            `,
          }}
        />
      </head>

      <body>
        <NextIntlClientProvider
          locale="es"
          messages={messages}
        >
          <TooltipProvider>
            {children}
            <Toaster />
            <DeveloperGuideWidget />
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}