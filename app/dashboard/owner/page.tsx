"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/lib/auth-context";
import { mockListings, mockApplications } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { 
  Home, 
  Plus, 
  Eye, 
  MessageSquare, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  HelpCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  EyeOff,
  Shield
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"accept" | "reject" | "maybe" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [maybeMessage, setMaybeMessage] = useState("");

  // Get owner's listings
  const ownerListings = mockListings.filter(l => l.ownerId === user?.id);
  
  // Get applications for owner's listings
  const ownerApplications = mockApplications.filter(app => 
    ownerListings.some(l => l.id === app.listingId)
  );

  // Calculate stats
  const totalViews = ownerListings.reduce((sum, l) => sum + l.views, 0);
  const pendingApplications = ownerApplications.filter(a => a.status === "pending").length;
  const acceptedApplications = ownerApplications.filter(a => a.status === "accepted").length;
  const activeListings = ownerListings.filter(l => l.status === "active").length;

  // Check if verification is needed
  const isVerified = user?.isVerified;

  // Calculate response rate (for 72-hour rule)
  const respondedApplications = ownerApplications.filter(a => a.status !== "pending").length;
  const responseRate = ownerApplications.length > 0 
    ? Math.round((respondedApplications / ownerApplications.length) * 100) 
    : 100;

  const handleApplicationAction = (applicationId: string, action: "accept" | "reject" | "maybe") => {
    setSelectedApplication(applicationId);
    setActionType(action);
  };

  const confirmAction = () => {
    // In real app, this would update the database
    console.log(`Action ${actionType} on application ${selectedApplication}`);
    if (actionType === "reject") {
      console.log("Rejection reason:", rejectionReason);
    }
    if (actionType === "maybe") {
      console.log("Maybe message:", maybeMessage);
    }
    setSelectedApplication(null);
    setActionType(null);
    setRejectionReason("");
    setMaybeMessage("");
  };

  const getListingForApplication = (listingId: string) => {
    return mockListings.find(l => l.id === listingId);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return "Щойно";
    if (diffHours < 24) return `${diffHours} год. тому`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Вчора";
    return `${diffDays} дн. тому`;
  };

  const getTimeUntilDeadline = (createdAt: Date) => {
    const deadline = new Date(createdAt.getTime() + 72 * 60 * 60 * 1000);
    const now = new Date();
    const diffHours = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours <= 0) return { text: "Прострочено", urgent: true };
    if (diffHours <= 12) return { text: `${diffHours} год.`, urgent: true };
    if (diffHours <= 24) return { text: `${diffHours} год.`, urgent: false };
    return { text: `${Math.floor(diffHours / 24)} дн.`, urgent: false };
  };

  if (!isVerified) {
    return (
      <DashboardLayout role="owner">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Верифікація потрібна
          </h1>
          <p className="text-muted-foreground max-w-md mb-6">
            Щоб розміщувати оголошення та отримувати заявки від шукачів, 
            вам потрібно пройти верифікацію власника нерухомості.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 mb-6 max-w-md text-left">
            <h3 className="font-medium mb-2">Що потрібно для верифікації:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Фото паспорта або ID-картки
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Селфі з документом
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Підтвердження номера телефону
              </li>
            </ul>
          </div>
          <Button asChild size="lg">
            <Link href="/dashboard/owner/verification">
              Пройти верифікацію
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="owner">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Панель власника</h1>
            <p className="text-muted-foreground">
              Керуйте своїми оголошеннями та заявками
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/owner/listings/new">
              <Plus className="w-4 h-4 mr-2" />
              Додати оголошення
            </Link>
          </Button>
        </div>

        {/* Warning Banner - Low Response Rate */}
        {responseRate < 70 && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="flex items-center gap-4 py-4">
              <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  Низький рівень відповідей: {responseRate}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Відповідайте на заявки протягом 72 годин, щоб зберегти видимість оголошень. 
                  При ігноруванні понад 30% заявок ваші оголошення будуть понижені в пошуку.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="#applications">Переглянути заявки</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeListings}</p>
                  <p className="text-sm text-muted-foreground">Активних оголошень</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalViews}</p>
                  <p className="text-sm text-muted-foreground">Переглядів</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Users className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingApplications}</p>
                  <p className="text-sm text-muted-foreground">Нових заявок</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{responseRate}%</p>
                  <p className="text-sm text-muted-foreground">Рівень відповідей</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications" className="gap-2">
              <Users className="w-4 h-4" />
              Заявки
              {pendingApplications > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {pendingApplications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="listings" className="gap-2">
              <Home className="w-4 h-4" />
              Мої оголошення
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" id="applications">
            <Card>
              <CardHeader>
                <CardTitle>Заявки на оренду</CardTitle>
                <CardDescription>
                  Відповідайте на заявки протягом 72 годин. Після прийняття заявки 
                  відкриється чат з шукачем.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ownerApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">Поки немає заявок</h3>
                    <p className="text-muted-foreground">
                      Коли шукачі подадуть заявки на ваші оголошення, вони з&apos;являться тут
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Шукач</TableHead>
                          <TableHead>Оголошення</TableHead>
                          <TableHead>Дата заселення</TableHead>
                          <TableHead>Термін</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Час на відповідь</TableHead>
                          <TableHead className="text-right">Дії</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ownerApplications.map((application) => {
                          const listing = getListingForApplication(application.listingId);
                          const deadline = getTimeUntilDeadline(application.createdAt);
                          
                          return (
                            <TableRow key={application.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-sm font-medium">
                                      {application.seekerName.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{application.seekerName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatTimeAgo(application.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {listing && (
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded overflow-hidden">
                                      <Image
                                        src={listing.images[0]}
                                        alt={listing.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="max-w-[200px]">
                                      <p className="font-medium truncate">{listing.title}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {listing.price.toLocaleString()} ₴/міс
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {application.moveInDate.toLocaleDateString("uk-UA")}
                              </TableCell>
                              <TableCell>
                                {application.rentalPeriod}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={application.status} />
                              </TableCell>
                              <TableCell>
                                {application.status === "pending" ? (
                                  <div className={`flex items-center gap-1 ${deadline.urgent ? "text-destructive" : "text-muted-foreground"}`}>
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">{deadline.text}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {application.status === "pending" ? (
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-success border-success hover:bg-success hover:text-success-foreground"
                                      onClick={() => handleApplicationAction(application.id, "accept")}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleApplicationAction(application.id, "maybe")}
                                    >
                                      <HelpCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                      onClick={() => handleApplicationAction(application.id, "reject")}
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ) : application.status === "accepted" ? (
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href={`/dashboard/chat/${application.id}`}>
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Чат
                                    </Link>
                                  </Button>
                                ) : (
                                  <span className="text-sm text-muted-foreground">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Мої оголошення</CardTitle>
                    <CardDescription>
                      Керуйте своїми оголошеннями про оренду нерухомості
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/dashboard/owner/listings/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Додати
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ownerListings.length === 0 ? (
                  <div className="text-center py-12">
                    <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">Немає оголошень</h3>
                    <p className="text-muted-foreground mb-4">
                      Додайте своє перше оголошення про оренду
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/owner/listings/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Додати оголошення
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ownerListings.map((listing) => {
                      const listingApplications = ownerApplications.filter(
                        a => a.listingId === listing.id
                      );
                      const pendingCount = listingApplications.filter(
                        a => a.status === "pending"
                      ).length;

                      return (
                        <div
                          key={listing.id}
                          className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg"
                        >
                          <div className="relative w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={listing.images[0]}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                            {listing.moderationStatus === "pending" && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Badge variant="secondary" className="text-xs">
                                  На модерації
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-medium truncate">{listing.title}</h3>
                                <p className="text-sm text-muted-foreground">{listing.address}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/listing/${listing.id}`}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Переглянути
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/owner/listings/${listing.id}/edit`}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Редагувати
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    {listing.status === "active" ? "Деактивувати" : "Активувати"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Видалити
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="font-semibold text-primary">
                                {listing.price.toLocaleString()} ₴/міс
                              </p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Eye className="w-4 h-4" />
                                {listing.views}
                              </div>
                              {pendingCount > 0 && (
                                <Badge variant="secondary">
                                  {pendingCount} нових заявок
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <StatusBadge 
                                status={listing.status === "active" ? "accepted" : "rejected"} 
                              />
                              {listing.moderationStatus === "pending" && (
                                <Badge variant="outline" className="text-amber-600 border-amber-600">
                                  На модерації
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Confirmation Dialogs */}
      <Dialog open={actionType === "accept"} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Прийняти заявку?</DialogTitle>
            <DialogDescription>
              Після прийняття заявки відкриється чат з шукачем. 
              Ви зможете обговорити деталі та домовитись про перегляд.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Скасувати
            </Button>
            <Button onClick={confirmAction} className="bg-success hover:bg-success/90">
              <CheckCircle className="w-4 h-4 mr-2" />
              Прийняти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionType === "reject"} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Відхилити заявку?</DialogTitle>
            <DialogDescription>
              Вкажіть причину відхилення. Шукач отримає повідомлення.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Причина відхилення (необов'язково)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Скасувати
            </Button>
            <Button variant="destructive" onClick={confirmAction}>
              <XCircle className="w-4 h-4 mr-2" />
              Відхилити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionType === "maybe"} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Поставити в очікування?</DialogTitle>
            <DialogDescription>
              Ви можете попросити шукача надати додаткову інформацію або 
              пояснити, чому потрібен час на рішення.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Повідомлення для шукача..."
            value={maybeMessage}
            onChange={(e) => setMaybeMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Скасувати
            </Button>
            <Button onClick={confirmAction}>
              <HelpCircle className="w-4 h-4 mr-2" />
              В очікування
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
