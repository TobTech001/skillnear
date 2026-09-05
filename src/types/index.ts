export interface Provider {
  id: string;
  name: string;
  service: string;
  location: string;
  distanceKm: number;
  latitude?: number;
  longitude?: number;
  rating: number;
  reviews: number;
  priceFrom: number;
  priceTo: number;
  availability: "Available now" | "Available today" | "Booked until tomorrow";
  verified: boolean;
  bio?: string;
  yearsExperience?: number;
  initials?: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  code: string; // short work-order style code, e.g. "GEN"
  description: string;
}

export interface DispatchEntry {
  id: string;
  request: string;
  category: string;
  matched: string;
  etaMinutes: number;
}

export interface Review {
  id: string;
  providerId: string;
  bookingId?: string;
  author: string;
  authorEmail?: string;
  rating: number;
  comment: string;
  date: string;
}

export type BookingStatus =
  | "Pending"
  | "Accepted"
  | "Completed"
  | "Cancelled";

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  service: string;
  customerName: string;
  customerEmail?: string;
  phone?: string;
  problemDescription?: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
  customerBudget?: number;
  address: string;
  reviewed?: boolean;
}

export type UserRole = "customer" | "provider" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  trade?: string;
  providerId?: string;
  suspended?: boolean;
}

export type ComplaintStatus = "Open" | "Resolved";

export interface Complaint {
  id: string;
  fromName: string;
  fromEmail: string;
  aboutProviderId?: string;
  aboutProviderName?: string;
  subject: string;
  message: string;
  status: ComplaintStatus;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export type PaymentStatus = "Paid" | "Released" | "Refunded";

export interface Payment {
  id: string;
  bookingId: string;
  customerEmail: string;
  customerName: string;
  providerId: string;
  providerName: string;
  service: string;
  amount: number;
  status: PaymentStatus;
  customerConfirmedCompletion: boolean;
  paidAt: string;
  releasedAt?: string;
  refundedAt?: string;
}

export type VerificationStatus =
  | "draft"
  | "pending"
  | "verified"
  | "rejected"
  | "more_information";

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  fileName?: string;
}

export interface ProviderVerification {
  id: string;
  providerId: string;
  providerUserId: string;

  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    phone: string;
    email: string;
    address: string;
    state: string;
    lga: string;
    photoFileName?: string;
  };

  identity: {
    idType: string;
    idNumber: string;
    idDocumentFileName?: string;
    selfieFileName?: string;
    confirmed: boolean;
  };

  professional: {
    category: string;
    servicesOffered: string[];
    professionalTitle: string;
    yearsExperience: number;
    description: string;
  };

  experience: {
    skills: string[];
    previousExperience: string;
    certificateFileName?: string;
    licenseFileName?: string;
  };

  /** Optional — a provider can submit for verification without any portfolio items. */
  portfolio: PortfolioItem[];

  serviceArea: {
    state: string;
    city: string;
    areas: string[];
    radiusKm: number;
    startingPrice: number;
  };

  documents: {
    additionalDocumentFileName?: string;
  };

  status: VerificationStatus;
  adminNote?: string;
  submittedAt?: string;
  reviewedAt?: string;
}