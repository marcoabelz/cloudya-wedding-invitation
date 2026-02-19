import { createClient } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  if (rows.length === 0) {
    return NextResponse.json({ error: "File kosong" }, { status: 400 });
  }

  const guests: { name: string; slug: string; phone: string | null }[] = [];
  const parseErrors: string[] = [];

  rows.forEach((row, i) => {
    const name = String(row["name"] ?? row["Name"] ?? row["NAMA"] ?? row["nama"] ?? "").trim();
    const phone = String(row["phone"] ?? row["Phone"] ?? row["PHONE"] ?? row["no_hp"] ?? row["No HP"] ?? "").trim() || null;

    if (!name) {
      parseErrors.push(`Row ${i + 2}: kolom 'name' kosong`);
      return;
    }

    guests.push({ name, slug: generateSlug(name), phone });
  });

  if (guests.length === 0) {
    return NextResponse.json(
      { error: "Tidak ada data valid", details: parseErrors },
      { status: 400 }
    );
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("guests")
    .upsert(guests, { onConflict: "slug", ignoreDuplicates: true })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    inserted: data?.length ?? 0,
    skipped: guests.length - (data?.length ?? 0),
    total: guests.length,
    parseErrors,
  });
}
