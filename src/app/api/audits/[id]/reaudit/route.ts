import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AuditService } from "@/lib/audit-service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getSupabaseServerClient();

    // Get the original audit to re-audit
    const { data: originalAudit, error: auditError } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (auditError || !originalAudit) {
      return NextResponse.json(
        { error: 'Original audit not found' },
        { status: 404 }
      );
    }

    // Update audit status to processing
    const { error: updateError } = await supabase
      .from("audits")
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (updateError) {
      console.error('Failed to update audit status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update audit status' },
        { status: 500 }
      );
    }

    // Perform the re-audit
    const auditResult = await AuditService.performAudit(
      originalAudit.website_url, 
      originalAudit.city_region || undefined
    );

    // Update audit status to completed
    const { error: finalUpdateError } = await supabase
      .from("audits")
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      })
      .eq("id", id);

    if (finalUpdateError) {
      console.error('Failed to update final audit status:', finalUpdateError);
    }

    // Insert new audit results
    const { error: resultsError } = await supabase
      .from("audit_results")
      .upsert({
        audit_id: id,
        seo_score: auditResult.seo_score,
        technical_score: auditResult.technical_score,
        local_score: auditResult.local_score,
        performance_score: auditResult.performance_score,
        content_score: auditResult.content_score,
        overall_score: auditResult.overall_score,
        seo_issues: auditResult.seo_issues,
        technical_issues: auditResult.technical_issues,
        local_issues: auditResult.local_issues,
        performance_issues: auditResult.performance_issues,
        content_issues: auditResult.content_issues,
        raw_data: auditResult.raw_data,
      });

    if (resultsError) {
      console.error('Failed to insert audit results:', resultsError);
      return NextResponse.json(
        { error: 'Failed to save audit results' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Re-audit completed successfully',
      audit_id: id,
      status: 'completed'
    });

  } catch (error) {
    console.error('Re-audit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
