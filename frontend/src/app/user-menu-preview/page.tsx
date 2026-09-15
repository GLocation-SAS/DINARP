"use client";

import { UserMenu } from "@/components/shared/user-menu";
import { useEffect } from "react";

export default function UserMenuPreviewPage() {
  useEffect(() => {
    if (window.parent && window.parent !== window) {
      const syncTheme = () => {
        try {
          const theme = window.parent.document.documentElement.getAttribute("data-theme");
          if (theme) document.documentElement.setAttribute("data-theme", theme);
        } catch (e) {}
      };
      
      syncTheme();
      
      try {
        const observer = new MutationObserver(syncTheme);
        observer.observe(window.parent.document.documentElement, {
          attributes: true,
          attributeFilter: ["data-theme"]
        });
        return () => observer.disconnect();
      } catch (e) {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-start justify-end p-8">
      <UserMenu />
    </div>
  );
}
