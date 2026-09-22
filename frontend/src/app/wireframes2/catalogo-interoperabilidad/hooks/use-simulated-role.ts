"use client";

import { useState, useEffect } from "react";
import { type UserRole } from "../data/catalogo-data";

export const useSimulatedRole = (initialRole: UserRole = "COORDINADOR_SINARP"): [UserRole, (role: UserRole) => void] => {
  const [role, setRole] = useState<UserRole>(initialRole);

  useEffect(() => {
    // 1. Initial read from sessionStorage on mount
    try {
      const storedRole = sessionStorage.getItem("dinarp_simulated_role") as UserRole | null;
      if (storedRole) {
        setRole(storedRole);
      } else {
        // Init sessionStorage with provided default if empty
        sessionStorage.setItem("dinarp_simulated_role", initialRole);
      }
    } catch (e) {
      // Ignore if sessionStorage is not available
    }

    // 2. Listen for changes from other components (like Header Menu)
    const handleRoleChanged = (e: CustomEvent<{ role: UserRole }>) => {
      setRole(e.detail.role);
    };

    window.addEventListener("simulatedRoleChanged", handleRoleChanged as EventListener);

    return () => {
      window.removeEventListener("simulatedRoleChanged", handleRoleChanged as EventListener);
    };
  }, [initialRole]);

  // 3. Setter that updates local state, sessionStorage, and broadcasts
  const setSimulatedRole = (newRole: UserRole) => {
    setRole(newRole);
    try {
      sessionStorage.setItem("dinarp_simulated_role", newRole);
    } catch (e) {}

    window.dispatchEvent(
      new CustomEvent("simulatedRoleChanged", { detail: { role: newRole } })
    );
  };

  return [role, setSimulatedRole];
};
