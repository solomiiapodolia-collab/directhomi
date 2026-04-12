"use client";

import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { ListingFiltersComponent } from "@/components/listing-filters";
import { mockListings, getActiveListings } from "@/lib/mock-data";
import type { ListingFilters, Listing } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid3X3, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "price_asc" | "price_desc" | "area_desc";
type ViewMode = "grid" | "list";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Спочатку нові" },
  { value: "price_asc", label: "Ціна: від низької" },
  { value: "price_desc", label: "Ціна: від високої" },
  { value: "area_desc", label: "Площа: від більшої" },
];

export default function CatalogPage() {
  const [filters, setFilters] = useState<ListingFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [savedListings, setSavedListings] = useState<string[]>([]);

  const filteredListings = useMemo(() => {
    let listings = getActiveListings();

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      listings = listings.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.address.city.toLowerCase().includes(query) ||
          l.address.district.toLowerCase().includes(query) ||
          l.address.street.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.city) {
      listings = listings.filter((l) => l.address.city === filters.city);
    }
    if (filters.district) {
      listings = listings.filter((l) => l.address.district === filters.district);
    }
    if (filters.type) {
      listings = listings.filter((l) => l.type === filters.type);
    }
    if (filters.propertyType) {
      listings = listings.filter((l) => l.propertyType === filters.propertyType);
    }
    if (filters.priceMin !== undefined) {
      listings = listings.filter((l) => l.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      listings = listings.filter((l) => l.price <= filters.priceMax!);
    }
    if (filters.roomsMin !== undefined) {
      listings = listings.filter((l) => l.features.rooms >= filters.roomsMin!);
    }
    if (filters.roomsMax !== undefined) {
      listings = listings.filter((l) => l.features.rooms <= filters.roomsMax!);
    }
    if (filters.areaMin !== undefined) {
      listings = listings.filter((l) => l.features.area >= filters.areaMin!);
    }
    if (filters.areaMax !== undefined) {
      listings = listings.filter((l) => l.features.area <= filters.areaMax!);
    }
    if (filters.hasBalcony) {
      listings = listings.filter((l) => l.features.hasBalcony);
    }
    if (filters.hasParking) {
      listings = listings.filter((l) => l.features.hasParking);
    }
    if (filters.hasFurniture) {
      listings = listings.filter((l) => l.features.hasFurniture);
    }
    if (filters.petsAllowed) {
      listings = listings.filter((l) => l.features.petsAllowed);
    }
    if (filters.verifiedOwnerOnly) {
      listings = listings.filter((l) => l.isOwnerVerified);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        listings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "price_asc":
        listings.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        listings.sort((a, b) => b.price - a.price);
        break;
      case "area_desc":
        listings.sort((a, b) => b.features.area - a.features.area);
        break;
    }

    return listings;
  }, [filters, searchQuery, sortBy]);

  const handleSave = (id: string) => {
    setSavedListings((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Каталог оголошень</h1>
            <p className="mt-2 text-muted-foreground">
              Знайдіть ідеальне житло серед {mockListings.filter((l) => l.status === "active").length} активних оголошень
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <ListingFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={setSearchQuery}
            />
          </div>

          {/* Results Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Знайдено: <span className="font-medium text-foreground">{filteredListings.length}</span> оголошень
            </p>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden items-center gap-1 rounded-md border border-border p-1 sm:flex">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                  aria-label="Сітка"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                  aria-label="Список"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {filteredListings.length > 0 ? (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {filteredListings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  onSave={handleSave}
                  isSaved={savedListings.includes(listing.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Grid3X3 className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Оголошень не знайдено</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Спробуйте змінити параметри пошуку або скинути фільтри
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setFilters({});
                  setSearchQuery("");
                }}
              >
                Скинути фільтри
              </Button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
