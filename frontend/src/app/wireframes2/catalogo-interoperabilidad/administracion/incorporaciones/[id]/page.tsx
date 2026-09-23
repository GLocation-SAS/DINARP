import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INITIAL_EXPEDIENTES } from "../../../data/catalogo-data";
import { ExpedienteClientView } from "./expediente-client-view";

export function generateStaticParams() {
  return INITIAL_EXPEDIENTES.map(exp => ({
    id: exp.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpedienteIntegracionPage({ params }: PageProps) {
  const { id } = await params;
  const initialExpediente = INITIAL_EXPEDIENTES.find(e => e.id === id);

  if (!initialExpediente) {
    notFound();
  }

  return <ExpedienteClientView initialExpediente={initialExpediente} />;
}

