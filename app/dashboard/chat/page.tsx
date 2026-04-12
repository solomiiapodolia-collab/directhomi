"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/lib/auth-context";
import { mockApplications, mockListings, mockUsers, mockMessages } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ChatListPage() {
  const { user } = useAuth();

  // Get accepted applications for this user
  const userApplications = mockApplications.filter(app => {
    if (user?.role === "owner") {
      const listing = mockListings.find(l => l.id === app.listingId);
      return listing?.ownerId === user.id && app.status === "accepted";
    } else {
      return app.seekerId === user?.id && app.status === "accepted";
    }
  });

  // Get last message for each conversation
  const getLastMessage = (applicationId: string) => {
    const appMessages = mockMessages
      .filter(m => m.applicationId === applicationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return appMessages[0];
  };

  // Get unread count for each conversation
  const getUnreadCount = (applicationId: string) => {
    return mockMessages.filter(
      m => m.applicationId === applicationId && !m.read && m.senderId !== user?.id
    ).length;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Щойно";
    if (diffHours < 24) {
      return date.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
    }
    if (diffHours < 48) return "Вчора";
    return date.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" });
  };

  // Sort by last message time
  const sortedApplications = userApplications.sort((a, b) => {
    const lastA = getLastMessage(a.id);
    const lastB = getLastMessage(b.id);
    if (!lastA && !lastB) return 0;
    if (!lastA) return 1;
    if (!lastB) return -1;
    return lastB.createdAt.getTime() - lastA.createdAt.getTime();
  });

  return (
    <DashboardLayout role={user?.role || "seeker"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Повідомлення</h1>
          <p className="text-muted-foreground">
            Ваші чати з {user?.role === "owner" ? "шукачами" : "власниками"}
          </p>
        </div>

        {sortedApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">Немає активних чатів</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {user?.role === "owner" 
                  ? "Чати з&apos;являться після того, як ви приймете заявки на свої оголошення"
                  : "Чати з&apos;являться після того, як власники приймуть ваші заявки"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {sortedApplications.map((application) => {
              const listing = mockListings.find(l => l.id === application.listingId);
              const otherUserId = user?.role === "owner" ? application.seekerId : listing?.ownerId;
              const otherUser = mockUsers.find(u => u.id === otherUserId);
              const lastMessage = getLastMessage(application.id);
              const unreadCount = getUnreadCount(application.id);

              return (
                <Link
                  key={application.id}
                  href={`/dashboard/chat/${application.id}`}
                  className="block"
                >
                  <Card className={`hover:bg-muted/50 transition-colors ${unreadCount > 0 ? "border-primary/50" : ""}`}>
                    <CardContent className="flex items-center gap-4 py-4">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          {otherUser?.name.charAt(0)}
                        </div>
                        {unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {unreadCount}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`font-medium truncate ${unreadCount > 0 ? "text-foreground" : ""}`}>
                            {otherUser?.name}
                          </p>
                          {lastMessage && (
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatTime(lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {listing?.title}
                        </p>
                        {lastMessage && (
                          <p className={`text-sm truncate mt-1 ${unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                            {lastMessage.senderId === user?.id ? "Ви: " : ""}
                            {lastMessage.content}
                          </p>
                        )}
                      </div>

                      {/* Listing Preview */}
                      {listing && (
                        <div className="hidden sm:block relative w-16 h-12 rounded overflow-hidden shrink-0">
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
