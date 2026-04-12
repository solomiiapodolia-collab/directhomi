import Link from "next/link";
import { 
  Search, 
  FileText, 
  Clock, 
  MessageSquare, 
  Shield, 
  Camera, 
  Home,
  CheckCircle,
  AlertTriangle,
  Users,
  BadgeCheck,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const seekerSteps = [
  {
    icon: Search,
    title: "1. Пошук житла",
    description: "Використовуйте фільтри для пошуку ідеального варіанту. Переглядайте фото, характеристики та перевіряйте чи власник верифікований.",
  },
  {
    icon: FileText,
    title: "2. Подача заявки",
    description: "Заповніть структуровану форму з інформацією про себе: контакти, дата заселення, кількість мешканців, наявність дітей/тварин.",
  },
  {
    icon: Clock,
    title: "3. Очікування відповіді",
    description: "Власник має 72 години для відповіді. Він може прийняти, відхилити або позначити вашу заявку як 'можливо'.",
  },
  {
    icon: MessageSquare,
    title: "4. Спілкування",
    description: "Після прийняття заявки відкривається чат з власником. Домовляйтесь про огляд та умови напряму.",
  },
];

const ownerSteps = [
  {
    icon: Shield,
    title: "1. Реєстрація та верифікація",
    description: "Створіть акаунт та пройдіть верифікацію: завантажте фото паспорта та селфі з документом для підтвердження особи.",
  },
  {
    icon: Camera,
    title: "2. Створення оголошення",
    description: "Додайте до 11 фото, детальний опис, характеристики та правила проживання. Перші 3 оголошення проходять модерацію.",
  },
  {
    icon: FileText,
    title: "3. Отримання заявок",
    description: "Переглядайте структуровані заявки від шукачів з усією необхідною інформацією для прийняття рішення.",
  },
  {
    icon: CheckCircle,
    title: "4. Вибір орендаря",
    description: "Приймайте або відхиляйте заявки. Після прийняття відкривається чат для обговорення деталей.",
  },
];

const rules = [
  {
    title: "72-годинне правило",
    description: "Власники мають відповісти на заявку протягом 72 годин. Ігнорування більше 30% заявок знижує видимість оголошень.",
  },
  {
    title: "Верифікація власників",
    description: "Кожен власник проходить перевірку особи перед публікацією оголошень. Це захищає шукачів від шахраїв.",
  },
  {
    title: "Модерація контенту",
    description: "Перші 3 оголошення кожного власника проходять ручну модерацію. Це гарантує якість та достовірність інформації.",
  },
  {
    title: "Система скарг",
    description: "Користувачі можуть поскаржитись на неправдиві оголошення або неприйнятну поведінку. Ми оперативно реагуємо на всі скарги.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Як працює DirectHomi
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Прозорий процес пошуку та здачі житла без посередників
            </p>
          </div>
        </section>

        {/* For Seekers */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Для шукачів житла</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {seekerSteps.map((step) => (
                <Card key={step.title}>
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <Link href="/catalog">
                  <Search className="mr-2 h-5 w-5" />
                  Почати пошук
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* For Owners */}
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Home className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Для власників</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {ownerSteps.map((step) => (
                <Card key={step.title}>
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                      <step.icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/register?role=owner">
                  <Home className="mr-2 h-5 w-5" />
                  Додати оголошення
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Platform Rules */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-4">
                <BadgeCheck className="h-4 w-4" />
                Правила платформи
              </div>
              <h2 className="text-2xl font-bold">Як ми забезпечуємо безпеку</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {rules.map((rule) => (
                <div key={rule.title} className="rounded-lg border border-border p-6">
                  <h3 className="font-semibold mb-2">{rule.title}</h3>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-border py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Важливо:</strong> DirectHomi є платформою для зв&apos;язку власників та шукачів житла. 
                Ми не є стороною угод і не несемо відповідальності за дії користувачів. 
                Рекомендуємо перевіряти всі документи та укладати офіційні договори оренди.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Готові почати?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Приєднуйтесь до DirectHomi та знайдіть ідеальне житло
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  Зареєструватись
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/catalog">
                  Переглянути оголошення
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
