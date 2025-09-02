import pdf from "html-pdf-node";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function generateAuditPDF(auditId: string, htmlContent: string): Promise<string> {
  const options = {
    format: "A4",
    border: {
      top: "0.5in",
      right: "0.5in",
      bottom: "0.5in",
      left: "0.5in"
    }
  };

  const file = { content: htmlContent };
  const pdfBuffer = await pdf.generatePdf(file, options);

  // Upload to Supabase Storage
  const supabase = await getSupabaseServerClient();
  const fileName = `audit-${auditId}-${Date.now()}.pdf`;
  
  const { error } = await supabase.storage
    .from("reports")
    .upload(fileName, pdfBuffer, {
      contentType: "application/pdf",
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("reports")
    .getPublicUrl(fileName);

  return publicUrl;
}

export function generateAuditHTML(auditData: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>SEO Audit Report - ${auditData.business_name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .score { font-size: 24px; font-weight: bold; color: #2563eb; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .issue { margin: 10px 0; padding: 10px; background: #f9fafb; border-left: 4px solid #ef4444; }
        .suggestion { margin-top: 5px; font-style: italic; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Local SEO Audit Report</h1>
        <h2>${auditData.business_name}</h2>
        <p>${auditData.website_url}</p>
        <div class="score">Overall Score: ${auditData.overall_score}/100</div>
      </div>

      <div class="section">
        <h2>On-page SEO (${auditData.seo_score}/100)</h2>
        <p>Analysis of title tags, meta descriptions, headings, and technical SEO elements.</p>
      </div>

      <div class="section">
        <h2>Technical Basics (${auditData.technical_score}/100)</h2>
        <p>Evaluation of robots.txt, sitemap, HTTPS, mobile-friendliness, and site structure.</p>
      </div>

      <div class="section">
        <h2>Local Signals (${auditData.local_score}/100)</h2>
        <p>Review of NAP consistency, local schema markup, and Google Business Profile integration.</p>
      </div>

      <div class="section">
        <h2>Performance (${auditData.performance_score}/100)</h2>
        <p>Core Web Vitals analysis including loading speed, interactivity, and visual stability.</p>
      </div>

      <div class="section">
        <h2>Content Quality (${auditData.content_score}/100)</h2>
        <p>Assessment of content depth, heading structure, and image optimization.</p>
      </div>

      <div class="section">
        <h2>Recommendations</h2>
        <p>Focus on improving areas with the lowest scores for maximum impact on local search rankings.</p>
      </div>
    </body>
    </html>
  `;
}
