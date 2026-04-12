"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, Menu, X, User, LogOut, Settings, MessageSquare, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const publicNavItems = [
  { href: "/catalog", label: "Каталог" },
  { href: "/how-it-works", label: "Як це працює" },
  { href: "/pricing", label: "Тарифи" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "seeker": return "/dashboard/seeker";
      case "owner": return "/dashboard/owner";
      case "admin": return "/admin";
      default: return "/login";
    }
  };

  const getRoleLabel = () => {
    if (!user) return "";
    switch (user.role) {
      case "seeker": return "Шукач";
      case "owner": return "Власник";
      case "admin": return "Адміністратор";
      default: return "";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">DirectHomi</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {publicNavItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={cn("text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground")}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth/User Section */}
        <div className="hidden items-center gap-3 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                Демо: {user ? getRoleLabel() : "Гість"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchRole("guest")}>Гість</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole("seeker")}>Шукач (Анна Бондар)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole("owner")}>Власник (Іван Петренко)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole("admin")}>Адміністратор</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.firstName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />Кабінет
                  </Link>
                </DropdownMenuItem>
                {user.role !== "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/messages" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />Повідомлення
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />Налаштування
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />Панель адміна
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />Вийти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Увійти</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Реєстрація</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Закрити меню" : "Відкрити меню"}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col p-4">
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={cn("rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}
                onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {user ? (
              <>
                <Link href={getDashboardLink()}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}>
                  Кабінет
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-secondary">
                  Вийти
                </button>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}>
                  Увійти
                </Link>
                <Link href="/register"
                  className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}>
                  Реєстрація
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
