import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("audits")
    .select("id,status,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ id, status: "pending", note: "DB not ready; returning stub status." });
  }
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(data);
}
