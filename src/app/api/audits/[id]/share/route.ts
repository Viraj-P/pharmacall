import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getSupabaseServerClient();

    // Generate a unique shareable URL
    const shareableUrl = `${process.env.NEXT_PUBLIC_APP_URL}/audits/${id}/shared`;

    // Update the reports table with the shareable URL
    const { data, error } = await supabase
      .from("reports")
      .upsert({
        audit_id: id,
        shareable_url: shareableUrl,
        pdf_url: null, // Will be added when PDF is generated
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create shareable link:', error);
      return NextResponse.json(
        { error: 'Failed to create shareable link' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      shareable_url: shareableUrl,
      message: 'Shareable link created successfully'
    });
  } catch (error) {
    console.error('Share link creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
