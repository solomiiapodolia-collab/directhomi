"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Heart, 
  Settings, 
  User,
  Plus,
  BarChart3,
  Shield,
  Users,
  AlertTriangle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const seekerNavItems: NavItem[] = [
  { href: "/dashboard/seeker", label: "Огляд", icon: BarChart3 },
  { href: "/dashboard/seeker/applications", label: "Мої заявки", icon: FileText },
  { href: "/dashboard/seeker/saved", label: "Збережені", icon: Heart },
  { href: "/messages", label: "Повідомлення", icon: MessageSquare },
  { href: "/settings", label: "Налаштування", icon: Settings },
];

const ownerNavItems: NavItem[] = [
  { href: "/dashboard/owner", label: "Огляд", icon: BarChart3 },
  { href: "/dashboard/owner/listings", label: "Мої оголошення", icon: Home },
  { href: "/dashboard/owner/applications", label: "Заявки", icon: FileText },
  { href: "/messages", label: "Повідомлення", icon: MessageSquare },
  { href: "/dashboard/owner/verification", label: "Верифікація", icon: Shield },
  { href: "/settings", label: "Налаштування", icon: Settings },
];

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Огляд", icon: BarChart3 },
  { href: "/admin/moderation", label: "Модерація", icon: Shield },
  { href: "/admin/users", label: "Користувачі", icon: Users },
  { href: "/admin/complaints", label: "Скарги", icon: AlertTriangle },
  { href: "/admin/listings", label: "Оголошення", icon: Home },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === "admin" 
    ? adminNavItems 
    : user?.role === "owner" 
      ? ownerNavItems 
      : seekerNavItems;

  const dashboardTitle = user?.role === "admin"
    ? "Панель адміністратора"
    : user?.role === "owner"
      ? "Кабінет власника"
      : "Кабінет шукача";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Закрити меню" : "Відкрити меню"}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">DirectHomi</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user?.role === "owner" && (
              <Button size="sm" asChild>
                <Link href="/dashboard/owner/listings/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Нове оголошення
                </Link>
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground">{dashboardTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 mt-16 w-64 transform border-r border-border bg-background transition-transform lg:static lg:mt-0 lg:transform-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard/seeker" && 
                 item.href !== "/dashboard/owner" && 
                 item.href !== "/admin" && 
                 pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
