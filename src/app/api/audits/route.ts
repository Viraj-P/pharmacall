import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AuditService } from "@/lib/audit-service";

const CreateAuditSchema = z.object({
  business_name: z.string().min(1),
  website_url: z.string().url(),
  city_region: z.string().optional(),
  google_business_profile_url: z.string().url().optional(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = CreateAuditSchema.parse(body);

    // Perform the actual audit
    let auditResult;
    try {
      auditResult = await AuditService.performAudit(input.website_url, input.city_region);
    } catch (auditError) {
      console.error('Audit failed:', auditError);
      // Return error but don't fail the request
      auditResult = {
        seo_score: 0,
        technical_score: 0,
        local_score: 0,
        performance_score: 0,
        content_score: 0,
        overall_score: 0,
        seo_issues: ['Audit failed to complete'],
        technical_issues: [],
        local_issues: [],
        performance_issues: [],
        content_issues: [],
        raw_data: {},
      };
    }

    const supabase = await getSupabaseServerClient();
    
    // Insert audit record
    const { data: auditData, error: auditError } = await supabase
      .from("audits")
      .insert({
        business_name: input.business_name,
        website_url: input.website_url,
        city_region: input.city_region ?? null,
        google_business_profile_url: input.google_business_profile_url ?? null,
        status: "completed",
        email: input.email,
      })
      .select("id")
      .single();

    if (auditError) {
      // If DB not ready, return a stub response to unblock UI
      return NextResponse.json({
        id: crypto.randomUUID(),
        status: "completed",
        note: "DB not initialized yet; returning stub id.",
        audit_result: auditResult,
      }, { status: 202 });
    }

    // Insert audit results
    if (auditData?.id) {
      await supabase
        .from("audit_results")
        .insert({
          audit_id: auditData.id,
          ...auditResult,
        });
    }

    return NextResponse.json({ 
      id: auditData?.id || crypto.randomUUID(), 
      status: "completed",
      audit_result: auditResult,
    }, { status: 202 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Invalid request" }, { status: 400 });
  }
}
