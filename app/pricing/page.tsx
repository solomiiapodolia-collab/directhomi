import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { subscriptionPlans } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Тарифи для шукачів житла
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Оберіть план, який відповідає вашим потребам
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.tier} className={cn("relative flex flex-col", plan.tier === "basic" && "border-primary shadow-lg")}>
                {plan.tier === "basic" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    Популярний
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.tier === "free" && "Для початку пошуку"}
                    {plan.tier === "basic" && "Оптимальний вибір"}
                    {plan.tier === "pro" && "Максимальні можливості"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price > 0 && <span className="text-muted-foreground"> грн/міс</span>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.tier === "basic" ? "default" : "outline"} asChild>
                    <Link href="/register?role=seeker">
                      {plan.price === 0 ? "Почати безкоштовно" : "Обрати план"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-20">
            <h2 className="text-center text-2xl font-bold">Часті питання</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold">Що таке заявка?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Заявка — це структурована форма, яку ви заповнюєте, щоб висловити зацікавленість в оголошенні.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold">Як працює ліміт заявок?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ліміт скидається щодня о 00:00. Безкоштовний план — 3 заявки, Базовий — 10, Професійний — без обмежень.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold">Чи можу я змінити план?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Так, ви можете оновити або понизити план у будь-який момент.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold">Чи потрібен платний план власникам?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ні, для власників публікація оголошень безкоштовна.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
