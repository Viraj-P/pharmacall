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
  // New comprehensive fields
  detailed_analysis?: any;
  recommendations?: any[];
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
  let errorMessage = "";

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
      errorMessage = `Audit fetch error: ${auditError.message}`;
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
        errorMessage = `Results fetch error: ${resultError.message}`;
      } else {
        auditResult = resultData;
      }
    }
  } catch (error) {
    console.error('Supabase connection error:', error);
    dbError = true;
    errorMessage = `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }

  // If database is not accessible, use comprehensive fallback data
  if (dbError || !audit) {
    audit = {
      id: id,
      business_name: "Sample Business",
      website_url: "https://example.com",
      status: "completed",
      created_at: new Date().toISOString(),
    };
    
    // Create comprehensive fallback audit result
    auditResult = {
      id: crypto.randomUUID(),
      audit_id: id,
      seo_score: 75,
      technical_score: 70,
      local_score: 65,
      performance_score: 80,
      content_score: 85,
      overall_score: 75,
      seo_issues: [
        'Title tag could be optimized for better click-through rates',
        'Meta description length is optimal but could include more call-to-action',
        'Heading structure follows best practices but could be more descriptive'
      ],
      technical_issues: [
        'HTTPS is properly implemented for security',
        'Mobile viewport meta tag is present and optimized',
        'Robots.txt file is accessible and properly configured'
      ],
      local_issues: [
        'Local business information is present but could be enhanced with schema markup',
        'City and region targeting could be more specific',
        'Map integration is functional but could be improved'
      ],
      performance_issues: [
        'Page load speed is within acceptable range',
        'Core Web Vitals are meeting current standards',
        'Image optimization could be improved for better performance'
      ],
      content_issues: [
        'Content length meets minimum requirements for SEO',
        'Image alt text coverage is good but could be improved',
        'Content structure follows SEO best practices'
      ],
      raw_data: {
        title: "Sample Business - Professional Services",
        metaDescription: "Professional business services in your area. Contact us today for expert solutions.",
        headings: {
          h1: ["Welcome to Sample Business"],
          h2: ["Our Services", "Why Choose Us", "Contact Information"],
          h3: ["Service 1", "Service 2", "Service 3"]
        },
        images: [
          { src: "/sample-image.jpg", alt: "Professional business services" }
        ],
        links: [
          { href: "/services", text: "Our Services" },
          { href: "/contact", text: "Contact Us" }
        ],
        wordCount: 450,
        hasRobotsTxt: true,
        hasSitemap: true,
        isHttps: true,
        hasFavicon: true,
        mobileViewport: true
      },
      created_at: new Date().toISOString(),
      detailed_analysis: {
        seo: {
          title_optimization: {
            length: 45,
            has_keywords: true,
            has_brand: true,
            score: 75
          },
          meta_description: {
            length: 135,
            has_call_to_action: true,
            score: 75
          },
          heading_structure: {
            h1_count: 1,
            h2_count: 3,
            h3_count: 3,
            hierarchy_score: 80
          },
          keyword_density: {
            primary_keywords: ["business", "services", "professional"],
            density_score: 75
          },
          internal_linking: {
            internal_links: 2,
            external_links: 0,
            link_score: 70
          }
        },
        technical: {
          page_speed: {
            estimated_load_time: 2.1,
            score: 80
          },
          mobile_optimization: {
            viewport_meta: true,
            responsive_images: true,
            touch_targets: true,
            score: 80
          },
          security: {
            https: true,
            security_headers: true,
            score: 80
          },
          crawlability: {
            robots_txt: true,
            sitemap: true,
            canonical_urls: true,
            score: 80
          }
        },
        local: {
          nap_consistency: {
            name: true,
            address: true,
            phone: true,
            score: 65
          },
          local_schema: {
            has_schema: false,
            schema_type: "LocalBusiness",
            score: 65
          },
          local_keywords: {
            city_mentions: 2,
            region_mentions: 1,
            local_terms: 3,
            score: 65
          },
          map_integration: {
            has_map: true,
            map_type: "Google Maps",
            score: 65
          }
        },
        performance: {
          core_web_vitals: {
            lcp: 2.1,
            fid: 95,
            cls: 0.08,
            score: 80
          },
          page_resources: {
            total_size: 850,
            image_count: 1,
            script_count: 3,
            score: 80
          },
          caching: {
            has_cache_headers: true,
            cache_score: 80
          }
        },
        content: {
          readability: {
            flesch_score: 72,
            word_count: 450,
            sentence_count: 22,
            score: 85
          },
          multimedia: {
            image_count: 1,
            video_count: 0,
            alt_text_coverage: 100,
            score: 85
          },
          content_freshness: {
            last_updated: new Date().toISOString(),
            update_frequency: "monthly",
            score: 85
          }
        }
      },
      recommendations: [
        {
          category: 'seo',
          priority: 'medium',
          title: 'Optimize Title Tags',
          description: 'Include primary keywords and make titles more compelling',
          impact: 'Medium impact on search rankings',
          effort: 'Low effort, good reward',
          estimated_improvement: 10
        },
        {
          category: 'local',
          priority: 'high',
          title: 'Add Local Business Schema',
          description: 'Implement structured data for better local search visibility',
          impact: 'High impact on local search visibility',
          effort: 'Medium effort, high reward',
          estimated_improvement: 20
        },
        {
          category: 'performance',
          priority: 'low',
          title: 'Optimize Images',
          description: 'Compress and optimize images for faster loading',
          impact: 'Low impact on user experience',
          effort: 'Low effort, small reward',
          estimated_improvement: 5
        }
      ]
    };
  }

  return <AuditReportClient audit={audit} auditResult={auditResult} dbError={dbError} />;
}
