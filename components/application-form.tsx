"use client";

import { useState } from "react";
import { CalendarIcon, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ApplicationFormData, Listing } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

interface ApplicationFormProps {
  listing: Listing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ApplicationFormData) => void;
}

const leaseDurations = [
  { value: "1-3 months", label: "1-3 місяці" },
  { value: "3-6 months", label: "3-6 місяців" },
  { value: "6-12 months", label: "6-12 місяців" },
  { value: "12+ months", label: "12+ місяців" },
];

const employmentOptions = [
  { value: "employed", label: "Найманий працівник" },
  { value: "self-employed", label: "Підприємець / ФОП" },
  { value: "student", label: "Студент" },
  { value: "retired", label: "Пенсіонер" },
  { value: "other", label: "Інше" },
];

const incomeRanges = [
  { value: "до 20000", label: "До 20 000 грн" },
  { value: "20000-40000", label: "20 000 - 40 000 грн" },
  { value: "40000-60000", label: "40 000 - 60 000 грн" },
  { value: "60000-80000", label: "60 000 - 80 000 грн" },
  { value: "80000+", label: "Понад 80 000 грн" },
];

export function ApplicationForm({ listing, open, onOpenChange, onSubmit }: ApplicationFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    phone: user?.phone || "",
    email: user?.email || "",
    occupantsCount: 1,
    hasChildren: false,
    hasPets: false,
    employment: "employed",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onSubmit(formData as ApplicationFormData);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const updateField = <K extends keyof ApplicationFormData>(
    field: K,
    value: ApplicationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Подати заявку</DialogTitle>
          <DialogDescription>
            {listing.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Platform Disclaimer */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              DirectHomi не є стороною угоди. Ваші дані будуть передані власнику для розгляду заявки.
            </AlertDescription>
          </Alert>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Контактна інформація</h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Повне ім&apos;я *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName || ""}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+380"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Move-in Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Деталі заселення</h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="moveInDate">Бажана дата заселення *</Label>
                <div className="relative">
                  <Input
                    id="moveInDate"
                    type="date"
                    onChange={(e) => updateField("moveInDate", new Date(e.target.value))}
                    required
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseDuration">Бажаний термін оренди *</Label>
                <Select
                  value={formData.leaseDuration}
                  onValueChange={(value) => updateField("leaseDuration", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть термін" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaseDurations.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupantsCount">Кількість мешканців *</Label>
              <Input
                id="occupantsCount"
                type="number"
                min={1}
                max={10}
                value={formData.occupantsCount || 1}
                onChange={(e) => updateField("occupantsCount", parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasChildren"
                  checked={formData.hasChildren}
                  onCheckedChange={(checked) => updateField("hasChildren", !!checked)}
                />
                <Label htmlFor="hasChildren" className="text-sm font-normal">
                  Є діти
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasPets"
                  checked={formData.hasPets}
                  onCheckedChange={(checked) => updateField("hasPets", !!checked)}
                />
                <Label htmlFor="hasPets" className="text-sm font-normal">
                  Є домашні тварини
                </Label>
              </div>

              {formData.hasPets && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="petDetails">Деталі про тварину</Label>
                  <Input
                    id="petDetails"
                    value={formData.petDetails || ""}
                    onChange={(e) => updateField("petDetails", e.target.value)}
                    placeholder="Вид, порода, вік..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Employment */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Зайнятість</h4>
            
            <RadioGroup
              value={formData.employment}
              onValueChange={(value) => updateField("employment", value as ApplicationFormData["employment"])}
              className="grid gap-2"
            >
              {employmentOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="employmentDetails">Деталі зайнятості (необов&apos;язково)</Label>
              <Input
                id="employmentDetails"
                value={formData.employmentDetails || ""}
                onChange={(e) => updateField("employmentDetails", e.target.value)}
                placeholder="Назва компанії, посада..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Щомісячний дохід (необов&apos;язково)</Label>
              <Select
                value={formData.monthlyIncome}
                onValueChange={(value) => updateField("monthlyIncome", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть діапазон" />
                </SelectTrigger>
                <SelectContent>
                  {incomeRanges.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Повідомлення для власника *</Label>
            <Textarea
              id="message"
              value={formData.message || ""}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Розкажіть про себе, чому вас цікавить це житло, будь-які питання до власника..."
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Скасувати
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Відправляємо..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Подати заявку
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
