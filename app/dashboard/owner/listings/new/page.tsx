"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Plus,
  Home,
  MapPin,
  DollarSign,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  GripVertical
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropertyType, ListingType, Amenity, CITIES, DISTRICTS } from "@/lib/types";

type Step = "type" | "location" | "details" | "photos" | "description" | "review";

const AMENITIES: { id: Amenity; label: string }[] = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "parking", label: "Парковка" },
  { id: "balcony", label: "Балкон" },
  { id: "elevator", label: "Ліфт" },
  { id: "pets_allowed", label: "Можна з тваринами" },
  { id: "washing_machine", label: "Пральна машина" },
  { id: "dishwasher", label: "Посудомийка" },
  { id: "air_conditioning", label: "Кондиціонер" },
  { id: "heating", label: "Автономне опалення" },
  { id: "furnished", label: "Меблі" },
  { id: "kitchen_appliances", label: "Кухонна техніка" },
  { id: "security", label: "Охорона / консьєрж" },
];

export default function NewListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("type");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [listingType, setListingType] = useState<ListingType>("rent");
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [rooms, setRooms] = useState("");
  const [area, setArea] = useState("");
  const [floor, setFloor] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [utilities, setUtilities] = useState("");
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [agreeToRules, setAgreeToRules] = useState(false);

  const steps = [
    { id: "type", label: "Тип", icon: Home },
    { id: "location", label: "Локація", icon: MapPin },
    { id: "details", label: "Деталі", icon: FileText },
    { id: "photos", label: "Фото", icon: ImageIcon },
    { id: "description", label: "Опис", icon: FileText },
    { id: "review", label: "Перегляд", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (images.length < 11) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImages(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: Amenity) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "type":
        return !!listingType && !!propertyType;
      case "location":
        return !!city && !!address;
      case "details":
        return !!rooms && !!area && !!price;
      case "photos":
        return images.length >= 3;
      case "description":
        return !!title && description.length >= 100;
      case "review":
        return agreeToRules;
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id as Step);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id as Step);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push("/dashboard/owner?listing=created");
  };

  const availableDistricts = city ? DISTRICTS[city] || [] : [];

  return (
    <DashboardLayout role="owner">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/owner">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Нове оголошення</h1>
            <p className="text-muted-foreground">
              Заповніть інформацію про вашу нерухомість
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => isCompleted && setCurrentStep(step.id as Step)}
                  disabled={!isCompleted}
                  className={`flex flex-col items-center ${isCompleted ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 whitespace-nowrap ${
                      isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 lg:w-16 h-0.5 mx-1 ${
                      index < currentStepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Type */}
            {currentStep === "type" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Тип оголошення</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Оберіть тип угоди та нерухомості
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Тип угоди</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setListingType("rent")}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          listingType === "rent"
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-muted-foreground/50"
                        }`}
                      >
                        <p className="font-medium">Оренда</p>
                        <p className="text-sm text-muted-foreground">
                          Здати в оренду
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setListingType("sale")}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          listingType === "sale"
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-muted-foreground/50"
                        }`}
                      >
                        <p className="font-medium">Продаж</p>
                        <p className="text-sm text-muted-foreground">
                          Продати нерухомість
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Тип нерухомості</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { id: "apartment", label: "Квартира" },
                        { id: "house", label: "Будинок" },
                        { id: "room", label: "Кімната" },
                        { id: "studio", label: "Студія" },
                        { id: "office", label: "Офіс" },
                        { id: "commercial", label: "Комерційна" },
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setPropertyType(type.id as PropertyType)}
                          className={`p-4 rounded-lg border-2 text-center transition-colors ${
                            propertyType === type.id
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-muted-foreground/50"
                          }`}
                        >
                          <p className="font-medium">{type.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === "location" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Розташування</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Вкажіть місцезнаходження нерухомості
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Місто *</Label>
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть місто" />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Район</Label>
                      <Select 
                        value={district} 
                        onValueChange={setDistrict}
                        disabled={!city || availableDistricts.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть район" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDistricts.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Адреса *</Label>
                    <Input
                      id="address"
                      placeholder="вул. Хрещатик, 1"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Точна адреса буде показана тільки після прийняття заявки
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === "details" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Характеристики</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Вкажіть основні параметри нерухомості
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rooms">Кімнат *</Label>
                      <Select value={rooms} onValueChange={setRooms}>
                        <SelectTrigger>
                          <SelectValue placeholder="Кількість" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, "6+"].map((r) => (
                            <SelectItem key={r} value={String(r)}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Площа (м²) *</Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder="50"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="floor">Поверх</Label>
                      <Input
                        id="floor"
                        type="number"
                        placeholder="5"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalFloors">Всього поверхів</Label>
                      <Input
                        id="totalFloors"
                        type="number"
                        placeholder="9"
                        value={totalFloors}
                        onChange={(e) => setTotalFloors(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Ціна (₴{listingType === "rent" ? "/міс" : ""}) *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="15000"
                          className="pl-9"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    {listingType === "rent" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="deposit">Застава (₴)</Label>
                          <Input
                            id="deposit"
                            type="number"
                            placeholder="15000"
                            value={deposit}
                            onChange={(e) => setDeposit(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="utilities">Комунальні (₴/міс)</Label>
                          <Input
                            id="utilities"
                            type="number"
                            placeholder="2000"
                            value={utilities}
                            onChange={(e) => setUtilities(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Зручності</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {AMENITIES.map((amenity) => (
                        <label
                          key={amenity.id}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                            amenities.includes(amenity.id)
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-muted-foreground/50"
                          }`}
                        >
                          <Checkbox
                            checked={amenities.includes(amenity.id)}
                            onCheckedChange={() => toggleAmenity(amenity.id)}
                          />
                          <span className="text-sm">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Photos */}
            {currentStep === "photos" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Фотографії</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Завантажте від 3 до 11 фото вашої нерухомості
                  </p>
                </div>

                {/* Upload Area */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border group"
                    >
                      <Image
                        src={image}
                        alt={`Фото ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-8 h-8"
                        >
                          <GripVertical className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="w-8 h-8"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                          Головне фото
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {images.length < 11 && (
                    <label className="flex flex-col items-center justify-center aspect-[4/3] border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Додати фото
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Photo Count */}
                <div className="flex items-center justify-between text-sm">
                  <span className={images.length < 3 ? "text-destructive" : "text-muted-foreground"}>
                    Завантажено: {images.length} / 11
                  </span>
                  {images.length < 3 && (
                    <span className="text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Мінімум 3 фото
                    </span>
                  )}
                </div>

                {/* Tips */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-sm mb-2">Поради для гарних фото:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      Фотографуйте при денному світлі
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      Покажіть всі кімнати та простори
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      Приберіть особисті речі перед зйомкою
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 5: Description */}
            {currentStep === "description" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Заголовок та опис</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Напишіть привабливий заголовок та детальний опис
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Заголовок *</Label>
                    <Input
                      id="title"
                      placeholder="Затишна 2-кімнатна квартира в центрі"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {title.length} / 100
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Опис *</Label>
                    <Textarea
                      id="description"
                      placeholder="Опишіть вашу нерухомість детально. Вкажіть особливості, переваги розташування, стан ремонту, що входить в оренду тощо."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[200px]"
                      maxLength={2000}
                    />
                    <div className="flex justify-between text-xs">
                      <span className={description.length < 100 ? "text-destructive" : "text-muted-foreground"}>
                        Мінімум 100 символів
                      </span>
                      <span className="text-muted-foreground">
                        {description.length} / 2000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {currentStep === "review" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Перегляд оголошення</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Перевірте інформацію перед публікацією
                  </p>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  {/* Photos Preview */}
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(0, 4).map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Фото ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {index === 3 && images.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-medium">
                              +{images.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold">{title}</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Тип:</span>
                        <span>{listingType === "rent" ? "Оренда" : "Продаж"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Нерухомість:</span>
                        <span>{propertyType === "apartment" ? "Квартира" : propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Місто:</span>
                        <span>{city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Район:</span>
                        <span>{district || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Кімнат:</span>
                        <span>{rooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Площа:</span>
                        <span>{area} м²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Поверх:</span>
                        <span>{floor ? `${floor}/${totalFloors || "?"}` : "—"}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-muted-foreground">Ціна:</span>
                        <span className="text-primary">
                          {parseInt(price).toLocaleString()} ₴{listingType === "rent" ? "/міс" : ""}
                        </span>
                      </div>
                    </div>
                    {amenities.length > 0 && (
                      <div className="pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Зручності: </span>
                        <span className="text-sm">
                          {amenities.map(a => AMENITIES.find(am => am.id === a)?.label).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Moderation Notice */}
                  <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground mb-1">
                        Оголошення пройде модерацію
                      </p>
                      <p className="text-muted-foreground">
                        Перші 3 оголошення кожного власника перевіряються модераторами 
                        протягом 24 годин перед публікацією.
                      </p>
                    </div>
                  </div>

                  {/* Agreement */}
                  <div className="flex items-start gap-3 pt-4 border-t">
                    <Checkbox
                      id="rules"
                      checked={agreeToRules}
                      onCheckedChange={(checked) => setAgreeToRules(checked as boolean)}
                    />
                    <label htmlFor="rules" className="text-sm leading-relaxed cursor-pointer">
                      Я підтверджую, що є власником цієї нерухомості та погоджуюсь з{" "}
                      <a href="/rules" className="text-primary underline">
                        Правилами розміщення оголошень
                      </a>
                      . Я зобов&apos;язуюсь відповідати на заявки протягом 72 годин.
                    </label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 space-y-4">

          {/* Owner Agreement Checkbox — shown only on review step */}
          {currentStep === "review" && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">⚖️ Підтвердження перед публікацією</p>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="ownerAgreement"
                  checked={formData.ownerAgreement || false}
                  onCheckedChange={(checked) =>
                    setFormData((prev: typeof formData) => ({ ...prev, ownerAgreement: !!checked }))
                  }
                  className="mt-0.5"
                />
                <label htmlFor="ownerAgreement" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  Я підтверджую, що є власником цього об'єкта або маю законне право його представляти.
                  Вся інформація в оголошенні є правдивою та актуальною.
                  Я погоджуюсь з <a href="/terms" className="text-primary underline">Умовами використання</a> платформи DirectHomi.
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                DirectHomi не є стороною угоди. Всі операції здійснюються напряму між власником та орендарем.
              </p>
            </div>
          )}

          <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          
          {currentStep === "review" ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting || !formData.ownerAgreement}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Публікуємо...
                </>
              ) : (
                <>
                  Опублікувати
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={goToNextStep}
              disabled={!canProceed()}
            >
              Далі
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
