"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { mockComplaints, mockUsers, mockListings } from "@/lib/mock-data";
import { 
  Search, 
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Home,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function AdminComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"resolve" | "dismiss" | null>(null);
  const [resolution, setResolution] = useState("");

  // Enrich complaints with user/listing data
  const enrichedComplaints = mockComplaints.map(complaint => {
    const reporter = mockUsers.find(u => u.id === complaint.reporterId);
    let target = null;
    if (complaint.type === "listing") {
      target = mockListings.find(l => l.id === complaint.targetId);
    } else {
      target = mockUsers.find(u => u.id === complaint.targetId);
    }
    return { ...complaint, reporter, target };
  });

  const filteredComplaints = enrichedComplaints.filter(complaint =>
    complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.reporter?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openComplaints = filteredComplaints.filter(c => c.status === "open");
  const resolvedComplaints = filteredComplaints.filter(c => c.status === "resolved");
  const dismissedComplaints = filteredComplaints.filter(c => c.status === "dismissed");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case "fraud": return "Шахрайство";
      case "inappropriate": return "Неприйнятний контент";
      case "spam": return "Спам";
      default: return "Інше";
    }
  };

  const getReasonVariant = (reason: string) => {
    switch (reason) {
      case "fraud": return "destructive";
      case "inappropriate": return "secondary";
      case "spam": return "outline";
      default: return "outline";
    }
  };

  const handleAction = (complaintId: string, action: "resolve" | "dismiss") => {
    setSelectedComplaint(complaintId);
    setActionType(action);
  };

  const confirmAction = () => {
    console.log(`Action ${actionType} on complaint ${selectedComplaint}`);
    console.log("Resolution:", resolution);
    setSelectedComplaint(null);
    setActionType(null);
    setResolution("");
  };

  const ComplaintCard = ({ complaint }: { complaint: typeof enrichedComplaints[0] }) => (
    <Card className={complaint.status === "open" ? "border-amber-500/50" : ""}>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Complaint Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={getReasonVariant(complaint.reason) as "destructive" | "secondary" | "outline"}>
                  {getReasonLabel(complaint.reason)}
                </Badge>
                <Badge variant="outline">
                  {complaint.type === "listing" ? "Оголошення" : "Користувач"}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(complaint.createdAt)}
              </span>
            </div>

            <p className="text-sm">{complaint.description}</p>

            {/* Target */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              {complaint.type === "listing" ? (
                <>
                  <Home className="w-5 h-5 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {(complaint.target as typeof mockListings[0])?.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(complaint.target as typeof mockListings[0])?.city}
                    </p>
                  </div>
                  <Link
                    href={`/listing/${complaint.targetId}`}
                    target="_blank"
                    className="ml-auto text-sm text-primary hover:underline"
                  >
                    Переглянути
                  </Link>
                </>
              ) : (
                <>
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="font-medium">
                      {(complaint.target as typeof mockUsers[0])?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(complaint.target as typeof mockUsers[0])?.email}
                    </p>
                  </div>
                  <Link
                    href={`/admin/users/${complaint.targetId}`}
                    className="ml-auto text-sm text-primary hover:underline"
                  >
                    Профіль
                  </Link>
                </>
              )}
            </div>

            {/* Reporter */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flag className="w-4 h-4" />
              <span>Скарга від:</span>
              <span className="font-medium text-foreground">
                {complaint.reporter?.name}
              </span>
            </div>
          </div>

          {/* Actions */}
          {complaint.status === "open" && (
            <div className="flex lg:flex-col gap-2 lg:w-32">
              <Button
                size="sm"
                className="flex-1 bg-success hover:bg-success/90"
                onClick={() => handleAction(complaint.id, "resolve")}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Вирішено
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleAction(complaint.id, "dismiss")}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Відхилити
              </Button>
            </div>
          )}

          {complaint.status !== "open" && (
            <div className="lg:w-32">
              <Badge
                variant={complaint.status === "resolved" ? "default" : "secondary"}
                className="w-full justify-center py-1"
              >
                {complaint.status === "resolved" ? "Вирішено" : "Відхилено"}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Скарги</h1>
            <p className="text-muted-foreground">
              Розгляд скарг користувачів
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
                  <p className="text-2xl font-bold">{openComplaints.length}</p>
                  <p className="text-sm text-muted-foreground">Відкритих</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-2xl font-bold">{resolvedComplaints.length}</p>
                  <p className="text-sm text-muted-foreground">Вирішених</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{dismissedComplaints.length}</p>
                  <p className="text-sm text-muted-foreground">Відхилених</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints List */}
        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Відкриті
              {openComplaints.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {openComplaints.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="resolved">Вирішені</TabsTrigger>
            <TabsTrigger value="dismissed">Відхилені</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="space-y-4 mt-4">
            {openComplaints.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">Все розглянуто!</h3>
                  <p className="text-muted-foreground">
                    Немає відкритих скарг
                  </p>
                </CardContent>
              </Card>
            ) : (
              openComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4 mt-4">
            {resolvedComplaints.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">
                    Немає вирішених скарг
                  </p>
                </CardContent>
              </Card>
            ) : (
              resolvedComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))
            )}
          </TabsContent>

          <TabsContent value="dismissed" className="space-y-4 mt-4">
            {dismissedComplaints.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">
                    Немає відхилених скарг
                  </p>
                </CardContent>
              </Card>
            ) : (
              dismissedComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Resolve Dialog */}
      <Dialog open={actionType === "resolve"} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Позначити як вирішено</DialogTitle>
            <DialogDescription>
              Опишіть вжиті заходи для вирішення скарги.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Опис вжитих заходів..."
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Скасувати
            </Button>
            <Button onClick={confirmAction} className="bg-success hover:bg-success/90">
              <CheckCircle className="w-4 h-4 mr-2" />
              Вирішено
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dismiss Dialog */}
      <Dialog open={actionType === "dismiss"} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Відхилити скаргу?</DialogTitle>
            <DialogDescription>
              Вкажіть причину відхилення скарги.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Причина відхилення..."
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Скасувати
            </Button>
            <Button variant="secondary" onClick={confirmAction}>
              <XCircle className="w-4 h-4 mr-2" />
              Відхилити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
