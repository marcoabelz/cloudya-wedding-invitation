import "server-only";
import { createServerClient } from "./server";

// ============================================
// Guest Queries (Server-side only)
// ============================================

export async function getGuestBySlug(slug: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching guest:", error.message);
    return null;
  }

  return data;
}

export async function getAllGuestSlugs() {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from("guests").select("slug");

  if (error) {
    console.error("Error fetching guest slugs:", error.message);
    return [];
  }

  return data.map((guest) => guest.slug);
}

// ============================================
// Message Queries (Server-side only)
// ============================================

export async function getMessages(limit = 50) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching messages:", error.message);
    return [];
  }

  return data;
}
