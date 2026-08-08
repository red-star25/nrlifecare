"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";

/**
 * Site chrome stays off the Sanity Studio so dad/employees get a full-screen
 * editor at /studio without the marketing header sitting on top of it.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");
  const isPreview = pathname.startsWith("/preview");

  if (isStudio || isPreview) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
