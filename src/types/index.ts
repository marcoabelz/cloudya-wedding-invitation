import type { Database } from "@/lib/supabase/types";

// Database table types
export type Guest = Database["public"]["Tables"]["guests"]["Row"];
export type GuestInsert = Database["public"]["Tables"]["guests"]["Insert"];

export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];

export type AttendanceStatus = Database["public"]["Enums"]["attendance_status"];

// Component Props types
export interface SectionProps {
  className?: string;
}

export interface GuestPageProps {
  guest: Guest;
}

// Form types
export interface MessageFormData {
  guestName: string;
  message: string;
  attendance: AttendanceStatus;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
