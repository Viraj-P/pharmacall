import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFAuditData {
  business_name: string;
  website_url: string;
  created_at: string;
  overall_score: number;
  seo_score: number;
  technical_score: number;
  local_score: number;
  performance_score: number;
  content_score: number;
  seo_issues: string[];
  technical_issues: string[];
  local_issues: string[];
  performance_issues: string[];
  content_issues: string[];
}

export class PDFService {
  static async generateAuditReport(auditData: PDFAuditData): Promise<Blob> {
    // Create a temporary HTML element for the report
    const reportElement = this.createReportHTML(auditData);
    document.body.appendChild(reportElement);

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: reportElement.scrollHeight,
      });

      // Remove temporary element
      document.body.removeChild(reportElement);

      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Return as blob
      return pdf.output('blob');
    } catch (error) {
      document.body.removeChild(reportElement);
      throw new Error(`PDF generation failed: ${error}`);
    }
  }

  private static createReportHTML(auditData: PDFAuditData): HTMLElement {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '-9999px';
    div.style.top = '-9999px';
    div.style.width = '800px';
    div.style.backgroundColor = '#ffffff';
    div.style.padding = '40px';
    div.style.fontFamily = 'Arial, sans-serif';
    div.style.color = '#333333';

    const getScoreColor = (score: number) => {
      if (score >= 80) return '#059669';
      if (score >= 60) return '#d97706';
      return '#dc2626';
    };

    const getScoreText = (score: number) => {
      if (score >= 80) return 'Excellent';
      if (score >= 60) return 'Good';
      return 'Needs Improvement';
    };

    div.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #10b981); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
            <span style="color: white; font-size: 24px; font-weight: bold;">L</span>
          </div>
          <h1 style="font-size: 36px; font-weight: bold; background: linear-gradient(135deg, #3b82f6, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">
            LocalIQ
          </h1>
        </div>
        <h2 style="font-size: 28px; color: #1f2937; margin: 10px 0;">SEO Audit Report</h2>
        <p style="font-size: 18px; color: #6b7280; margin: 5px 0;">${auditData.business_name}</p>
        <p style="font-size: 16px; color: #6b7280; margin: 5px 0;">${auditData.website_url}</p>
        <p style="font-size: 14px; color: #9ca3af; margin: 5px 0;">Generated on ${new Date(auditData.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      <div style="margin-bottom: 40px; text-align: center;">
        <h3 style="font-size: 24px; color: #1f2937; margin-bottom: 20px;">Overall Score</h3>
        <div style="font-size: 48px; font-weight: bold; color: ${getScoreColor(auditData.overall_score)}; margin-bottom: 10px;">
          ${auditData.overall_score}/100
        </div>
        <div style="font-size: 18px; color: ${getScoreColor(auditData.overall_score)}; font-weight: 600; margin-bottom: 20px;">
          ${getScoreText(auditData.overall_score)}
        </div>
        <div style="width: 100%; height: 20px; background: #e5e7eb; border-radius: 10px; overflow: hidden;">
          <div style="width: ${auditData.overall_score}%; height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981); border-radius: 10px;"></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
        <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #3b82f6;">
          <h4 style="font-size: 20px; color: #1f2937; margin-bottom: 15px;">SEO Score</h4>
          <div style="font-size: 32px; font-weight: bold; color: ${getScoreColor(auditData.seo_score)}; margin-bottom: 10px;">
            ${auditData.seo_score}/100
          </div>
          <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
            <div style="width: ${auditData.seo_score}%; height: 100%; background: #3b82f6; border-radius: 4px;"></div>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #10b981;">
          <h4 style="font-size: 20px; color: #1f2937; margin-bottom: 15px;">Technical Score</h4>
          <div style="font-size: 32px; font-weight: bold; color: ${getScoreColor(auditData.technical_score)}; margin-bottom: 10px;">
            ${auditData.technical_score}/100
          </div>
          <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
            <div style="width: ${auditData.technical_score}%; height: 100%; background: #10b981; border-radius: 4px;"></div>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #8b5cf6;">
          <h4 style="font-size: 20px; color: #1f2937; margin-bottom: 15px;">Local Score</h4>
          <div style="font-size: 32px; font-weight: bold; color: ${getScoreColor(auditData.local_score)}; margin-bottom: 10px;">
            ${auditData.local_score}/100
          </div>
          <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
            <div style="width: ${auditData.local_score}%; height: 100%; background: #8b5cf6; border-radius: 4px;"></div>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #f59e0b;">
          <h4 style="font-size: 20px; color: #1f2937; margin-bottom: 15px;">Performance Score</h4>
          <div style="font-size: 32px; font-weight: bold; color: ${getScoreColor(auditData.performance_score)}; margin-bottom: 10px;">
            ${auditData.performance_score}/100
          </div>
          <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
            <div style="width: ${auditData.performance_score}%; height: 100%; background: #f59e0b; border-radius: 4px;"></div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 40px;">
        <h3 style="font-size: 24px; color: #1f2937; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Detailed Analysis</h3>
        
        <div style="margin-bottom: 30px;">
          <h4 style="font-size: 20px; color: #1f2937; margin-bottom: 15px;">SEO Issues (${auditData.seo_issues.length})</h4>
          ${auditData.seo_issues.length > 0 ? 
            `<ul style="margin: 0; padding-left: 20px;">
              ${auditData.seo_issues.map(issue => `<li style="margin-bottom: 8px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px; border-left: 4px solid #dc2626;">${issue}</li>`).join('')}
            </ul>` : 
            '<p style="color: #059669; background: #f0fdf4; padding: 12px; border-radius: 8px; border-left: 4px solid #059669;">✅ No SEO issues found! Your website is well-optimized.</p>'
          }
        </div>

        <div style="margin-bottom: 30px;">
          <h4 style="font-size: 20px; color: #1f2937; margin-bottom: 15px;">Technical Issues (${auditData.technical_issues.length})</h4>
          ${auditData.technical_issues.length > 0 ? 
            `<ul style="margin: 0; padding-left: 20px;">
              ${auditData.technical_issues.map(issue => `<li style="margin-bottom: 8px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px; border-left: 4px solid #dc2626;">${issue}</li>`).join('')}
            </ul>` : 
            '<p style="color: #059669; background: #f0fdf4; padding: 12px; border-radius: 8px; border-left: 4px solid #059669;">✅ No technical issues found! Your website meets technical standards.</p>'
          }
        </div>

        <div style="margin-bottom: 30px;">
          <h4 style="font-size: 20px; color: #1f2937; margin-bottom: 15px;">Local SEO Issues (${auditData.local_issues.length})</h4>
          ${auditData.local_issues.length > 0 ? 
            `<ul style="margin: 0; padding-left: 20px;">
              ${auditData.local_issues.map(issue => `<li style="margin-bottom: 8px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px; border-left: 4px solid #dc2626;">${issue}</li>`).join('')}
            </ul>` : 
            '<p style="color: #059669; background: #f0fdf4; padding: 12px; border-radius: 8px; border-left: 4px solid #059669;">✅ No local SEO issues found! Your local presence is strong.</p>'
          }
        </div>

        <div style="margin-bottom: 30px;">
          <h4 style="font-size: 20px; color: #1f2937; margin-bottom: 15px;">Performance Issues (${auditData.performance_issues.length})</h4>
          ${auditData.performance_issues.length > 0 ? 
            `<ul style="margin: 0; padding-left: 20px;">
              ${auditData.performance_issues.map(issue => `<li style="margin-bottom: 8px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px; border-left: 4px solid #dc2626;">${issue}</li>`).join('')}
            </ul>` : 
            '<p style="color: #059669; background: #f0fdf4; padding: 12px; border-radius: 8px; border-left: 4px solid #059669;">✅ No performance issues found! Your website loads quickly.</p>'
          }
        </div>

        <div style="margin-bottom: 30px;">
          <h4 style="font-size: 20px; color: #1f2937; margin-bottom: 15px;">Content Issues (${auditData.content_issues.length})</h4>
          ${auditData.content_issues.length > 0 ? 
            `<ul style="margin: 0; padding-left: 20px;">
              ${auditData.content_issues.map(issue => `<li style="margin-bottom: 8px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px; border-left: 4px solid #dc2626;">${issue}</li>`).join('')}
            </ul>` : 
            '<p style="color: #059669; background: #f0fdf4; padding: 12px; border-radius: 8px; border-left: 4px solid #059669;">✅ No content issues found! Your content is well-optimized.</p>'
          }
        </div>
      </div>

      <div style="text-align: center; margin-top: 60px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
        <p style="font-size: 16px; color: #6b7280; margin: 5px 0;">
          <strong>Report generated by LocalIQ</strong> - Automated Local SEO Reports in Minutes
        </p>
        <p style="font-size: 14px; color: #9ca3af; margin: 5px 0;">
          Visit <a href="https://local-seo-audit-tool-navy.vercel.app" style="color: #3b82f6;">local-seo-audit-tool-navy.vercel.app</a> to create your own audit
        </p>
      </div>
    `;

    return div;
  }
}
