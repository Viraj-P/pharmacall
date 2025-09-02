export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Audit {
  id: string;
  user_id: string;
  business_name: string;
  website_url: string;
  city_region?: string;
  google_business_profile_url?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface AuditResult {
  id: string;
  audit_id: string;
  
  // On-page SEO
  seo_score: number;
  seo_issues: SEOIssue[];
  
  // Technical basics
  technical_score: number;
  technical_issues: TechnicalIssue[];
  
  // Local signals
  local_score: number;
  local_issues: LocalIssue[];
  
  // Performance
  performance_score: number;
  performance_issues: PerformanceIssue[];
  
  // Content
  content_score: number;
  content_issues: ContentIssue[];
  
  overall_score: number;
  created_at: string;
}

export interface SEOIssue {
  type: 'title' | 'meta_description' | 'h1' | 'canonical' | 'robots_meta';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

export interface TechnicalIssue {
  type: 'robots_txt' | 'sitemap_xml' | 'https' | 'mobile_viewport' | 'broken_links' | 'favicons';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

export interface LocalIssue {
  type: 'nap' | 'schema_local_business' | 'map_embed';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

export interface PerformanceIssue {
  type: 'core_web_vitals' | 'lighthouse_score';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
  metrics?: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
  };
}

export interface ContentIssue {
  type: 'word_count' | 'headings_structure' | 'image_alts';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

export interface CreateAuditRequest {
  business_name: string;
  website_url: string;
  city_region?: string;
  google_business_profile_url?: string;
  email: string;
}

export interface AuditStatus {
  id: string;
  status: Audit['status'];
  progress?: number;
  estimated_completion?: string;
}
