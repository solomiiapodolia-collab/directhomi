"use client";
 
import { useState } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, Home, Maximize, BadgeCheck, Heart, Share2, Flag,
  Calendar, Users, Dog, Baby, Cigarette, Car, Sofa, ThermometerSun,
  Hammer, ChevronLeft, ChevronRight, Send, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ApplicationForm } from "@/components/application-form";
import { getListingById, formatPrice, formatDate, mockOwners } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import type { ApplicationFormData } from "@/lib/types";
import { cn } from "@/lib/utils";
 
const propertyTypeLabels: Record<string, string> = {
  apartment: "Квартира", house: "Будинок", room: "Кімната", commercial: "Комерційна нерухомість",
};
const listingTypeLabels: Record<string, string> = { rent: "Оренда", sale: "Продаж" };
const conditionLabels: Record<string, string> = {
  new: "Новобудова", renovated: "Після ремонту", good: "Хороший стан", needs_repair: "Потребує ремонту",
};
const heatingLabels: Record<string, string> = {
  central: "Центральне опалення", individual: "Індивідуальне опалення", none: "Без опалення",
};
 
export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
 
  const listing = getListingById(resolvedParams.id);
 
  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Оголошення не знайдено</h1>
            <p className="mt-2 text-muted-foreground">Це оголошення може бути видалене або недоступне</p>
            <Button className="mt-4" asChild><Link href="/catalog">Повернутись до каталогу</Link></Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }
 
  const owner = mockOwners.find((o) => o.id === listing.ownerId);
  const nextPhoto = () => setCurrentPhotoIndex((prev) => prev === listing.photos.length - 1 ? 0 : prev + 1);
  const prevPhoto = () => setCurrentPhotoIndex((prev) => prev === 0 ? listing.photos.length - 1 : prev - 1);
  const handleApplicationSubmit = (data: ApplicationFormData) => { console.log("Application submitted:", data); setApplicationSubmitted(true); };
  const canApply = user?.role === "seeker" && !applicationSubmitted;
 
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />Назад
          </Button>
 
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Photo Gallery */}
              <div className="relative overflow-hidden rounded-xl">
                <div className="relative aspect-[16/10]">
                  <Image src={listing.photos[currentPhotoIndex]} alt={`${listing.title} - фото ${currentPhotoIndex + 1}`} fill className="object-cover" priority />
                  {listing.photos.length > 1 && (
                    <>
                      <button onClick={prevPhoto} className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background" aria-label="Попереднє фото">
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button onClick={nextPhoto} className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background" aria-label="Наступне фото">
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-sm backdrop-blur-sm">
                        {currentPhotoIndex + 1} / {listing.photos.length}
                      </div>
                    </>
                  )}
                </div>
                {listing.photos.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {listing.photos.map((photo, index) => (
                      <button key={index} onClick={() => setCurrentPhotoIndex(index)} className={cn("relative h-16 w-24 shrink-0 overflow-hidden rounded-md", index === currentPhotoIndex && "ring-2 ring-primary")}>
                        <Image src={photo} alt={`Мініатюра ${index + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
 
              {/* Title & Badges */}
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{listingTypeLabels[listing.type]}</Badge>
                  <Badge variant="outline">{propertyTypeLabels[listing.propertyType]}</Badge>
                  {listing.isOwnerVerified && (
                    <Badge className="bg-primary"><BadgeCheck className="mr-1 h-3 w-3" />Власник верифікований</Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold sm:text-3xl">{listing.title}</h1>
                <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.address.city}, {listing.address.district}, {listing.address.street} {listing.address.buildingNumber}{listing.address.apartmentNumber && `, кв. ${listing.address.apartmentNumber}`}</span>
                </div>
              </div>
 
              {/* Quick Info */}
              <div className="flex flex-wrap gap-6 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2"><Home className="h-5 w-5 text-muted-foreground" /><span className="font-medium">{listing.features.rooms} кімн.</span></div>
                <div className="flex items-center gap-2"><Maximize className="h-5 w-5 text-muted-foreground" /><span className="font-medium">{listing.features.area} м²</span></div>
                {listing.address.floor && (
                  <div className="flex items-center gap-2"><span className="text-muted-foreground">Поверх:</span><span className="font-medium">{listing.address.floor} з {listing.address.totalFloors}</span></div>
                )}
                <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-muted-foreground" /><span className="text-sm text-muted-foreground">Додано {formatDate(listing.createdAt)}</span></div>
              </div>
 
              {/* Description */}
              <Card>
                <CardHeader><CardTitle>Опис</CardTitle></CardHeader>
                <CardContent><p className="whitespace-pre-line text-muted-foreground">{listing.description}</p></CardContent>
              </Card>
 
              {/* Features */}
              <Card>
                <CardHeader><CardTitle>Характеристики</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3"><Hammer className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm text-muted-foreground">Стан</p><p className="font-medium">{conditionLabels[listing.features.condition]}</p></div></div>
                    <div className="flex items-center gap-3"><ThermometerSun className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm text-muted-foreground">Опалення</p><p className="font-medium">{heatingLabels[listing.features.heatingType]}</p></div></div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-3">
                    {listing.features.hasBalcony && <Badge variant="outline">Балкон</Badge>}
                    {listing.features.hasParking && <Badge variant="outline"><Car className="h-3 w-3 mr-1" />Паркінг</Badge>}
                    {listing.features.hasFurniture && <Badge variant="outline"><Sofa className="h-3 w-3 mr-1" />З меблями</Badge>}
                    {listing.features.hasAppliances && <Badge variant="outline">З технікою</Badge>}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-3">
                    <Badge variant={listing.features.petsAllowed ? "default" : "secondary"} className={cn("gap-1", listing.features.petsAllowed ? "bg-emerald-500" : "bg-destructive/10 text-destructive")}>
                      <Dog className="h-3 w-3" />{listing.features.petsAllowed ? "Можна з тваринами" : "Без тварин"}
                    </Badge>
                    <Badge variant={listing.features.childrenAllowed ? "default" : "secondary"} className={cn("gap-1", listing.features.childrenAllowed ? "bg-emerald-500" : "bg-destructive/10 text-destructive")}>
                      <Baby className="h-3 w-3" />{listing.features.childrenAllowed ? "Можна з дітьми" : "Без дітей"}
                    </Badge>
                    <Badge variant={listing.features.smokingAllowed ? "default" : "secondary"} className={cn("gap-1", !listing.features.smokingAllowed ? "bg-emerald-500" : "bg-amber-500")}>
                      <Cigarette className="h-3 w-3" />{listing.features.smokingAllowed ? "Можна палити" : "Не палити"}
                    </Badge>
                  </div>
                  <Separator className="my-4" />
                  {/* PDF Contract Template */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">📄 Шаблон договору</h4>
                    <p className="text-xs text-muted-foreground">Завантажте типовий договір оренди для підготовки до угоди</p>
                    <a href="/contract-template.pdf" download="DirectHomi-договір-оренди.pdf" className="flex w-full items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10">
                      Завантажити шаблон договору оренди
                    </a>
                    <p className="text-xs text-muted-foreground text-center">DirectHomi не є стороною угоди. Договір укладається напряму між власником та орендарем.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
 
            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(listing.price)}
                      {listing.type === "rent" && <span className="text-lg font-normal text-muted-foreground">/міс</span>}
                    </p>
                    {listing.deposit && <p className="mt-1 text-sm text-muted-foreground">Депозит: {formatPrice(listing.deposit)}</p>}
                    {listing.commission && <p className="text-sm text-muted-foreground">Комісія: {formatPrice(listing.commission)}</p>}
                  </div>
                  <Separator className="my-4" />
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Власник</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Users className="h-5 w-5" /></div>
                      <div>
                        <p className="font-medium">{listing.ownerName}</p>
                        {owner && <p className="text-xs text-muted-foreground">Відповідає на {owner.responseRate}% заявок</p>}
                      </div>
                    </div>
                  </div>
                  {canApply ? (
                    <Button className="w-full" size="lg" onClick={() => setIsApplicationOpen(true)}>
                      <Send className="mr-2 h-4 w-4" />Подати заявку
                    </Button>
                  ) : applicationSubmitted ? (
                    <Alert className="bg-emerald-50 border-emerald-200">
                      <AlertDescription className="text-emerald-700">Заявку подано! Очікуйте відповіді власника протягом 72 годин.</AlertDescription>
                    </Alert>
                  ) : !user ? (
                    <div className="space-y-2">
                      <Button className="w-full" size="lg" asChild><Link href="/login">Увійти для подачі заявки</Link></Button>
                      <p className="text-center text-xs text-muted-foreground">або <Link href="/register" className="text-primary underline">зареєструватись</Link></p>
                    </div>
                  ) : user.role === "owner" ? (
                    <Alert><AlertTriangle className="h-4 w-4" /><AlertDescription>Власники не можуть подавати заявки на оголошення</AlertDescription></Alert>
                  ) : null}
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setIsSaved(!isSaved)}>
                      <Heart className={cn("mr-2 h-4 w-4", isSaved && "fill-current text-destructive")} />{isSaved ? "Збережено" : "Зберегти"}
                    </Button>
                    <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                  </div>
                  <Separator className="my-4" />
                  <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                    <Flag className="mr-2 h-4 w-4" />Поскаржитись на оголошення
                  </Button>
                </CardContent>
              </Card>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">DirectHomi не є стороною угоди між вами та власником. Перевіряйте всі документи та умови перед укладанням договору.</AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <ApplicationForm listing={listing} open={isApplicationOpen} onOpenChange={setIsApplicationOpen} onSubmit={handleApplicationSubmit} />
    </div>
  );
}