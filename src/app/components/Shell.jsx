"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/app/components/Footer";

export function Shell({ children }) {
  const pathname = usePathname();

  // Esconde o Footer se a rota começar com /admin
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
}