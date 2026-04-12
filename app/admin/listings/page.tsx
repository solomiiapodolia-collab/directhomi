"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { mockListings, mockUsers } from "@/lib/mock-data";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Get all listings with owner info
  const listingsWithOwners = mockListings.map(listing => {
    const owner = mockUsers.find(u => u.id === listing.ownerId);
    return { ...listing, owner };
  });

  // Filter listings
  const filteredListings = listingsWithOwners.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.owner?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingListings = filteredListings.filter(l => l.moderationStatus === "pending");
  const approvedListings = filteredListings.filter(l => l.moderationStatus === "approved");
  const rejectedListings = filteredListings.filter(l => l.moderationStatus === "rejected");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleAction = (listingId: string, action: "approve" | "reject") => {
    setSelectedListing(listingId);
    setActionType(action);
  };

  const confirmAction = () => {
    console.log(`Action ${actionType} on listing ${selectedListing}`);
    if (actionType === "reject") {
      console.log("Rejection reason:", rejectionReason);
    }
    setSelectedListing(null);
    setActionType(null);
    setRejectionReason("");
  };

  const ListingRow = ({ listing }: { listing: typeof listingsWithOwners[0] }) => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-12 rounded overflow-hidden shrink-0">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate max-w-[200px]">{listing.title}</p>
            <p className="text-sm text-muted-foreground">{listing.city}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            {listing.owner?.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{listing.owner?.name}</p>
            <p className="text-xs text-muted-foreground">
              {listing.owner?.isVerified ? "Верифікований" : "Не верифікований"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="font-medium">{listing.price.toLocaleString()} ₴</p>
        <p className="text-xs text-muted-foreground">
          {listing.listingType === "rent" ? "/місяць" : ""}
        </p>
      </TableCell>
      <TableCell>
        <p className="text-sm">{formatDate(listing.createdAt)}</p>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            listing.moderationStatus === "approved" ? "default" :
            listing.moderationStatus === "pending" ? "secondary" : "destructive"
          }
        >
          {listing.moderationStatus === "approved" ? "Схвалено" :
           listing.moderationStatus === "pending" ? "Очікує" : "Відхилено"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/listing/${listing.id}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                Переглянути
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/listings/${listing.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                Детальніше
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {listing.moderationStatus === "pending" && (
              <>
                <DropdownMenuItem 
                  className="text-success"
                  onClick={() => handleAction(listing.id, "approve")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Схвалити
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => handleAction(listing.id, "reject")}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Відхилити
                </DropdownMenuItem>
              </>
            )}
            {listing.moderationStatus === "approved" && (
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleAction(listing.id, "reject")}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Заблокувати
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Оголошення</h1>
            <p className="text-muted-foreground">
              Модерація та управління оголошеннями
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Пошук..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{pendingListings.length}</p>
                  <p className="text-sm text-muted-foreground">На модерації</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-2xl font-bold">{approvedListings.length}</p>
                  <p className="text-sm text-muted-foreground">Активних</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{rejectedListings.length}</p>
                  <p className="text-sm text-muted-foreground">Відхилених</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Table */}
        <Card>
          <Tabs defaultValue="pending">
            <CardHeader>
              <TabsList>
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="w-4 h-4" />
                  На модерації
                  {pendingListings.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {pendingListings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">Активні</TabsTrigger>
                <TabsTrigger value="rejected">Відхилені</TabsTrigger>
                <TabsTrigger value="all">Всі</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="pending" className="mt-0">
                {pendingListings.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">Все перевірено!</h3>
                    <p className="text-muted-foreground">
                      Немає оголошень, що очікують модерації
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Оголошення</TableHead>
                          <TableHead>Власник</TableHead>
                          <TableHead>Ціна</TableHead>
                          <TableHead>Дата</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead className="text-right">Дії</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingListings.map((listing) => (
                          <ListingRow key={listing.id} listing={listing} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="mt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Оголошення</TableHead>
                        <TableHead>Власник</TableHead>
                        <TableHead>Ціна</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Дії</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedListings.map((listing) => (
                        <ListingRow key={listing.id} listing={listing} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="rejected" className="mt-0">
                {rejectedListings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Немає відхилених оголошень
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Оголошення</TableHead>
                          <TableHead>Власник</TableHead>
                          <TableHead>Ціна</TableHead>
                          <TableHead>Дата</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead className="text-right">Дії</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rejectedListings.map((listing) => (
                          <ListingRow key={listing.id} listing={listing} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all" className="mt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Оголошення</TableHead>
                        <TableHead>Власник</TableHead>
                        <TableHead>Ціна</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Дії</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredListings.map((listing) => (
                        <ListingRow key={listing.id} listing={listing} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={actionType === "approve"} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Схвалити оголошення?</DialogTitle>
            <DialogDescription>
              Оголошення буде опубліковано та стане видимим для всіх користувачів.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Скасувати
            </Button>
            <Button onClick={confirmAction} className="bg-success hover:bg-success/90">
              <CheckCircle className="w-4 h-4 mr-2" />
              Схвалити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={actionType === "reject"} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Відхилити оголошення?</DialogTitle>
            <DialogDescription>
              Вкажіть причину відхилення. Власник отримає повідомлення.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Причина відхилення..."
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
    </AdminLayout>
  );
}
