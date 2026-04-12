import type {
  Listing,
  Application,
  Seeker,
  Owner,
  Chat,
  Message,
  Complaint,
  SubscriptionPlan,
} from "./types";

// Subscription Plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    tier: "free",
    name: "Безкоштовний",
    price: 0,
    applicationsPerDay: 3,
    features: [
      "До 3 заявок на день",
      "Перегляд оголошень",
      "Базовий пошук",
    ],
  },
  {
    tier: "basic",
    name: "Базовий",
    price: 149,
    applicationsPerDay: 10,
    features: [
      "До 10 заявок на день",
      "Розширений пошук",
      "Збереження оголошень",
      "Сповіщення про нові оголошення",
    ],
  },
  {
    tier: "pro",
    name: "Професійний",
    price: 299,
    applicationsPerDay: 999,
    features: [
      "Необмежені заявки",
      "Пріоритетний показ заявок",
      "Розширена аналітика",
      "Персональна підтримка",
      "Ранній доступ до нових оголошень",
    ],
  },
];

// Ukrainian Cities
export const cities = [
  "Київ",
  "Львів",
  "Одеса",
  "Харків",
  "Дніпро",
  "Запоріжжя",
  "Вінниця",
  "Полтава",
  "Чернігів",
  "Івано-Франківськ",
];

export const kyivDistricts = [
  "Шевченківський",
  "Печерський",
  "Подільський",
  "Голосіївський",
  "Святошинський",
  "Солом'янський",
  "Оболонський",
  "Деснянський",
  "Дніпровський",
  "Дарницький",
];

// Mock Owners
export const mockOwners: Owner[] = [
  {
    id: "owner-1",
    email: "ivan.petrenko@example.com",
    phone: "+380501234567",
    firstName: "Іван",
    lastName: "Петренко",
    role: "owner",
    createdAt: new Date("2024-01-15"),
    verificationStatus: "verified",
    listingsCount: 3,
    moderatedListingsCount: 3,
    responseRate: 95,
    visibilityPenalty: false,
  },
  {
    id: "owner-2",
    email: "maria.koval@example.com",
    phone: "+380679876543",
    firstName: "Марія",
    lastName: "Коваль",
    role: "owner",
    createdAt: new Date("2024-02-20"),
    verificationStatus: "verified",
    listingsCount: 2,
    moderatedListingsCount: 2,
    responseRate: 88,
    visibilityPenalty: false,
  },
  {
    id: "owner-3",
    email: "oleksandr.shevchenko@example.com",
    phone: "+380931112233",
    firstName: "Олександр",
    lastName: "Шевченко",
    role: "owner",
    createdAt: new Date("2024-03-10"),
    verificationStatus: "pending",
    listingsCount: 1,
    moderatedListingsCount: 0,
    responseRate: 0,
    visibilityPenalty: false,
  },
];

// Mock Seekers
export const mockSeekers: Seeker[] = [
  {
    id: "seeker-1",
    email: "anna.bondar@example.com",
    phone: "+380504445566",
    firstName: "Анна",
    lastName: "Бондар",
    role: "seeker",
    createdAt: new Date("2024-03-01"),
    subscription: "basic",
    applicationsToday: 2,
    savedListings: ["listing-1", "listing-3"],
  },
  {
    id: "seeker-2",
    email: "dmytro.lysenko@example.com",
    phone: "+380677778899",
    firstName: "Дмитро",
    lastName: "Лисенко",
    role: "seeker",
    createdAt: new Date("2024-03-15"),
    subscription: "free",
    applicationsToday: 3,
    savedListings: [],
  },
  {
    id: "seeker-3",
    email: "kateryna.melnyk@example.com",
    phone: "+380939990011",
    firstName: "Катерина",
    lastName: "Мельник",
    role: "seeker",
    createdAt: new Date("2024-04-01"),
    subscription: "pro",
    applicationsToday: 15,
    savedListings: ["listing-2", "listing-4", "listing-5"],
  },
];

// Mock Listings
export const mockListings: Listing[] = [
  {
    id: "listing-1",
    ownerId: "owner-1",
    ownerName: "Іван Петренко",
    status: "active",
    type: "rent",
    propertyType: "apartment",
    title: "Затишна 2-кімнатна квартира в центрі",
    description: "Простора квартира з сучасним ремонтом у самому серці Києва. Поруч станція метро, парк, супермаркети. Ідеально підходить для молодої пари або одного мешканця. Всі комунальні платежі включені в оренду.",
    price: 18000,
    deposit: 18000,
    address: {
      city: "Київ",
      district: "Шевченківський",
      street: "вул. Володимирська",
      buildingNumber: "45",
      apartmentNumber: "12",
      floor: 4,
      totalFloors: 9,
    },
    features: {
      rooms: 2,
      area: 56,
      hasBalcony: true,
      hasParking: false,
      hasFurniture: true,
      hasAppliances: true,
      petsAllowed: false,
      childrenAllowed: true,
      smokingAllowed: false,
      heatingType: "central",
      condition: "renovated",
    },
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-03-20"),
    viewsCount: 245,
    applicationsCount: 12,
    isOwnerVerified: true,
  },
  {
    id: "listing-2",
    ownerId: "owner-1",
    ownerName: "Іван Петренко",
    status: "active",
    type: "rent",
    propertyType: "apartment",
    title: "Студія з панорамними вікнами на Печерську",
    description: "Сучасна студія в новобудові з неймовірним видом на місто. Висока стеля, панорамне скління, дизайнерський ремонт. Є підземний паркінг (оплачується окремо).",
    price: 25000,
    deposit: 50000,
    address: {
      city: "Київ",
      district: "Печерський",
      street: "вул. Кловський узвіз",
      buildingNumber: "7А",
      apartmentNumber: "187",
      floor: 21,
      totalFloors: 25,
    },
    features: {
      rooms: 1,
      area: 42,
      hasBalcony: true,
      hasParking: true,
      hasFurniture: true,
      hasAppliances: true,
      petsAllowed: true,
      childrenAllowed: true,
      smokingAllowed: false,
      heatingType: "individual",
      condition: "new",
    },
    photos: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    ],
    createdAt: new Date("2024-03-22"),
    updatedAt: new Date("2024-03-22"),
    viewsCount: 189,
    applicationsCount: 8,
    isOwnerVerified: true,
  },
  {
    id: "listing-3",
    ownerId: "owner-2",
    ownerName: "Марія Коваль",
    status: "active",
    type: "rent",
    propertyType: "house",
    title: "Приватний будинок у передмісті Львова",
    description: "Затишний будинок з власним двором та садом. 3 спальні, 2 санвузли, простора вітальня з каміном. Тиха локація, але всього 15 хвилин до центру.",
    price: 35000,
    deposit: 35000,
    commission: 17500,
    address: {
      city: "Львів",
      district: "Шевченківський",
      street: "вул. Садова",
      buildingNumber: "23",
      totalFloors: 2,
    },
    features: {
      rooms: 4,
      area: 150,
      hasBalcony: false,
      hasParking: true,
      hasFurniture: true,
      hasAppliances: true,
      petsAllowed: true,
      childrenAllowed: true,
      smokingAllowed: false,
      heatingType: "individual",
      condition: "good",
    },
    photos: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    createdAt: new Date("2024-03-18"),
    updatedAt: new Date("2024-03-18"),
    viewsCount: 312,
    applicationsCount: 5,
    isOwnerVerified: true,
  },
  {
    id: "listing-4",
    ownerId: "owner-2",
    ownerName: "Марія Коваль",
    status: "active",
    type: "sale",
    propertyType: "apartment",
    title: "3-кімнатна квартира в новобудові",
    description: "Продаж квартири в сучасному ЖК з розвиненою інфраструктурою. Два санвузли, велика кухня-вітальня, гардеробна кімната. Документи готові до угоди.",
    price: 2500000,
    address: {
      city: "Київ",
      district: "Голосіївський",
      street: "просп. Голосіївський",
      buildingNumber: "60",
      apartmentNumber: "45",
      floor: 8,
      totalFloors: 16,
    },
    features: {
      rooms: 3,
      area: 85,
      hasBalcony: true,
      hasParking: true,
      hasFurniture: false,
      hasAppliances: false,
      petsAllowed: true,
      childrenAllowed: true,
      smokingAllowed: true,
      heatingType: "central",
      condition: "new",
    },
    photos: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
    viewsCount: 456,
    applicationsCount: 3,
    isOwnerVerified: true,
  },
  {
    id: "listing-5",
    ownerId: "owner-3",
    ownerName: "Олександр Шевченко",
    status: "pending_moderation",
    type: "rent",
    propertyType: "room",
    title: "Кімната в спільній квартирі біля КПІ",
    description: "Окрема кімната в трикімнатній квартирі. Ідеально для студентів КПІ. Спільна кухня та санвузол. Тихі сусіди, швидкий інтернет.",
    price: 5500,
    deposit: 5500,
    address: {
      city: "Київ",
      district: "Солом'янський",
      street: "вул. Індустріальна",
      buildingNumber: "15",
      apartmentNumber: "78",
      floor: 5,
      totalFloors: 9,
    },
    features: {
      rooms: 1,
      area: 15,
      hasBalcony: false,
      hasParking: false,
      hasFurniture: true,
      hasAppliances: true,
      petsAllowed: false,
      childrenAllowed: false,
      smokingAllowed: false,
      heatingType: "central",
      condition: "good",
    },
    photos: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    ],
    createdAt: new Date("2024-03-25"),
    updatedAt: new Date("2024-03-25"),
    viewsCount: 0,
    applicationsCount: 0,
    isOwnerVerified: false,
  },
  {
    id: "listing-6",
    ownerId: "owner-1",
    ownerName: "Іван Петренко",
    status: "active",
    type: "rent",
    propertyType: "apartment",
    title: "Простора 1-кімнатна на Оболоні",
    description: "Світла квартира з видом на Дніпро. 5 хвилин до метро, розвинена інфраструктура. Є кондиціонер, пральна машина, холодильник. Комунальні сплачуються окремо.",
    price: 12000,
    deposit: 12000,
    address: {
      city: "Київ",
      district: "Оболонський",
      street: "просп. Оболонський",
      buildingNumber: "28",
      apartmentNumber: "56",
      floor: 7,
      totalFloors: 16,
    },
    features: {
      rooms: 1,
      area: 38,
      hasBalcony: true,
      hasParking: false,
      hasFurniture: true,
      hasAppliances: true,
      petsAllowed: false,
      childrenAllowed: true,
      smokingAllowed: false,
      heatingType: "central",
      condition: "good",
    },
    photos: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
    ],
    createdAt: new Date("2024-03-21"),
    updatedAt: new Date("2024-03-21"),
    viewsCount: 178,
    applicationsCount: 9,
    isOwnerVerified: true,
  },
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: "app-1",
    listingId: "listing-1",
    listingTitle: "Затишна 2-кімнатна квартира в центрі",
    listingPhoto: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    seekerId: "seeker-1",
    seekerName: "Анна Бондар",
    ownerId: "owner-1",
    status: "pending",
    formData: {
      fullName: "Анна Бондар",
      phone: "+380504445566",
      email: "anna.bondar@example.com",
      moveInDate: new Date("2024-04-15"),
      leaseDuration: "6-12 months",
      occupantsCount: 1,
      hasChildren: false,
      hasPets: false,
      employment: "employed",
      employmentDetails: "IT-спеціаліст в міжнародній компанії",
      monthlyIncome: "50000-70000 грн",
      message: "Добрий день! Дуже зацікавлена у вашій квартирі. Працюю віддалено, тому буду тихим орендарем. Готова внести депозит одразу.",
    },
    createdAt: new Date("2024-03-26T10:30:00"),
    responseDeadline: new Date("2024-03-29T10:30:00"),
  },
  {
    id: "app-2",
    listingId: "listing-1",
    listingTitle: "Затишна 2-кімнатна квартира в центрі",
    listingPhoto: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    seekerId: "seeker-3",
    seekerName: "Катерина Мельник",
    ownerId: "owner-1",
    status: "accepted",
    formData: {
      fullName: "Катерина Мельник",
      phone: "+380939990011",
      email: "kateryna.melnyk@example.com",
      moveInDate: new Date("2024-04-01"),
      leaseDuration: "12+ months",
      occupantsCount: 2,
      hasChildren: false,
      hasPets: true,
      petDetails: "Маленький котик, кастрований, привчений до лотка",
      employment: "employed",
      employmentDetails: "Менеджер з продажу",
      monthlyIncome: "40000-50000 грн",
      message: "Шукаємо квартиру для довгострокової оренди з чоловіком. Маємо гарні рекомендації від попереднього орендодавця.",
    },
    createdAt: new Date("2024-03-25T14:00:00"),
    respondedAt: new Date("2024-03-26T09:00:00"),
    responseDeadline: new Date("2024-03-28T14:00:00"),
  },
  {
    id: "app-3",
    listingId: "listing-2",
    listingTitle: "Студія з панорамними вікнами на Печерську",
    listingPhoto: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
    seekerId: "seeker-2",
    seekerName: "Дмитро Лисенко",
    ownerId: "owner-1",
    status: "rejected",
    formData: {
      fullName: "Дмитро Лисенко",
      phone: "+380677778899",
      email: "dmytro.lysenko@example.com",
      moveInDate: new Date("2024-04-05"),
      leaseDuration: "3-6 months",
      occupantsCount: 1,
      hasChildren: false,
      hasPets: false,
      employment: "student",
      employmentDetails: "Студент 4 курсу НАУ",
      message: "Шукаю житло на час навчання. Тихий, акуратний.",
    },
    createdAt: new Date("2024-03-24T16:00:00"),
    respondedAt: new Date("2024-03-25T10:00:00"),
    responseDeadline: new Date("2024-03-27T16:00:00"),
    ownerNote: "На жаль, шукаю орендаря на довший термін",
  },
  {
    id: "app-4",
    listingId: "listing-3",
    listingTitle: "Приватний будинок у передмісті Львова",
    listingPhoto: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    seekerId: "seeker-1",
    seekerName: "Анна Бондар",
    ownerId: "owner-2",
    status: "maybe",
    formData: {
      fullName: "Анна Бондар",
      phone: "+380504445566",
      email: "anna.bondar@example.com",
      moveInDate: new Date("2024-05-01"),
      leaseDuration: "12+ months",
      occupantsCount: 3,
      hasChildren: true,
      hasPets: true,
      petDetails: "Золотистий ретривер, дуже слухняний",
      employment: "employed",
      employmentDetails: "Переводимось на роботу до Львова всією родиною",
      monthlyIncome: "80000+ грн",
      message: "Шукаємо будинок для сім'ї з дитиною та собакою. Готові до довгострокової оренди та своєчасної оплати.",
    },
    createdAt: new Date("2024-03-26T12:00:00"),
    responseDeadline: new Date("2024-03-29T12:00:00"),
    ownerNote: "Цікавий варіант, але хочу спочатку познайомитись особисто",
  },
];

// Mock Chats (only for accepted applications)
export const mockChats: Chat[] = [
  {
    id: "chat-1",
    applicationId: "app-2",
    listingId: "listing-1",
    listingTitle: "Затишна 2-кімнатна квартира в центрі",
    seekerId: "seeker-3",
    seekerName: "Катерина Мельник",
    ownerId: "owner-1",
    ownerName: "Іван Петренко",
    messages: [
      {
        id: "msg-1",
        chatId: "chat-1",
        senderId: "owner-1",
        senderName: "Іван Петренко",
        content: "Доброго дня, Катерино! Дякую за зацікавленість. Коли вам буде зручно подивитись квартиру?",
        createdAt: new Date("2024-03-26T09:05:00"),
        readAt: new Date("2024-03-26T09:10:00"),
      },
      {
        id: "msg-2",
        chatId: "chat-1",
        senderId: "seeker-3",
        senderName: "Катерина Мельник",
        content: "Добрий день! Дякую за швидку відповідь. Чи можливо завтра о 18:00?",
        createdAt: new Date("2024-03-26T09:12:00"),
        readAt: new Date("2024-03-26T09:15:00"),
      },
      {
        id: "msg-3",
        chatId: "chat-1",
        senderId: "owner-1",
        senderName: "Іван Петренко",
        content: "Так, завтра о 18:00 буде чудово. Адреса: вул. Володимирська 45, кв. 12. Зателефоную вам, коли буду на місці.",
        createdAt: new Date("2024-03-26T09:20:00"),
      },
    ],
    createdAt: new Date("2024-03-26T09:00:00"),
    lastMessageAt: new Date("2024-03-26T09:20:00"),
    unreadCount: 1,
  },
];

// Mock Complaints
export const mockComplaints: Complaint[] = [
  {
    id: "complaint-1",
    reporterId: "seeker-2",
    reporterName: "Дмитро Лисенко",
    targetType: "listing",
    targetId: "listing-5",
    reason: "misleading_info",
    description: "Фото не відповідають реальному стану квартири. Під час огляду виявилось, що ремонт значно гірший, ніж на фото.",
    status: "pending",
    createdAt: new Date("2024-03-25T15:00:00"),
  },
];

// Current user mock (for demo purposes)
export const currentUser: Seeker = mockSeekers[0];

// Helper functions
export function getListingById(id: string): Listing | undefined {
  return mockListings.find((l) => l.id === id);
}

export function getApplicationsForOwner(ownerId: string): Application[] {
  return mockApplications.filter((a) => a.ownerId === ownerId);
}

export function getApplicationsForSeeker(seekerId: string): Application[] {
  return mockApplications.filter((a) => a.seekerId === seekerId);
}

export function getListingsForOwner(ownerId: string): Listing[] {
  return mockListings.filter((l) => l.ownerId === ownerId);
}

export function getChatForApplication(applicationId: string): Chat | undefined {
  return mockChats.find((c) => c.applicationId === applicationId);
}

export function getActiveListings(): Listing[] {
  return mockListings.filter((l) => l.status === "active");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uk-UA").format(price) + " грн";
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getTimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) return "Час вичерпано";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days} дн. ${hours % 24} год.`;
  }

  return `${hours} год. ${minutes} хв.`;
}

export const mockUsers = [...mockOwners, ...mockSeekers];
export const mockMessages = mockChats.flatMap((c) => c.messages);
