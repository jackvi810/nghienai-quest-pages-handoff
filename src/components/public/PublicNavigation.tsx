import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const PUBLIC_NAV_ITEMS = [
  { label: "Trang chủ", to: "/" },
  { label: "Cộng đồng", to: "/hub" },
  { label: "Sự kiện", to: "/events" },
  { label: "Khóa học", to: "/courses" },
  { label: "Quest", to: "/quests" },
  { label: "Về Nghiên AI", to: "/about" },
];

export function PublicNavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <nav className={cn("flex items-center gap-1", className)} aria-label="Điều hướng chính">
      {PUBLIC_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          onClick={onNavigate}
          className={({ isActive }) => cn(
            "px-3 py-2 text-sm font-medium transition-colors",
            isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function PublicMobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Mở menu"
          className="grid size-10 place-items-center rounded-full text-foreground hover:bg-muted lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(86vw,360px)] p-0">
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link to="/" aria-label="Nghiên AI - Trang chủ" onClick={() => setOpen(false)}><Logo size="sm" /></Link>
          <button type="button" onClick={() => setOpen(false)} aria-label="Đóng menu" className="grid size-10 place-items-center rounded-full hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>
        <PublicNavLinks className="flex-col items-stretch gap-1 p-4" onNavigate={() => setOpen(false)} />
        <div className="border-t p-4">
          <Button variant="outline" asChild className="w-full">
            <Link to="/auth" onClick={() => setOpen(false)}>Đăng nhập</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function PublicHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
        <Link to="/" aria-label="Nghiên AI - Trang chủ" className="shrink-0"><Logo size="md" /></Link>
        <PublicNavLinks className="hidden lg:flex" />
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" asChild><Link to="/auth">Đăng nhập</Link></Button>
        </div>
        <PublicMobileMenu />
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border/70 px-6 py-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <Logo size="md" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Cộng đồng, truyền thông và giáo dục để AI trở thành năng lực thực hành của nhiều người hơn.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-5">
          {PUBLIC_NAV_ITEMS.map((item) => <Link key={item.to} to={item.to} className="text-muted-foreground hover:text-primary">{item.label}</Link>)}
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Nghiên AI</span>
        <span className="font-mono">AI thực hành, cùng xây cùng học.</span>
      </div>
    </footer>
  );
}
