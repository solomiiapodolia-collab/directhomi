"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  Upload, 
  Camera, 
  Phone, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  User,
  Smartphone,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type VerificationStep = "documents" | "selfie" | "phone" | "complete";

export default function VerificationPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<VerificationStep>("documents");
  const [isLoading, setIsLoading] = useState(false);
  
  // Document upload state
  const [documentType, setDocumentType] = useState<"passport" | "id_card">("passport");
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  
  // Selfie state
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  
  // Phone verification state
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  
  // Agreement state
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  const steps = [
    { id: "documents", label: "Документ", icon: FileText },
    { id: "selfie", label: "Селфі", icon: User },
    { id: "phone", label: "Телефон", icon: Smartphone },
    { id: "complete", label: "Готово", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfieImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendVerificationCode = async () => {
    setIsLoading(true);
    // Simulate sending SMS
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCodeSent(true);
    setIsLoading(false);
  };

  const verifyCode = async () => {
    setIsLoading(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentStep("complete");
    setIsLoading(false);
  };

  const completeVerification = async () => {
    setIsLoading(true);
    // Simulate submitting verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update user as verified
    updateUser({ isVerified: true });
    
    // Redirect to owner dashboard
    router.push("/dashboard/owner");
  };

  const canProceed = () => {
    switch (currentStep) {
      case "documents":
        return documentImage !== null;
      case "selfie":
        return selfieImage !== null;
      case "phone":
        return verificationCode.length === 6;
      case "complete":
        return agreeToTerms && agreeToPrivacy;
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id as VerificationStep);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id as VerificationStep);
    }
  };

  return (
    <DashboardLayout role="owner">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Верифікація власника
          </h1>
          <p className="text-muted-foreground">
            Підтвердіть вашу особу, щоб публікувати оголошення
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
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
                    className={`text-xs mt-1 ${
                      isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
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
            {/* Step 1: Document Upload */}
            {currentStep === "documents" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">
                    Завантажте документ
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Завантажте фото паспорта або ID-картки для підтвердження особи
                  </p>
                </div>

                {/* Document Type Selection */}
                <div className="flex gap-4 justify-center">
                  <Button
                    type="button"
                    variant={documentType === "passport" ? "default" : "outline"}
                    onClick={() => setDocumentType("passport")}
                  >
                    Паспорт
                  </Button>
                  <Button
                    type="button"
                    variant={documentType === "id_card" ? "default" : "outline"}
                    onClick={() => setDocumentType("id_card")}
                  >
                    ID-картка
                  </Button>
                </div>

                {/* Upload Area */}
                <div className="relative">
                  {documentImage ? (
                    <div className="relative aspect-[3/2] rounded-lg overflow-hidden border">
                      <Image
                        src={documentImage}
                        alt="Документ"
                        fill
                        className="object-contain bg-muted"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-4 right-4"
                        onClick={() => setDocumentImage(null)}
                      >
                        Змінити
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[3/2] border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium">
                        Натисніть для завантаження
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        JPG, PNG до 10MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleDocumentUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Requirements */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-sm mb-2">Вимоги до фото:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      Всі дані чітко видно
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      Без відблисків та тіней
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      Документ не обрізаний
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Selfie with Document */}
            {currentStep === "selfie" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">
                    Селфі з документом
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Зробіть фото, тримаючи документ біля обличчя
                  </p>
                </div>

                {/* Preview */}
                <div className="relative">
                  {selfieImage ? (
                    <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-lg overflow-hidden border">
                      <Image
                        src={selfieImage}
                        alt="Селфі"
                        fill
                        className="object-cover"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-4 right-4"
                        onClick={() => setSelfieImage(null)}
                      >
                        Змінити
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[3/4] max-w-sm mx-auto border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Camera className="w-10 h-10 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium">
                        Зробити фото
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        або завантажити з галереї
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={handleSelfieUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Example */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-sm mb-2">Як правильно:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      Обличчя та документ чітко видно
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      Гарне освітлення
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      Без сонячних окулярів чи головних уборів
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 3: Phone Verification */}
            {currentStep === "phone" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">
                    Підтвердження телефону
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Введіть номер телефону для отримання SMS-коду
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-4">
                  {!codeSent ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Номер телефону</Label>
                        <div className="flex gap-2">
                          <div className="flex items-center px-3 bg-muted rounded-lg border">
                            <span className="text-sm font-medium">+380</span>
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="XX XXX XX XX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={sendVerificationCode}
                        disabled={phoneNumber.length < 9 || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Надсилаємо...
                          </>
                        ) : (
                          <>
                            <Phone className="w-4 h-4 mr-2" />
                            Отримати код
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Код надіслано на номер
                        </p>
                        <p className="font-medium">+380 {phoneNumber}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="code">Код з SMS</Label>
                        <Input
                          id="code"
                          type="text"
                          placeholder="000000"
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                          className="text-center text-2xl tracking-widest"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={verifyCode}
                        disabled={verificationCode.length !== 6 || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Перевіряємо...
                          </>
                        ) : (
                          "Підтвердити"
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setCodeSent(false)}
                      >
                        Змінити номер
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Complete */}
            {currentStep === "complete" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h2 className="text-lg font-semibold mb-2">
                    Майже готово!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Прочитайте та погодьтесь з умовами використання
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm">Документ завантажено</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm">Селфі з документом завантажено</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm">Телефон підтверджено: +380 {phoneNumber}</span>
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      Я погоджуюсь з{" "}
                      <a href="/terms" className="text-primary underline">
                        Умовами використання
                      </a>{" "}
                      та{" "}
                      <a href="/rules" className="text-primary underline">
                        Правилами платформи
                      </a>
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="privacy"
                      checked={agreeToPrivacy}
                      onCheckedChange={(checked) => setAgreeToPrivacy(checked as boolean)}
                    />
                    <label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                      Я погоджуюсь на обробку персональних даних згідно з{" "}
                      <a href="/privacy" className="text-primary underline">
                        Політикою конфіденційності
                      </a>
                    </label>
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Ваші дані будуть перевірені протягом 24 годин. 
                    Ви отримаєте повідомлення про результат верифікації.
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={completeVerification}
                  disabled={!agreeToTerms || !agreeToPrivacy || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Надсилаємо на перевірку...
                    </>
                  ) : (
                    <>
                      Завершити верифікацію
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep !== "complete" && (
          <div className="flex justify-between mt-6">
            <Button
              variant="ghost"
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button
              onClick={goToNextStep}
              disabled={!canProceed()}
            >
              Далі
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
