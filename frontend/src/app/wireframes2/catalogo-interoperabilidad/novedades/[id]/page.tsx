import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INITIAL_NOVEDADES } from "../../data/catalogo-data";
import { NovedadDetailClientView } from "./novedad-detail-client-view";

export function generateStaticParams() {
  return INITIAL_NOVEDADES.map(nov => ({
    id: nov.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpedienteNovedadPage({ params }: PageProps) {
  const { id } = await params;
  const initialNovedad = INITIAL_NOVEDADES.find(n => n.id === id);

  if (!initialNovedad) {
    notFound();
  }

  return <NovedadDetailClientView initialNovedad={initialNovedad} />;
}

