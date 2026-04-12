"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities } from "@/lib/mock-data";
import type { ListingFilters, ListingType, PropertyType } from "@/lib/types";

interface ListingFiltersProps {
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;
  onSearch: (query: string) => void;
}

const propertyTypes = [
  { value: "apartment", label: "Квартира" },
  { value: "house", label: "Будинок" },
  { value: "studio", label: "Студія" },
  { value: "room", label: "Кімната" },
];

const listingTypes = [
  { value: "rent", label: "Оренда" },
  { value: "sale", label: "Продаж" },
];

const bedroomOptions = ["1", "2", "3", "4+"];

export function ListingFiltersComponent({ filters, onFiltersChange, onSearch }: ListingFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ListingFilters>(filters);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState("");
  const [petsFilter, setPetsFilter] = useState<"all" | "yes" | "no">("all");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const updateLocalFilter = <K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBedroom = (val: string) => {
    setSelectedBedrooms((prev) => prev.includes(val) ? prev.filter((b) => b !== val) : [...prev, val]);
  };

  const applyFilters = () => {
    const updatedFilters = { ...localFilters };
    if (petsFilter === "yes") updatedFilters.petsAllowed = true;
    else if (petsFilter === "no") updatedFilters.petsAllowed = false;
    onFiltersChange(updatedFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters: ListingFilters = {};
    setLocalFilters(emptyFilters);
    setSelectedBedrooms([]);
    setMoveInDate("");
    setPetsFilter("all");
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== undefined && v !== "").length
    + selectedBedrooms.length + (moveInDate ? 1 : 0) + (petsFilter !== "all" ? 1 : 0);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Пошук за назвою або адресою..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Фільтри</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </form>

      {/* Filters Panel */}
      {isOpen && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* City */}
            <div className="space-y-2">
              <Label>🏙 Місто</Label>
              <Select
                value={localFilters.city || ""}
                onValueChange={(value) => updateLocalFilter("city", value || undefined)}
              >
                <SelectTrigger><SelectValue placeholder="Всі міста" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Всі міста</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deal Type */}
            <div className="space-y-2">
              <Label>🏷 Тип угоди</Label>
              <div className="flex gap-2">
                {listingTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateLocalFilter("type", localFilters.type === type.value ? undefined : type.value as ListingType)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                      localFilters.type === type.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <Label>🏠 Тип нерухомості</Label>
              <div className="grid grid-cols-2 gap-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateLocalFilter("propertyType", localFilters.propertyType === type.value ? undefined : type.value as PropertyType)}
                    className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                      localFilters.propertyType === type.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label>💰 Бюджет (грн)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Від"
                  value={localFilters.priceMin || ""}
                  onChange={(e) => updateLocalFilter("priceMin", e.target.value ? parseInt(e.target.value) : undefined)}
                />
                <span className="text-muted-foreground">—</span>
                <Input
                  type="number"
                  placeholder="До"
                  value={localFilters.priceMax || ""}
                  onChange={(e) => updateLocalFilter("priceMax", e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label>📐 Площа (м²)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Від"
                  value={localFilters.areaMin || ""}
                  onChange={(e) => updateLocalFilter("areaMin", e.target.value ? parseInt(e.target.value) : undefined)}
                />
                <span className="text-muted-foreground">—</span>
                <Input
                  type="number"
                  placeholder="До"
                  value={localFilters.areaMax || ""}
                  onChange={(e) => updateLocalFilter("areaMax", e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <Label>🛏 Кількість кімнат</Label>
              <div className="flex gap-2">
                {bedroomOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleBedroom(opt)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                      selectedBedrooms.includes(opt)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Pets */}
            <div className="space-y-2">
              <Label>🐾 Тварини</Label>
              <div className="flex gap-2">
                {[{ value: "all", label: "Всі" }, { value: "yes", label: "✅ Так" }, { value: "no", label: "❌ Ні" }].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPetsFilter(opt.value as "all" | "yes" | "no")}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                      petsFilter === opt.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Move-in Date */}
            <div className="space-y-2">
              <Label>📅 Дата заїзду</Label>
              <Input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
              />
            </div>

            {/* Verified Only */}
            <div className="flex items-center space-x-2 rounded-lg border border-border p-3 self-end">
              <Checkbox
                id="verifiedOwnerOnly"
                checked={localFilters.verifiedOwnerOnly || false}
                onCheckedChange={(checked) => updateLocalFilter("verifiedOwnerOnly", checked ? true : undefined)}
              />
              <label htmlFor="verifiedOwnerOnly" className="text-sm font-medium cursor-pointer">
                ✅ Тільки верифіковані власники
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3 justify-end">
            <Button variant="outline" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />Скинути
            </Button>
            <Button onClick={applyFilters}>Застосувати фільтри</Button>
          </div>
        </div>
      )}

      {/* Active filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Активні фільтри:</span>
          {filters.city && (
            <Button variant="secondary" size="sm" onClick={() => onFiltersChange({ ...filters, city: undefined })} className="h-7 gap-1 text-xs">
              {filters.city} <X className="h-3 w-3" />
            </Button>
          )}
          {filters.type && (
            <Button variant="secondary" size="sm" onClick={() => onFiltersChange({ ...filters, type: undefined })} className="h-7 gap-1 text-xs">
              {filters.type === "rent" ? "Оренда" : "Продаж"} <X className="h-3 w-3" />
            </Button>
          )}
          {filters.verifiedOwnerOnly && (
            <Button variant="secondary" size="sm" onClick={() => onFiltersChange({ ...filters, verifiedOwnerOnly: undefined })} className="h-7 gap-1 text-xs">
              Верифіковані <X className="h-3 w-3" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs text-muted-foreground">
            Скинути всі
          </Button>
        </div>
      )}
    </div>
  );
}
