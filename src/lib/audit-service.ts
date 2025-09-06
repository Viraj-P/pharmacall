import { getEnv } from "./env";

export interface AuditResult {
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
  // New comprehensive fields
  detailed_analysis: {
    seo: SEODetails;
    technical: TechnicalDetails;
    local: LocalDetails;
    performance: PerformanceDetails;
    content: ContentDetails;
  };
  recommendations: Recommendation[];
  competitor_analysis?: CompetitorAnalysis;
}

export interface SEODetails {
  title_optimization: {
    length: number;
    has_keywords: boolean;
    has_brand: boolean;
    score: number;
  };
  meta_description: {
    length: number;
    has_call_to_action: boolean;
    score: number;
  };
  heading_structure: {
    h1_count: number;
    h2_count: number;
    h3_count: number;
    hierarchy_score: number;
  };
  keyword_density: {
    primary_keywords: string[];
    density_score: number;
  };
  internal_linking: {
    internal_links: number;
    external_links: number;
    link_score: number;
  };
}

export interface TechnicalDetails {
  page_speed: {
    estimated_load_time: number;
    score: number;
  };
  mobile_optimization: {
    viewport_meta: boolean;
    responsive_images: boolean;
    touch_targets: boolean;
    score: number;
  };
  security: {
    https: boolean;
    security_headers: boolean;
    score: number;
  };
  crawlability: {
    robots_txt: boolean;
    sitemap: boolean;
    canonical_urls: boolean;
    score: number;
  };
}

export interface LocalDetails {
  nap_consistency: {
    name: boolean;
    address: boolean;
    phone: boolean;
    score: number;
  };
  local_schema: {
    has_schema: boolean;
    schema_type: string;
    score: number;
  };
  local_keywords: {
    city_mentions: number;
    region_mentions: number;
    local_terms: number;
    score: number;
  };
  map_integration: {
    has_map: boolean;
    map_type: string;
    score: number;
  };
}

export interface PerformanceDetails {
  core_web_vitals: {
    lcp: number;
    fid: number;
    cls: number;
    score: number;
  };
  page_resources: {
    total_size: number;
    image_count: number;
    script_count: number;
    score: number;
  };
  caching: {
    has_cache_headers: boolean;
    cache_score: number;
  };
}

export interface ContentDetails {
  readability: {
    flesch_score: number;
    word_count: number;
    sentence_count: number;
    score: number;
  };
  multimedia: {
    image_count: number;
    video_count: number;
    alt_text_coverage: number;
    score: number;
  };
  content_freshness: {
    last_updated: string;
    update_frequency: string;
    score: number;
  };
}

export interface Recommendation {
  category: 'seo' | 'technical' | 'local' | 'performance' | 'content';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  effort: string;
  estimated_improvement: number;
}

export interface CompetitorAnalysis {
  top_competitors: string[];
  market_position: 'leader' | 'challenger' | 'follower' | 'niche';
  competitive_gaps: string[];
}

export interface WebsiteData {
  title: string;
  metaDescription: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  images: { src: string; alt: string }[];
  links: { href: string; text: string }[];
  wordCount: number;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  isHttps: boolean;
  hasFavicon: boolean;
  mobileViewport: boolean;
  // Enhanced data
  metaKeywords: string[];
  canonicalUrl: string;
  language: string;
  charset: string;
  socialMeta: {
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCard: string;
  };
  scripts: string[];
  stylesheets: string[];
  forms: { action: string; method: string }[];
  tables: number;
  lists: number;
  buttons: number;
}

export class AuditService {
  private static async fetchWebsite(url: string): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LocalIQ/1.0; +https://github.com/Viraj-P/local-seo-audit-tool)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      if (!html || html.length < 100) {
        throw new Error('Website returned insufficient content');
      }
      
      return html;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out after 30 seconds');
        }
        throw new Error(`Failed to fetch website: ${error.message}`);
      }
      throw new Error('Failed to fetch website: Unknown error');
    }
  }

  private static parseHtml(html: string): WebsiteData {
    // Enhanced regex-based HTML parsing for server-side compatibility
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';
    
    // Extract headings with better regex
    const h1Matches = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi);
    const h2Matches = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi);
    const h3Matches = html.match(/<h3[^>]*>([^<]+)<\/h3>/gi);
    
    const headings = {
      h1: h1Matches ? h1Matches.map(h => h.replace(/<[^>]*>/g, '').trim()).filter(h => h.length > 0) : [],
      h2: h2Matches ? h2Matches.map(h => h.replace(/<[^>]*>/g, '').trim()).filter(h => h.length > 0) : [],
      h3: h3Matches ? h3Matches.map(h => h.replace(/<[^>]*>/g, '').trim()).filter(h => h.length > 0) : [],
    };
    
    // Enhanced image extraction
    const imgMatches = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi);
    const images = imgMatches ? imgMatches.map(img => {
      const srcMatch = img.match(/src=["']([^"']+)["']/i);
      const altMatch = img.match(/alt=["']([^"']*)["']/i);
      return {
        src: srcMatch ? srcMatch[1] : '',
        alt: altMatch ? altMatch[1].trim() : '',
      };
    }).filter(img => img.src.length > 0) : [];
    
    // Enhanced link extraction
    const linkMatches = html.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi);
    const links = linkMatches ? linkMatches.map(link => {
      const hrefMatch = link.match(/href=["']([^"']+)["']/i);
      const textMatch = link.match(/>([^<]+)</i);
      return {
        href: hrefMatch ? hrefMatch[1] : '',
        text: textMatch ? textMatch[1].trim() : '',
      };
    }).filter(link => link.href.length > 0 && link.text.length > 0) : [];
    
    // Calculate word count from visible text
    const visibleText = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                           .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                           .replace(/<[^>]*>/g, ' ')
                           .replace(/\s+/g, ' ')
                           .trim();
    const wordCount = visibleText.split(/\s+/).filter(word => word.length > 0).length;
    
    // Check for robots.txt
    const hasRobotsTxt = html.includes('robots.txt') || html.includes('robots');
    
    // Check for sitemap
    const hasSitemap = html.includes('sitemap') || html.includes('sitemap.xml');
    
    // Check HTTPS
    const isHttps = html.includes('https://') || html.includes('HTTPS');
    
    // Check for favicon
    const hasFavicon = html.includes('favicon') || html.includes('icon');
    
    // Check mobile viewport
    const mobileViewport = html.includes('viewport') && html.includes('width=device-width');
    
    // Enhanced data extraction
    const metaKeywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const metaKeywords = metaKeywordsMatch ? metaKeywordsMatch[1].split(',').map(k => k.trim()) : [];
    
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    const canonicalUrl = canonicalMatch ? canonicalMatch[1] : '';
    
    const languageMatch = html.match(/<html[^>]*lang=["']([^"']+)["'][^>]*>/i);
    const language = languageMatch ? languageMatch[1] : 'en';
    
    const charsetMatch = html.match(/<meta[^>]*charset=["']([^"']+)["'][^>]*>/i);
    const charset = charsetMatch ? charsetMatch[1] : 'UTF-8';
    
    // Social meta tags
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const twitterCardMatch = html.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    
    const socialMeta = {
      ogTitle: ogTitleMatch ? ogTitleMatch[1] : '',
      ogDescription: ogDescMatch ? ogDescMatch[1] : '',
      ogImage: ogImageMatch ? ogImageMatch[1] : '',
      twitterCard: twitterCardMatch ? twitterCardMatch[1] : '',
    };
    
    // Count various elements
    const scripts = html.match(/<script[^>]*>/gi) || [];
    const stylesheets = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || [];
    const forms = html.match(/<form[^>]*>/gi) || [];
    const tables = (html.match(/<table[^>]*>/gi) || []).length;
    const lists = (html.match(/<(ul|ol)[^>]*>/gi) || []).length;
    const buttons = (html.match(/<button[^>]*>/gi) || []).length;
    
    return {
      title,
      metaDescription,
      headings,
      images,
      links,
      wordCount,
      hasRobotsTxt,
      hasSitemap,
      isHttps,
      hasFavicon,
      mobileViewport,
      metaKeywords,
      canonicalUrl,
      language,
      charset,
      socialMeta,
      scripts: scripts.map(s => s.replace(/<[^>]*>/g, '').trim()),
      stylesheets: stylesheets.map(s => s.replace(/<[^>]*>/g, '').trim()),
      forms: forms.map(f => {
        const actionMatch = f.match(/action=["']([^"']*)["']/i);
        const methodMatch = f.match(/method=["']([^"']*)["']/i);
        return {
          action: actionMatch ? actionMatch[1] : '',
          method: methodMatch ? methodMatch[1] : 'GET',
        };
      }),
      tables,
      lists,
      buttons,
    };
  }

  private static async checkTechnicalBasics(websiteData: WebsiteData, url: string): Promise<{ score: number; issues: string[] }> {
    const issues: string[] = [];
    let score = 100;

    // Title tag check
    if (!websiteData.title || websiteData.title.length < 10) {
      issues.push('Missing or too short title tag (should be 10-60 characters)');
      score -= 20;
    } else if (websiteData.title.length > 60) {
      issues.push('Title tag too long (should be 10-60 characters)');
      score -= 10;
    }

    // Meta description check
    if (!websiteData.metaDescription || websiteData.metaDescription.length < 50) {
      issues.push('Missing or too short meta description (should be 50-160 characters)');
      score -= 20;
    } else if (websiteData.metaDescription.length > 160) {
      issues.push('Meta description too long (should be 50-160 characters)');
      score -= 10;
    }

    // Headings structure
    if (websiteData.headings.h1.length === 0) {
      issues.push('Missing H1 heading (essential for SEO)');
      score -= 15;
    } else if (websiteData.headings.h1.length > 1) {
      issues.push('Multiple H1 headings found (should have only one)');
      score -= 10;
    }

    if (websiteData.headings.h2.length === 0) {
      issues.push('Missing H2 headings (important for content structure)');
      score -= 10;
    }

    // Content length
    if (websiteData.wordCount < 300) {
      issues.push('Content too short (should be at least 300 words)');
      score -= 15;
    }

    // Technical checks
    if (!websiteData.isHttps) {
      issues.push('Website not using HTTPS (security and SEO requirement)');
      score -= 15;
    }

    if (!websiteData.mobileViewport) {
      issues.push('Missing mobile viewport meta tag (mobile optimization)');
      score -= 10;
    }

    if (!websiteData.hasFavicon) {
      issues.push('Missing favicon (branding and user experience)');
      score -= 5;
    }

    if (!websiteData.hasRobotsTxt) {
      issues.push('No robots.txt found (search engine crawling guidance)');
      score -= 5;
    }

    if (!websiteData.hasSitemap) {
      issues.push('No sitemap found (search engine indexing)');
      score -= 5;
    }

    // Image optimization
    const imagesWithoutAlt = websiteData.images.filter(img => !img.alt || img.alt.length === 0);
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text (accessibility and SEO)`);
      score -= Math.min(10, imagesWithoutAlt.length * 2);
    }

    return { score: Math.max(0, score), issues };
  }

  private static calculateTechnicalScore(websiteData: WebsiteData): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    // HTTPS check
    if (!websiteData.isHttps) {
      issues.push('Website not using HTTPS (security and SEO requirement)');
      score -= 20;
    }

    // Mobile optimization
    if (!websiteData.mobileViewport) {
      issues.push('Missing mobile viewport meta tag (mobile optimization)');
      score -= 20;
    }

    // Robots.txt
    if (!websiteData.hasRobotsTxt) {
      issues.push('No robots.txt found (search engine crawling guidance)');
      score -= 15;
    }

    // Sitemap
    if (!websiteData.hasSitemap) {
      issues.push('No sitemap found (search engine indexing)');
      score -= 15;
    }

    // Favicon
    if (!websiteData.hasFavicon) {
      issues.push('Missing favicon (branding and user experience)');
      score -= 10;
    }

    // Image optimization
    const imagesWithoutAlt = websiteData.images.filter(img => !img.alt || img.alt.length === 0);
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text (accessibility and SEO)`);
      score -= Math.min(15, imagesWithoutAlt.length * 3);
    }

    return { score: Math.max(0, score), issues };
  }

  private static calculateSEOScore(websiteData: WebsiteData): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    // Title optimization
    if (websiteData.title.length < 30 || websiteData.title.length > 60) {
      issues.push('Title length not optimal for search engines');
      score -= 15;
    }

    // Meta description optimization
    if (websiteData.metaDescription.length < 120 || websiteData.metaDescription.length > 160) {
      issues.push('Meta description length not optimal for search engines');
      score -= 10;
    }

    // Content quality
    if (websiteData.wordCount < 500) {
      issues.push('Content length below recommended minimum for SEO');
      score -= 20;
    }

    // Heading structure
    if (websiteData.headings.h1.length !== 1) {
      issues.push('Heading structure not following SEO best practices');
      score -= 15;
    }

    if (websiteData.headings.h2.length < 2) {
      issues.push('Insufficient heading structure for content organization');
      score -= 10;
    }

    // Internal linking
    if (websiteData.links.length < 3) {
      issues.push('Limited internal linking (important for SEO)');
      score -= 10;
    }

    return { score: Math.max(0, score), issues };
  }

  private static calculateLocalScore(websiteData: WebsiteData, cityRegion?: string): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    // Local content indicators
    if (cityRegion && !websiteData.title.toLowerCase().includes(cityRegion.toLowerCase())) {
      issues.push('City/region not mentioned in title tag');
      score -= 15;
    }

    if (cityRegion && !websiteData.metaDescription.toLowerCase().includes(cityRegion.toLowerCase())) {
      issues.push('City/region not mentioned in meta description');
      score -= 10;
    }

    // Local business indicators
    const localKeywords = ['address', 'phone', 'hours', 'location', 'map', 'directions'];
    const hasLocalInfo = localKeywords.some(keyword => 
      websiteData.title.toLowerCase().includes(keyword) || 
      websiteData.metaDescription.toLowerCase().includes(keyword)
    );

    if (!hasLocalInfo) {
      issues.push('Missing local business information indicators');
      score -= 20;
    }

    // Content relevance
    if (websiteData.wordCount < 200) {
      issues.push('Insufficient content for local SEO');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  private static calculateContentScore(websiteData: WebsiteData): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    // Content length
    if (websiteData.wordCount < 300) {
      issues.push('Content too short for comprehensive coverage');
      score -= 25;
    } else if (websiteData.wordCount < 500) {
      issues.push('Content could be more comprehensive');
      score -= 15;
    }

    // Image optimization
    const imagesWithoutAlt = websiteData.images.filter(img => !img.alt || img.alt.length === 0);
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`);
      score -= Math.min(20, imagesWithoutAlt.length * 5);
    }

    // Heading structure
    if (websiteData.headings.h1.length !== 1) {
      issues.push('Heading structure not optimal for content organization');
      score -= 15;
    }

    if (websiteData.headings.h2.length < 2) {
      issues.push('Content structure could be improved with more headings');
      score -= 10;
    }

    // Internal linking
    if (websiteData.links.length < 2) {
      issues.push('Limited internal linking for content navigation');
      score -= 10;
    }

    return { score: Math.max(0, score), issues };
  }

  private static calculatePerformanceScore(websiteData: WebsiteData): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    // Image optimization
    if (websiteData.images.length > 10) {
      issues.push('High number of images may impact loading speed');
      score -= 15;
    }

    // Content optimization
    if (websiteData.wordCount > 2000) {
      issues.push('Very long content may impact initial page load');
      score -= 10;
    }

    // Technical optimization
    if (!websiteData.mobileViewport) {
      issues.push('Missing mobile optimization (impacts performance)');
      score -= 20;
    }

    if (!websiteData.isHttps) {
      issues.push('HTTPS required for optimal performance');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  public static async performAudit(url: string, cityRegion?: string): Promise<AuditResult> {
    try {
      console.log(`Starting audit for: ${url}`);
      
      // Fetch and parse website
      const html = await this.fetchWebsite(url);
      console.log(`Successfully fetched website, HTML length: ${html.length}`);
      
      const websiteData = this.parseHtml(html);
      console.log(`Parsed HTML - Title: "${websiteData.title}", Word count: ${websiteData.wordCount}`);
      
      // Check technical basics
      const technicalBasics = await this.checkTechnicalBasics(websiteData, url);
      const fullData = { ...websiteData, ...technicalBasics };
      
      // Calculate scores
      const seo = this.calculateSEOScore(fullData);
      const technical = this.calculateTechnicalScore(fullData);
      const local = this.calculateLocalScore(fullData, cityRegion);
      const content = this.calculateContentScore(fullData);
      const performance = this.calculatePerformanceScore(fullData);
      
      // Calculate overall score
      const overallScore = Math.round(
        (seo.score + technical.score + local.score + content.score + performance.score) / 5
      );
      
      console.log(`Audit completed successfully - Overall score: ${overallScore}`);
      
      // Generate detailed analysis
      const detailedAnalysis = {
        seo: {
          title_optimization: {
            length: fullData.title.length,
            has_keywords: fullData.title.length > 0,
            has_brand: fullData.title.length > 0,
            score: seo.score,
          },
          meta_description: {
            length: fullData.metaDescription.length,
            has_call_to_action: fullData.metaDescription.includes('call') || fullData.metaDescription.includes('contact'),
            score: seo.score,
          },
          heading_structure: {
            h1_count: fullData.headings.h1.length,
            h2_count: fullData.headings.h2.length,
            h3_count: fullData.headings.h3.length,
            hierarchy_score: fullData.headings.h1.length === 1 ? 100 : 50,
          },
          keyword_density: {
            primary_keywords: fullData.metaKeywords.slice(0, 5),
            density_score: 75,
          },
          internal_linking: {
            internal_links: fullData.links.filter(l => l.href.startsWith('/') || l.href.includes(fullData.title)).length,
            external_links: fullData.links.filter(l => !l.href.startsWith('/') && !l.href.includes(fullData.title)).length,
            link_score: fullData.links.length > 5 ? 100 : fullData.links.length * 20,
          },
        },
        technical: {
          page_speed: {
            estimated_load_time: fullData.images.length * 0.5 + fullData.scripts.length * 0.3,
            score: technical.score,
          },
          mobile_optimization: {
            viewport_meta: fullData.mobileViewport,
            responsive_images: fullData.images.length > 0,
            touch_targets: fullData.buttons > 0,
            score: technical.score,
          },
          security: {
            https: fullData.isHttps,
            security_headers: true,
            score: technical.score,
          },
          crawlability: {
            robots_txt: fullData.hasRobotsTxt,
            sitemap: fullData.hasSitemap,
            canonical_urls: fullData.canonicalUrl.length > 0,
            score: technical.score,
          },
        },
        local: {
          nap_consistency: {
            name: fullData.title.length > 0,
            address: fullData.metaDescription.includes('address') || fullData.title.includes('address'),
            phone: fullData.metaDescription.includes('phone') || fullData.title.includes('phone'),
            score: local.score,
          },
          local_schema: {
            has_schema: fullData.metaKeywords.some(k => k.toLowerCase().includes('local')),
            schema_type: 'LocalBusiness',
            score: local.score,
          },
          local_keywords: {
            city_mentions: fullData.metaDescription.split(' ').filter(w => w.length > 3).length,
            region_mentions: fullData.metaDescription.split(' ').filter(w => w.length > 4).length,
            local_terms: fullData.metaKeywords.length,
            score: local.score,
          },
          map_integration: {
            has_map: fullData.images.some(img => img.src.includes('map') || img.alt.includes('map')),
            map_type: 'Google Maps',
            score: local.score,
          },
        },
        performance: {
          core_web_vitals: {
            lcp: 2.5,
            fid: 100,
            cls: 0.1,
            score: performance.score,
          },
          page_resources: {
            total_size: fullData.images.length * 100 + fullData.scripts.length * 50,
            image_count: fullData.images.length,
            script_count: fullData.scripts.length,
            score: performance.score,
          },
          caching: {
            has_cache_headers: true,
            cache_score: performance.score,
          },
        },
        content: {
          readability: {
            flesch_score: 70,
            word_count: fullData.wordCount,
            sentence_count: fullData.wordCount / 20,
            score: content.score,
          },
          multimedia: {
            image_count: fullData.images.length,
            video_count: 0,
            alt_text_coverage: fullData.images.filter(img => img.alt.length > 0).length / fullData.images.length * 100,
            score: content.score,
          },
          content_freshness: {
            last_updated: new Date().toISOString(),
            update_frequency: 'monthly',
            score: content.score,
          },
        },
      };

      // Generate recommendations
      const recommendations: Recommendation[] = [];
      
      if (seo.score < 80) {
        recommendations.push({
          category: 'seo',
          priority: seo.score < 60 ? 'high' : 'medium',
          title: 'Optimize Title Tags',
          description: 'Improve title tag length and include primary keywords',
          impact: 'High impact on search rankings',
          effort: 'Low effort, high reward',
          estimated_improvement: 15,
        });
      }
      
      if (technical.score < 80) {
        recommendations.push({
          category: 'technical',
          priority: technical.score < 60 ? 'high' : 'medium',
          title: 'Implement HTTPS',
          description: 'Secure your website with HTTPS for better rankings',
          impact: 'Medium impact on security and rankings',
          effort: 'Medium effort, good reward',
          estimated_improvement: 10,
        });
      }
      
      if (local.score < 80) {
        recommendations.push({
          category: 'local',
          priority: local.score < 60 ? 'high' : 'medium',
          title: 'Add Local Business Schema',
          description: 'Implement structured data for local business information',
          impact: 'High impact on local search visibility',
          effort: 'Medium effort, high reward',
          estimated_improvement: 20,
        });
      }

      return {
        seo_score: seo.score,
        technical_score: technical.score,
        local_score: local.score,
        performance_score: performance.score,
        content_score: content.score,
        overall_score: overallScore,
        seo_issues: seo.issues,
        technical_issues: technical.issues,
        local_issues: local.issues,
        performance_issues: performance.issues,
        content_issues: content.issues,
        raw_data: fullData,
        detailed_analysis: detailedAnalysis,
        recommendations,
      };
    } catch (error) {
      console.error(`Audit failed for ${url}:`, error);
      throw new Error(`Audit failed: ${error}`);
    }
  }
}
