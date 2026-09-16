import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wireframes | DINARP",
  description: "Entorno de prototipado y wireframes con tema neutral.",
};

interface WireframesLayoutProps {
  children: React.ReactNode;
}

export default function WireframesLayout({ children }: WireframesLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {children}
    </div>
  );
}

