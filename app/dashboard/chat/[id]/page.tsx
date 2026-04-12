"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/lib/auth-context";
import { mockApplications, mockListings, mockUsers, mockMessages } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Phone,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  Flag,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  CheckCheck,
  Check
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const applicationId = params.id as string;
  const application = mockApplications.find(a => a.id === applicationId);
  const listing = application ? mockListings.find(l => l.id === application.listingId) : null;
  
  // Determine the other party
  const isOwner = user?.role === "owner";
  const otherUserId = isOwner ? application?.seekerId : listing?.ownerId;
  const otherUser = mockUsers.find(u => u.id === otherUserId);

  // Filter messages for this conversation
  const conversationMessages = messages.filter(m => 
    m.applicationId === applicationId
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      applicationId,
      senderId: user.id,
      senderName: user.name,
      content: message.trim(),
      createdAt: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Сьогодні";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчора";
    }
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
    });
  };

  // Group messages by date
  const groupedMessages: { [key: string]: typeof conversationMessages } = {};
  conversationMessages.forEach(msg => {
    const dateKey = msg.createdAt.toDateString();
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(msg);
  });

  if (!application || application.status !== "accepted") {
    return (
      <DashboardLayout role={user?.role || "seeker"}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
          <h1 className="text-xl font-semibold mb-2">Чат недоступний</h1>
          <p className="text-muted-foreground mb-4">
            Чат доступний тільки для прийнятих заявок
          </p>
          <Button asChild>
            <Link href={`/dashboard/${user?.role}`}>
              Повернутись до панелі
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={user?.role || "seeker"}>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
        {/* Chat Header */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              {otherUser?.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold truncate">{otherUser?.name}</h1>
              <p className="text-sm text-muted-foreground truncate">
                {listing?.title}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/listing/${listing?.id}`}>
                  Переглянути оголошення
                </Link>
              </DropdownMenuItem>
              {isOwner && otherUser?.phone && (
                <DropdownMenuItem asChild>
                  <a href={`tel:${otherUser.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Зателефонувати
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => setShowReportDialog(true)}
              >
                <Flag className="w-4 h-4 mr-2" />
                Поскаржитись
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 gap-4 overflow-hidden mt-4">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {Object.entries(groupedMessages).map(([dateKey, msgs]) => (
                <div key={dateKey}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-4">
                    <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                      {formatDate(new Date(dateKey))}
                    </span>
                  </div>

                  {/* Messages for this date */}
                  {msgs.map((msg) => {
                    const isOwnMessage = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                          <div className={`flex items-center gap-1 mt-1 ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}>
                            <span className={`text-xs ${
                              isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}>
                              {formatTime(msg.createdAt)}
                            </span>
                            {isOwnMessage && (
                              msg.read ? (
                                <CheckCheck className="w-3 h-3 text-primary-foreground/70" />
                              ) : (
                                <Check className="w-3 h-3 text-primary-foreground/70" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t mt-4">
              <Button type="button" variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Напишіть повідомлення..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!message.trim()}>
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>

          {/* Sidebar - Listing Info (Desktop) */}
          <Card className="hidden lg:block w-80 shrink-0">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Про оголошення</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              {/* Listing Preview */}
              {listing && (
                <Link href={`/listing/${listing.id}`} className="block">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium mt-2 truncate">{listing.title}</h3>
                  <p className="text-primary font-semibold">
                    {listing.price.toLocaleString()} ₴/міс
                  </p>
                </Link>
              )}

              {/* Application Details */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-sm">Деталі заявки</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Заселення: {application.moveInDate.toLocaleDateString("uk-UA")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Термін: {application.rentalPeriod}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info (for owner) */}
              {isOwner && otherUser?.phone && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm">Контакти</h4>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`tel:${otherUser.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {otherUser.phone}
                    </a>
                  </Button>
                </div>
              )}

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  Не передавайте гроші до перегляду житла. 
                  Остерігайтесь шахраїв.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Поскаржитись на користувача</DialogTitle>
            <DialogDescription>
              Опишіть проблему. Ваша скарга буде розглянута модераторами.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Опишіть причину скарги..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Скасувати
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                console.log("Report submitted:", reportReason);
                setShowReportDialog(false);
                setReportReason("");
              }}
            >
              <Flag className="w-4 h-4 mr-2" />
              Надіслати скаргу
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
