import type { ReactNode } from "react";
import { PublicFooter, PublicHeader } from "@/components/public/PublicNavigation";

export function PublicPageLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground"><PublicHeader /><main className="pt-[72px]">{children}</main><PublicFooter /></div>;
}
