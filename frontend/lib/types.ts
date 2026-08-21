export type MessageRole = "user" | "assistant" | "system";

export type MessageKind =
  | "text"
  | "image"
  | "upload-prompt"
  | "typing"
  | "analysis"
  | "results"
  | "question"
  | "choice-summary"
  | "save-prompt";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  kind: MessageKind;
  text?: string;
  imageUrl?: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
}

export interface AssessmentAnswer {
  questionId: string;
  optionId: string;
  optionLabel: string;
}

export interface Contributor {
  label: string;
  level: "low" | "medium" | "high";
}

export interface SkinResult {
  id: string;
  date: string;
  condition: string;
  location: string;
  severity: "mild" | "moderate" | "severe";
  contributors: Contributor[];
  summary: string;
  explanation: string;
  see_derm: boolean;
  derm_reason: string | null;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  distanceMiles: number;
  availability: string[];
  bio: string;
  photoUrl: string;
  saved?: boolean;
  specialties: string[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  imageUrl: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  note?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  type: "in-person" | "video";
  reason?: string;
  status: "upcoming" | "past" | "cancelled";
}

export interface UserProfile {
  name: string;
  email: string;
  photoUrl: string;
  streakDays: number;
  goals: string[];
}
