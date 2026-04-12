// DirectHomi Platform Types

// User Roles
export type UserRole = "guest" | "seeker" | "owner" | "admin";

// Subscription Tiers for Seekers
export type SubscriptionTier = "free" | "basic" | "pro";

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number; // UAH
  applicationsPerDay: number;
  features: string[];
}

// Verification Status for Owners
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  avatarUrl?: string;
}

export interface Seeker extends User {
  role: "seeker";
  subscription: SubscriptionTier;
  applicationsToday: number;
  savedListings: string[];
}

export interface Owner extends User {
  role: "owner";
  verificationStatus: VerificationStatus;
  verificationDocuments?: {
    passportPhotoUrl?: string;
    selfieWithDocumentUrl?: string;
  };
  listingsCount: number;
  moderatedListingsCount: number; // First 3 need moderation
  responseRate: number; // Percentage
  visibilityPenalty: boolean; // True if ignoring >30% applications
}

export interface Admin extends User {
  role: "admin";
  permissions: string[];
}

// Property Types
export type PropertyType = "apartment" | "house" | "room" | "commercial";
export type ListingType = "rent" | "sale";
export type ListingStatus = "active" | "pending_moderation" | "rejected" | "archived" | "hidden";

export interface PropertyAddress {
  city: string;
  district: string;
  street: string;
  buildingNumber: string;
  apartmentNumber?: string;
  floor?: number;
  totalFloors?: number;
}

export interface PropertyFeatures {
  rooms: number;
  area: number; // square meters
  hasBalcony: boolean;
  hasParking: boolean;
  hasFurniture: boolean;
  hasAppliances: boolean;
  petsAllowed: boolean;
  childrenAllowed: boolean;
  smokingAllowed: boolean;
  heatingType: "central" | "individual" | "none";
  condition: "new" | "renovated" | "good" | "needs_repair";
}

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  status: ListingStatus;
  type: ListingType;
  propertyType: PropertyType;
  title: string;
  description: string;
  price: number; // UAH per month for rent, total for sale
  deposit?: number;
  commission?: number;
  address: PropertyAddress;
  features: PropertyFeatures;
  photos: string[]; // Max 11 photos
  createdAt: Date;
  updatedAt: Date;
  viewsCount: number;
  applicationsCount: number;
  isOwnerVerified: boolean;
}

// Application System
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "maybe" | "expired";

export interface ApplicationFormData {
  // Required fields
  fullName: string;
  phone: string;
  email: string;
  moveInDate: Date;
  leaseDuration: string; // "1-3 months", "3-6 months", "6-12 months", "12+ months"
  occupantsCount: number;
  hasChildren: boolean;
  hasPets: boolean;
  petDetails?: string;
  employment: "employed" | "self-employed" | "student" | "retired" | "other";
  employmentDetails?: string;
  monthlyIncome?: string;
  message: string;
}

export interface Application {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPhoto: string;
  seekerId: string;
  seekerName: string;
  ownerId: string;
  status: ApplicationStatus;
  formData: ApplicationFormData;
  createdAt: Date;
  respondedAt?: Date;
  ownerNote?: string;
  responseDeadline: Date; // 72 hours from creation
}

// Chat System
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
  readAt?: Date;
}

export interface Chat {
  id: string;
  applicationId: string;
  listingId: string;
  listingTitle: string;
  seekerId: string;
  seekerName: string;
  ownerId: string;
  ownerName: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
  unreadCount: number;
}

// Complaints/Reports
export type ComplaintReason =
  | "fake_listing"
  | "misleading_info"
  | "scam"
  | "inappropriate_content"
  | "harassment"
  | "other";

export type ComplaintStatus = "pending" | "investigating" | "resolved" | "dismissed";

export interface Complaint {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: "listing" | "user" | "message";
  targetId: string;
  reason: ComplaintReason;
  description: string;
  status: ComplaintStatus;
  createdAt: Date;
  resolvedAt?: Date;
  adminNote?: string;
}

// Admin Moderation
export interface ModerationItem {
  id: string;
  type: "listing" | "owner_verification" | "complaint";
  itemId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  adminNote?: string;
}

// Filter/Search
export interface ListingFilters {
  city?: string;
  district?: string;
  type?: ListingType;
  propertyType?: PropertyType;
  priceMin?: number;
  priceMax?: number;
  roomsMin?: number;
  roomsMax?: number;
  areaMin?: number;
  areaMax?: number;
  hasBalcony?: boolean;
  hasParking?: boolean;
  hasFurniture?: boolean;
  petsAllowed?: boolean;
  verifiedOwnerOnly?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const CITIES = [
  "Київ", "Львів", "Одеса", "Харків",
  "Дніпро", "Запоріжжя", "Вінниця",
  "Полтава", "Черкаси", "Ужгород"
]

export const DISTRICTS: Record<string, string[]> = {
  "Київ": ["Шевченківський", "Подільський", "Оболонський", "Печерський", "Голосіївський"],
  "Львів": ["Галицький", "Залізничний", "Личаківський", "Сихівський"],
  "Одеса": ["Приморський", "Київський", "Малиновський"],
  "Харків": ["Холодногірський", "Шевченківський", "Немишлянський"],
  "Дніпро": ["Амур-Нижньодніпровський", "Індустріальний", "Соборний"]
}
