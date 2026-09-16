"use client";

import { useEffect } from "react";

export function WireframeThemeEffect() {
  useEffect(() => {
    // Ensures document element has wireframe / neutral theme active
    document.documentElement.setAttribute("data-theme-variant", "wireframe");
  }, []);

  return null;
}
