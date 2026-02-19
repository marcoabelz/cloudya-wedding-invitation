import { createClient } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const filter = searchParams.get("filter") || "all";
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? false : true;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = (page - 1) * limit;

  let query = supabase.from("guests").select("*", { count: "exact" });

  // Apply filter
  if (filter === "sent") {
    query = query.not("sent_at", "is", null);
  } else if (filter === "pending") {
    query = query.is("sent_at", null);
  }

  // Apply search
  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder });

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data: guests, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch stats (separate query for accurate counts)
  const { count: totalCount } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true });

  const { count: sentCount } = await supabase
    .from("guests")
    .select("*", { count: "exact", head: true })
    .not("sent_at", "is", null);

  // const { count: openedCount } = await supabase
  //   .from("guests")
  //   .select("*", { count: "exact", head: true })
  //   .eq("whatsapp_opened", true);

  // const { count: rsvpCount } = await supabase
  //   .from("guests")
  //   .select("*", { count: "exact", head: true })
  //   .eq("rsvp_submitted", true);

  return NextResponse.json({
    guests: guests || [],
    stats: {
      total: totalCount || 0,
      sent: sentCount || 0,
      // opened: openedCount || 0,
      // rsvp: rsvpCount || 0,
      pending: (totalCount || 0) - (sentCount || 0),
    },
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}
