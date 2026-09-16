import type { Metadata } from "next";
import { WireframeThemeEffect } from "./wireframe-theme-effect";

export const metadata: Metadata = {
  title: "Wireframes | DINARP",
  description: "Entorno de prototipado y wireframes con tema neutral.",
};

interface WireframesLayoutProps {
  children: React.ReactNode;
}

export default function WireframesLayout({ children }: WireframesLayoutProps) {
  return (
    <div
      data-theme="wireframe"
      className="min-h-screen bg-background text-foreground font-sans antialiased"
    >
      <WireframeThemeEffect />
      {children}
    </div>
  );
}
