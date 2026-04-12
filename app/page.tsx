import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Shield, 
  MessageSquare, 
  Clock, 
  BadgeCheck, 
  ArrowRight,
  Home,
  Users,
  FileCheck,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { mockListings, cities } from "@/lib/mock-data";

const features = [
  {
    icon: Shield,
    title: "Перевірені власники",
    description: "Кожен власник проходить верифікацію: фото паспорта та селфі з документом.",
  },
  {
    icon: MessageSquare,
    title: "Прямий зв'язок",
    description: "Спілкуйтесь напряму з власником без посередників після прийняття заявки.",
  },
  {
    icon: Clock,
    title: "Швидка відповідь",
    description: "Власники зобов'язані відповісти на заявку протягом 72 годин.",
  },
  {
    icon: FileCheck,
    title: "Структуровані заявки",
    description: "Зручна форма заявки з усією необхідною інформацією для власника.",
  },
];

const stats = [
  { value: "5000+", label: "Активних оголошень" },
  { value: "12000+", label: "Зареєстрованих користувачів" },
  { value: "98%", label: "Задоволених орендарів" },
  { value: "72 год", label: "Максимум на відповідь" },
];

const howItWorks = {
  seeker: [
    { step: 1, title: "Знайдіть житло", description: "Перегляньте каталог та знайдіть ідеальний варіант" },
    { step: 2, title: "Подайте заявку", description: "Заповніть структуровану форму із вашими даними" },
    { step: 3, title: "Отримайте відповідь", description: "Власник відповість протягом 72 годин" },
    { step: 4, title: "Спілкуйтесь напряму", description: "Після прийняття заявки відкривається чат" },
  ],
  owner: [
    { step: 1, title: "Пройдіть верифікацію", description: "Підтвердіть особу фото документів" },
    { step: 2, title: "Додайте оголошення", description: "Створіть привабливий опис з фото" },
    { step: 3, title: "Отримуйте заявки", description: "Переглядайте структуровані заявки від шукачів" },
    { step: 4, title: "Оберіть орендаря", description: "Прийміть заявку та почніть спілкування" },
  ],
};

export default function LandingPage() {
  const featuredListings = mockListings.filter((l) => l.status === "active").slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
                  <BadgeCheck className="h-4 w-4" />
                  <span>Тільки верифіковані власники</span>
                </div>
                
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Знайдіть житло{" "}
                  <span className="text-primary">напряму від власника</span>
                </h1>
                
                <p className="max-w-xl text-pretty text-lg text-muted-foreground">
                  DirectHomi — платформа для пошуку оренди та купівлі нерухомості без посередників. 
                  Перевірені власники, прозорі умови, швидкі відповіді.
                </p>
                
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="text-base font-semibold" asChild>
                    <Link href="/catalog">
                      <Search className="mr-2 h-5 w-5" />
                      Знайти житло
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base font-semibold" asChild>
                    <Link href="/register?role=owner">
                      <Home className="mr-2 h-5 w-5" />
                      Здати нерухомість
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-4">
                  <span className="text-sm text-muted-foreground">Популярні міста:</span>
                  {cities.slice(0, 5).map((city) => (
                    <Link
                      key={city}
                      href={`/catalog?city=${city}`}
                      className="rounded-full border border-border px-3 py-1 text-sm transition-colors hover:border-primary hover:text-primary"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
                    alt="Сучасна квартира"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-xl bg-card p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">+45%</p>
                      <p className="text-sm text-muted-foreground">нових оголошень</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Нові оголошення</h2>
                <p className="mt-2 text-muted-foreground">
                  Перегляньте найновіші пропозиції від верифікованих власників
                </p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/catalog">
                  Всі оголошення
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredListings.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/catalog">
                  Всі оголошення
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Чому обирають DirectHomi
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ми створили платформу, яка захищає інтереси обох сторін
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 bg-background">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Як це працює</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Простий та прозорий процес для шукачів та власників
              </p>
            </div>
            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">Для шукачів житла</h3>
                </div>
                <div className="space-y-4">
                  {howItWorks.seeker.map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary text-sm font-medium text-primary">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild>
                  <Link href="/register?role=seeker">
                    Почати пошук
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Home className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">Для власників</h3>
                </div>
                <div className="space-y-4">
                  {howItWorks.owner.map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-accent text-sm font-medium text-accent-foreground">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" asChild>
                  <Link href="/register?role=owner">
                    Додати оголошення
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Готові знайти ідеальне житло?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Приєднуйтесь до тисяч користувачів, які вже знайшли житло через DirectHomi
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/catalog">
                  <Search className="mr-2 h-5 w-5" />
                  Переглянути каталог
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link href="/register">
                  Зареєструватись
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Platform Disclaimer */}
        <section className="border-t border-border bg-muted/30 py-8">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground">
              <strong>Важливо:</strong> DirectHomi є платформою для зв&apos;язку власників нерухомості та шукачів житла. 
              Ми не є стороною угод і не несемо відповідальності за дії користувачів. 
              Всі операції здійснюються напряму між сторонами.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
