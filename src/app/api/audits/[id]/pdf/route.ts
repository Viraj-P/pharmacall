import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getSupabaseServerClient();

    // Get audit data
    const { data: audit, error: auditError } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (auditError || !audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Get audit results
    const { data: auditResult, error: resultError } = await supabase
      .from("audit_results")
      .select("*")
      .eq("audit_id", id)
      .single();

    if (resultError || !auditResult) {
      return NextResponse.json(
        { error: 'Audit results not found' },
        { status: 404 }
      );
    }

    // For now, return a simple HTML report that can be printed to PDF
    // In a production environment, you'd use a proper PDF library like puppeteer or jsPDF
    const htmlReport = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>LocalIQ SEO Audit Report - ${audit.business_name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .score { font-size: 48px; font-weight: bold; margin: 20px 0; }
            .score.excellent { color: #059669; }
            .score.good { color: #d97706; }
            .score.poor { color: #dc2626; }
            .section { margin: 30px 0; }
            .issues { background: #fef2f2; padding: 20px; border-radius: 8px; }
            .issue { color: #dc2626; margin: 10px 0; }
            .footer { margin-top: 60px; text-align: center; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LocalIQ SEO Audit Report</h1>
            <h2>${audit.business_name}</h2>
            <p>${audit.website_url}</p>
            <p>Generated on ${new Date(audit.created_at).toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>Overall Score</h2>
            <div class="score ${auditResult.overall_score >= 80 ? 'excellent' : auditResult.overall_score >= 60 ? 'good' : 'poor'}">
              ${auditResult.overall_score}/100
            </div>
            <p>${auditResult.overall_score >= 80 ? 'Excellent! Your website is well-optimized.' : 
                auditResult.overall_score >= 60 ? 'Good, but there\'s room for improvement.' : 
                'Your website needs significant optimization work.'}</p>
          </div>

          <div class="section">
            <h2>SEO Score: ${auditResult.seo_score}/100</h2>
            <p>Analysis of title tags, meta descriptions, headings, and more.</p>
            ${auditResult.seo_issues.length > 0 ? 
              `<div class="issues"><h3>Issues Found:</h3>${auditResult.seo_issues.map((issue: string) => `<div class="issue">• ${issue}</div>`).join('')}</div>` : 
              '<p style="color: #059669;">No SEO issues found! 🎉</p>'}
          </div>

          <div class="section">
            <h2>Technical Score: ${auditResult.technical_score}/100</h2>
            <p>Robots.txt, sitemap, HTTPS, mobile-friendliness, and more.</p>
            ${auditResult.technical_issues.length > 0 ? 
              `<div class="issues"><h3>Issues Found:</h3>${auditResult.technical_issues.map((issue: string) => `<div class="issue">• ${issue}</div>`).join('')}</div>` : 
              '<p style="color: #059669;">No technical issues found! 🎉</p>'}
          </div>

          <div class="section">
            <h2>Local Score: ${auditResult.local_score}/100</h2>
            <p>NAP consistency, local schema, and map integration.</p>
            ${auditResult.local_issues.length > 0 ? 
              `<div class="issues"><h3>Issues Found:</h3>${auditResult.local_issues.map((issue: string) => `<div class="issue">• ${issue}</div>`).join('')}</div>` : 
              '<p style="color: #059669;">No local SEO issues found! 🎉</p>'}
          </div>

          <div class="section">
            <h2>Performance Score: ${auditResult.performance_score}/100</h2>
            <p>Core Web Vitals and page speed analysis.</p>
            ${auditResult.performance_issues.length > 0 ? 
              `<div class="issues"><h3>Issues Found:</h3>${auditResult.performance_issues.map((issue: string) => `<div class="issue">• ${issue}</div>`).join('')}</div>` : 
              '<p style="color: #059669;">No performance issues found! 🎉</p>'}
          </div>

          <div class="section">
            <h2>Content Score: ${auditResult.content_score}/100</h2>
            <p>Word count, heading structure, and image optimization.</p>
            ${auditResult.content_issues.length > 0 ? 
              `<div class="issues"><h3>Issues Found:</h3>${auditResult.content_issues.map((issue: string) => `<div class="issue">• ${issue}</div>`).join('')}</div>` : 
              '<p style="color: #059669;">No content issues found! 🎉</p>'}
          </div>

          <div class="footer">
            <p>Report generated by LocalIQ - Automated Local SEO Reports in Minutes</p>
            <p>Visit <a href="${process.env.NEXT_PUBLIC_APP_URL}">${process.env.NEXT_PUBLIC_APP_URL}</a> to create your own audit</p>
          </div>
        </body>
      </html>
    `;

    // Return HTML that can be printed to PDF
    return new NextResponse(htmlReport, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="localiq-audit-${audit.business_name.replace(/\s+/g, '-').toLowerCase()}.html"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
