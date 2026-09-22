"use client";

import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface WireframeBreadcrumbsProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

export function WireframeBreadcrumbs({ segments, className }: WireframeBreadcrumbsProps) {
  const filteredSegments = (segments || []).filter(
    s => s && s.label && s.label.trim().toLowerCase() !== "inicio" && s.label.trim().toLowerCase() !== "home"
  );

  if (filteredSegments.length === 0) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {filteredSegments.map((segment, index) => {
          const isLast = index === filteredSegments.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast || !segment.href ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={segment.href}>{segment.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

