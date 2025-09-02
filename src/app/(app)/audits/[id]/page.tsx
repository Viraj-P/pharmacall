import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import AuditReportClient from "./audit-report-client";

interface AuditResult {
  id: string;
  audit_id: string;
  seo_score: number;
  technical_score: number;
  local_score: number;
  performance_score: number;
  content_score: number;
  overall_score: number;
  seo_issues: string[];
  technical_issues: string[];
  local_issues: string[];
  performance_issues: string[];
  content_issues: string[];
  raw_data: any;
  created_at: string;
}

interface Audit {
  id: string;
  business_name: string;
  website_url: string;
  status: string;
  created_at: string;
}

export default async function AuditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let audit: Audit | null = null;
  let auditResult: AuditResult | null = null;
  let dbError = false;

  try {
    const supabase = await getSupabaseServerClient();
    
    // Fetch audit data
    const { data: auditData, error: auditError } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (auditError) {
      console.error('Database error fetching audit:', auditError);
      dbError = true;
    } else {
      audit = auditData;
    }

    // Fetch audit results
    if (audit) {
      const { data: resultData, error: resultError } = await supabase
        .from("audit_results")
        .select("*")
        .eq("audit_id", id)
        .single();

      if (resultError) {
        console.error('Database error fetching results:', resultError);
      } else {
        auditResult = resultData;
      }
    }
  } catch (error) {
    console.error('Supabase connection error:', error);
    dbError = true;
  }

  // If database is not accessible, use fallback data
  if (dbError || !audit) {
    audit = {
      id: id,
      business_name: "Sample Business",
      website_url: "https://example.com",
      status: "completed",
      created_at: new Date().toISOString(),
    };
  }

  return <AuditReportClient audit={audit} auditResult={auditResult} dbError={dbError} />;
}
