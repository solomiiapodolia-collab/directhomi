"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Home, Maximize, BadgeCheck, Eye, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  listing: Listing;
  onSave?: (id: string) => void;
  isSaved?: boolean;
  showStats?: boolean;
}

const propertyTypeLabels: Record<string, string> = {
  apartment: "Квартира",
  house: "Будинок",
  room: "Кімната",
  commercial: "Комерційна",
};

const listingTypeLabels: Record<string, string> = {
  rent: "Оренда",
  sale: "Продаж",
};

export function PropertyCard({ listing, onSave, isSaved = false, showStats = false }: PropertyCardProps) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/listing/${listing.id}`}>
          <Image
            src={listing.photos[0] || "/placeholder.jpg"}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {listingTypeLabels[listing.type]}
          </Badge>
          {listing.isOwnerVerified && (
            <Badge className="bg-primary/90 backdrop-blur-sm">
              <BadgeCheck className="mr-1 h-3 w-3" />
              Перевірено
            </Badge>
          )}
        </div>

        {/* Save Button */}
        {onSave && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-3 top-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-colors",
              isSaved && "text-destructive"
            )}
            onClick={(e) => {
              e.preventDefault();
              onSave(listing.id);
            }}
            aria-label={isSaved ? "Видалити з обраних" : "Додати до обраних"}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
          </Button>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="inline-block rounded-md bg-background/95 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(listing.price)}
            </span>
            {listing.type === "rent" && (
              <span className="text-sm text-muted-foreground">/міс</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <Link href={`/listing/${listing.id}`}>
          <h3 className="mb-2 line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {listing.title}
          </h3>
        </Link>

        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {listing.address.city}, {listing.address.district}
          </span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>{listing.features.rooms} кімн.</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{listing.features.area} м²</span>
          </div>
          {listing.address.floor && (
            <span>
              {listing.address.floor}/{listing.address.totalFloors} пов.
            </span>
          )}
        </div>

        {/* Property Type */}
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {propertyTypeLabels[listing.propertyType]}
          </span>
        </div>

        {/* Stats (for owner dashboard) */}
        {showStats && (
          <div className="mt-3 flex gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{listing.viewsCount} переглядів</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span>{listing.applicationsCount} заявок</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
