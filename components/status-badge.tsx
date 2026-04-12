import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApplicationStatus, ListingStatus, VerificationStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: ApplicationStatus | ListingStatus | VerificationStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
  // Application statuses
  pending: { label: "Очікує", variant: "outline", className: "border-amber-500 text-amber-600 bg-amber-50" },
  accepted: { label: "Прийнято", variant: "default", className: "bg-emerald-500 hover:bg-emerald-600" },
  rejected: { label: "Відхилено", variant: "destructive" },
  maybe: { label: "Можливо", variant: "secondary", className: "bg-blue-100 text-blue-700" },
  expired: { label: "Час вичерпано", variant: "secondary", className: "bg-gray-200 text-gray-600" },
  
  // Listing statuses
  active: { label: "Активне", variant: "default", className: "bg-emerald-500 hover:bg-emerald-600" },
  pending_moderation: { label: "На модерації", variant: "outline", className: "border-amber-500 text-amber-600 bg-amber-50" },
  hidden: { label: "Приховано", variant: "secondary" },
  archived: { label: "В архіві", variant: "secondary" },
  
  // Verification statuses
  unverified: { label: "Не верифіковано", variant: "outline", className: "border-gray-400 text-gray-600" },
  verified: { label: "Верифіковано", variant: "default", className: "bg-emerald-500 hover:bg-emerald-600" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "secondary" as const };
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
