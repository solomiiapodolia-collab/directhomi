"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, Eye, EyeOff, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerSeeker, registerOwner, isLoading } = useAuth();
  
  const defaultRole = searchParams.get("role") === "owner" ? "owner" : "seeker";
  const [role, setRole] = useState<"seeker" | "owner">(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setError("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    if (formData.password.length < 8) {
      setError("Пароль має бути не менше 8 символів");
      return;
    }

    if (!acceptedTerms) {
      setError("Потрібно прийняти умови використання");
      return;
    }

    let success = false;
    if (role === "seeker") {
      success = await registerSeeker(formData);
    } else {
      success = await registerOwner(formData);
    }

    if (success) {
      if (role === "owner") {
        router.push("/dashboard/owner/verification");
      } else {
        router.push("/catalog");
      }
    } else {
      setError("Помилка реєстрації. Спробуйте ще раз.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Home className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold">DirectHomi</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Реєстрація</CardTitle>
          <CardDescription>
            Створіть акаунт для пошуку або здачі житла
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(v) => setRole(v as "seeker" | "owner")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seeker" className="gap-2">
                <Users className="h-4 w-4" />
                Шукач житла
              </TabsTrigger>
              <TabsTrigger value="owner" className="gap-2">
                <Building className="h-4 w-4" />
                Власник
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seeker" className="mt-4">
              <p className="mb-4 text-sm text-muted-foreground">
                Створіть акаунт шукача для перегляду оголошень та подачі заявок на оренду або купівлю.
              </p>
            </TabsContent>

            <TabsContent value="owner" className="mt-4">
              <p className="mb-4 text-sm text-muted-foreground">
                Створіть акаунт власника для публікації оголошень. Після реєстрації потрібно пройти верифікацію.
              </p>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ім&apos;я *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Прізвище *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+380"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Мінімум 8 символів"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Підтвердіть пароль *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторіть пароль"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                required
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
              />
              <label htmlFor="terms" className="text-sm leading-tight text-muted-foreground">
               Я погоджуюсь з{" "}
                <Link href="/terms" className="text-primary underline">
                  Умовами використання
                </Link>{" "}
                та{" "}
                <Link href="/privacy" className="text-primary underline">
                  Політикою конфіденційності
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Реєструємо..." : "Зареєструватись"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Вже маєте акаунт?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Увійти
            </Link>
          </div>
        </CardFooter>
      </Card>

      {role === "owner" && (
        <Alert className="mt-6 max-w-md">
          <AlertDescription className="text-xs">
            <strong>Важливо:</strong> Для публікації оголошень власникам необхідно пройти верифікацію 
            (фото паспорта та селфі з документом). Перші 3 оголошення проходять модерацію.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Завантаження...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
