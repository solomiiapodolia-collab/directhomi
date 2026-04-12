"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockListings, mockUsers, mockApplications, mockComplaints } from "@/lib/mock-data";
import { 
  Home, 
  Users, 
  FileText, 
  Flag, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  // Calculate stats
  const totalListings = mockListings.length;
  const pendingModerationListings = mockListings.filter(l => l.moderationStatus === "pending").length;
  const totalUsers = mockUsers.length;
  const totalOwners = mockUsers.filter(u => u.role === "owner").length;
  const totalSeekers = mockUsers.filter(u => u.role === "seeker").length;
  const totalApplications = mockApplications.length;
  const openComplaints = mockComplaints.filter(c => c.status === "open").length;

  // Recent activity
  const recentListings = mockListings
    .filter(l => l.moderationStatus === "pending")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const recentComplaints = mockComplaints
    .filter(c => c.status === "open")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return "Щойно";
    if (diffHours < 24) return `${diffHours} год. тому`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} дн. тому`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Панель адміністратора</h1>
          <p className="text-muted-foreground">
            Огляд платформи DirectHomi
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalListings}</p>
                  <p className="text-sm text-muted-foreground">Оголошень</p>
                </div>
              </div>
              {pendingModerationListings > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <Link 
                    href="/admin/listings?status=pending"
                    className="text-sm text-amber-600 flex items-center gap-1 hover:underline"
                  >
                    <Clock className="w-4 h-4" />
                    {pendingModerationListings} на модерації
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Користувачів</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t flex gap-4 text-sm text-muted-foreground">
                <span>{totalOwners} власників</span>
                <span>{totalSeekers} шукачів</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-success/10">
                  <FileText className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalApplications}</p>
                  <p className="text-sm text-muted-foreground">Заявок</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Flag className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{openComplaints}</p>
                  <p className="text-sm text-muted-foreground">Відкритих скарг</p>
                </div>
              </div>
              {openComplaints > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <Link 
                    href="/admin/complaints"
                    className="text-sm text-destructive flex items-center gap-1 hover:underline"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Потребують уваги
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Moderation */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">На модерації</CardTitle>
                <CardDescription>
                  Оголошення, що очікують перевірки
                </CardDescription>
              </div>
              <Link 
                href="/admin/listings?status=pending"
                className="text-sm text-primary flex items-center gap-1 hover:underline"
              >
                Всі
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentListings.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-10 h-10 text-success mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Немає оголошень на модерації
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentListings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/admin/listings/${listing.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {listing.city} • {formatTimeAgo(listing.createdAt)}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 ml-2">
                        Очікує
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Complaints */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Скарги</CardTitle>
                <CardDescription>
                  Останні скарги користувачів
                </CardDescription>
              </div>
              <Link 
                href="/admin/complaints"
                className="text-sm text-primary flex items-center gap-1 hover:underline"
              >
                Всі
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentComplaints.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-10 h-10 text-success mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Немає відкритих скарг
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentComplaints.map((complaint) => (
                    <Link
                      key={complaint.id}
                      href={`/admin/complaints/${complaint.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {complaint.type === "listing" ? "Оголошення" : "Користувач"}
                          </p>
                          <Badge 
                            variant={complaint.reason === "fraud" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {complaint.reason === "fraud" ? "Шахрайство" : 
                             complaint.reason === "inappropriate" ? "Неприйнятний контент" :
                             complaint.reason === "spam" ? "Спам" : "Інше"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {complaint.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {formatTimeAgo(complaint.createdAt)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Швидкі дії</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/admin/listings?status=pending"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <Clock className="w-6 h-6 text-amber-500" />
                <span className="text-sm text-center">Модерація оголошень</span>
              </Link>
              <Link
                href="/admin/users?verification=pending"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <Users className="w-6 h-6 text-blue-500" />
                <span className="text-sm text-center">Верифікація власників</span>
              </Link>
              <Link
                href="/admin/complaints"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <Flag className="w-6 h-6 text-destructive" />
                <span className="text-sm text-center">Розглянути скарги</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <TrendingUp className="w-6 h-6 text-success" />
                <span className="text-sm text-center">Статистика</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
