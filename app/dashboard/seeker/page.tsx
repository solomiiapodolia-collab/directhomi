"use client";

import Link from "next/link";
import { FileText, Heart, MessageSquare, Search, Clock, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/lib/auth-context";
import { mockApplications, subscriptionPlans, formatDateTime, getTimeRemaining } from "@/lib/mock-data";
import type { Seeker } from "@/lib/types";

export default function SeekerDashboardPage() {
  const { user } = useAuth();
  const seeker = user as Seeker | null;

  if (!seeker || seeker.role !== "seeker") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Будь ласка, увійдіть як шукач житла</p>
          <Button className="mt-4" asChild>
            <Link href="/login">Увійти</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const currentPlan = subscriptionPlans.find((p) => p.tier === seeker.subscription);
  const applications = mockApplications.filter((a) => a.seekerId === seeker.id);
  const recentApplications = applications.slice(0, 5);
  
  const applicationStats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const applicationsUsedToday = seeker.applicationsToday;
  const applicationsLimit = currentPlan?.applicationsPerDay || 3;
  const applicationsRemaining = Math.max(0, applicationsLimit - applicationsUsedToday);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Вітаємо, {seeker.firstName}!</h1>
          <p className="text-muted-foreground">
            Ось огляд вашої активності на DirectHomi
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{applicationStats.total}</p>
                  <p className="text-sm text-muted-foreground">Всього заявок</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{applicationStats.pending}</p>
                  <p className="text-sm text-muted-foreground">Очікують відповіді</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{applicationStats.accepted}</p>
                  <p className="text-sm text-muted-foreground">Прийнято</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                  <Heart className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{seeker.savedListings.length}</p>
                  <p className="text-sm text-muted-foreground">Збережених</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription & Applications Today */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ваш тариф</CardTitle>
              <CardDescription>
                {currentPlan?.name} план
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Заявок сьогодні</span>
                  <span className="font-medium">
                    {applicationsUsedToday} / {applicationsLimit === 999 ? "∞" : applicationsLimit}
                  </span>
                </div>
                <Progress 
                  value={applicationsLimit === 999 ? 0 : (applicationsUsedToday / applicationsLimit) * 100} 
                  className="h-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {applicationsLimit === 999 
                    ? "Необмежена кількість заявок"
                    : `Залишилось ${applicationsRemaining} заявок на сьогодні`
                  }
                </p>
              </div>
              
              {seeker.subscription !== "pro" && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/pricing">Оновити тариф</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Швидкі дії</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="justify-start" asChild>
                <Link href="/catalog">
                  <Search className="mr-2 h-4 w-4" />
                  Знайти житло
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/seeker/applications">
                  <FileText className="mr-2 h-4 w-4" />
                  Переглянути заявки
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Повідомлення
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Останні заявки</CardTitle>
              <CardDescription>
                Ваші нещодавно подані заявки
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/seeker/applications">Всі заявки</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-12 w-16 rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url(${application.listingPhoto})` }}
                      />
                      <div>
                        <Link 
                          href={`/listing/${application.listingId}`}
                          className="font-medium hover:text-primary"
                        >
                          {application.listingTitle}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Подано {formatDateTime(application.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {application.status === "pending" && (
                        <span className="text-xs text-muted-foreground">
                          {getTimeRemaining(application.responseDeadline)}
                        </span>
                      )}
                      <StatusBadge status={application.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">Ви ще не подавали заявок</p>
                <Button className="mt-4" asChild>
                  <Link href="/catalog">Знайти житло</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
