import Link from "next/link";
import { Home } from "lucide-react";

const footerLinks = {
  platform: [
    { href: "/catalog", label: "Каталог оголошень" },
    { href: "/how-it-works", label: "Як це працює" },
    { href: "/pricing", label: "Тарифи" },
    { href: "/faq", label: "Часті питання" },
  ],
  legal: [
    { href: "/terms", label: "Умови використання" },
    { href: "/privacy", label: "Політика конфіденційності" },
    { href: "/rules", label: "Правила платформи" },
  ],
support: [
    { href: "/report", label: "Повідомити про проблему" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">DirectHomi</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Платформа для пошуку житла напряму від власників. Без посередників, без зайвих комісій.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Платформа</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Правова інформація</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Підтримка</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DirectHomi. Всі права захищені.
            </p>
            <p className="text-xs text-muted-foreground">
              DirectHomi не є стороною угод між власниками та шукачами житла.
              Всі операції здійснюються напряму між користувачами.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
