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
}

export class AuditService {
  private static async fetchWebsite(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch website: ${error}`);
    }
  }

  private static parseHtml(html: string): WebsiteData {
    // Simple regex-based HTML parsing for server-side compatibility
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';
    
    // Extract headings
    const h1Matches = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi);
    const h2Matches = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi);
    const h3Matches = html.match(/<h3[^>]*>([^<]+)<\/h3>/gi);
    
    const headings = {
      h1: h1Matches ? h1Matches.map(h => h.replace(/<[^>]*>/g, '').trim()) : [],
      h2: h2Matches ? h2Matches.map(h => h.replace(/<[^>]*>/g, '').trim()) : [],
      h3: h3Matches ? h3Matches.map(h => h.replace(/<[^>]*>/g, '').trim()) : [],
    };
    
    // Extract images
    const imgMatches = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi);
    const images = imgMatches ? imgMatches.map(img => {
      const srcMatch = img.match(/src=["']([^"']+)["']/i);
      const altMatch = img.match(/alt=["']([^"']*)["']/i);
      return {
        src: srcMatch ? srcMatch[1] : '',
        alt: altMatch ? altMatch[1] : '',
      };
    }) : [];
    
    // Extract links
    const linkMatches = html.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi);
    const links = linkMatches ? linkMatches.map(link => {
      const hrefMatch = link.match(/href=["']([^"']+)["']/i);
      const textMatch = link.match(/>([^<]+)</i);
      return {
        href: hrefMatch ? hrefMatch[1] : '',
        text: textMatch ? textMatch[1].trim() : '',
      };
    }) : [];
    
    // Count words (remove HTML tags first)
    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').length;
    
    return {
      title,
      metaDescription,
      headings,
      images,
      links,
      wordCount,
      hasRobotsTxt: false, // Will be checked separately
      hasSitemap: false,   // Will be checked separately
      isHttps: false,      // Will be checked separately
      hasFavicon: false,   // Will be checked separately
      mobileViewport: false, // Will be checked separately
    };
  }

  private static async checkTechnicalBasics(url: string): Promise<Partial<WebsiteData>> {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    
    const results: Partial<WebsiteData> = {};
    
    // Check robots.txt
    try {
      const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
      results.hasRobotsTxt = robotsResponse.ok;
    } catch {
      results.hasRobotsTxt = false;
    }
    
    // Check sitemap
    try {
      const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
      results.hasSitemap = sitemapResponse.ok;
    } catch {
      results.hasSitemap = false;
    }
    
    // Check HTTPS
    results.isHttps = urlObj.protocol === 'https:';
    
    // Check favicon
    try {
      const faviconResponse = await fetch(`${baseUrl}/favicon.ico`);
      results.hasFavicon = faviconResponse.ok;
    } catch {
      results.hasFavicon = false;
    }
    
    // Check mobile viewport
    try {
      const response = await fetch(url);
      const html = await response.text();
      results.mobileViewport = html.includes('viewport') && html.includes('width=device-width');
    } catch {
      results.mobileViewport = false;
    }
    
    return results;
  }

  private static calculateSEOScore(data: WebsiteData): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;
    
    if (!data.title) {
      issues.push('Missing title tag');
      score -= 20;
    } else if (data.title.length < 30 || data.title.length > 60) {
      issues.push('Title length should be between 30-60 characters');
      score -= 10;
    }
    
    if (!data.metaDescription) {
      issues.push('Missing meta description');
      score -= 15;
    } else if (data.metaDescription.length < 120 || data.metaDescription.length > 160) {
      issues.push('Meta description should be between 120-160 characters');
      score -= 10;
    }
    
    if (data.headings.h1.length === 0) {
      issues.push('Missing H1 heading');
      score -= 15;
    } else if (data.headings.h1.length > 1) {
      issues.push('Multiple H1 headings found (should be only one)');
      score -= 10;
    }
    
    const imagesWithoutAlt = data.images.filter(img => !img.alt).length;
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images missing alt text`);
      score -= Math.min(15, imagesWithoutAlt * 3);
    }
    
    return { score: Math.max(0, score), issues };
  }

  private static calculateTechnicalScore(data: WebsiteData): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;
    
    if (!data.isHttps) {
      issues.push('Website not using HTTPS');
      score -= 20;
    }
    
    if (!data.hasRobotsTxt) {
      issues.push('Missing robots.txt file');
      score -= 15;
    }
    
    if (!data.hasSitemap) {
      issues.push('Missing sitemap.xml');
      score -= 15;
    }
    
    if (!data.hasFavicon) {
      issues.push('Missing favicon');
      score -= 10;
    }
    
    if (!data.mobileViewport) {
      issues.push('Missing mobile viewport meta tag');
      score -= 15;
    }
    
    return { score: Math.max(0, score), issues };
  }

  private static calculateLocalScore(data: WebsiteData, cityRegion?: string): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;
    
    // Check for address information in content
    const hasAddress = data.wordCount > 0 && (
      data.title.toLowerCase().includes('address') ||
      data.metaDescription.toLowerCase().includes('address') ||
      data.headings.h1.some(h => h.toLowerCase().includes('address')) ||
      data.headings.h2.some(h => h.toLowerCase().includes('address'))
    );
    
    if (!hasAddress) {
      issues.push('No clear address information found');
      score -= 20;
    }
    
    // Check for phone number patterns
    const phonePattern = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const hasPhone = phonePattern.test(data.title + ' ' + data.metaDescription);
    
    if (!hasPhone) {
      issues.push('No phone number found');
      score -= 15;
    }
    
    // Check for business hours
    const hasHours = /hours?|open|closed|monday|tuesday|wednesday|thursday|friday|saturday|sunday/i.test(
      data.title + ' ' + data.metaDescription
    );
    
    if (!hasHours) {
      issues.push('No business hours information found');
      score -= 15;
    }
    
    return { score: Math.max(0, score), issues };
  }

  private static calculateContentScore(data: WebsiteData): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;
    
    if (data.wordCount < 300) {
      issues.push('Content too short (less than 300 words)');
      score -= 25;
    } else if (data.wordCount < 500) {
      issues.push('Content could be longer (less than 500 words)');
      score -= 15;
    }
    
    if (data.headings.h2.length === 0 && data.headings.h3.length === 0) {
      issues.push('No subheadings found');
      score -= 20;
    }
    
    const imagesWithoutAlt = data.images.filter(img => !img.alt).length;
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images missing alt text`);
      score -= Math.min(20, imagesWithoutAlt * 4);
    }
    
    return { score: Math.max(0, score), issues };
  }

  private static calculatePerformanceScore(): { score: number; issues: string[] } {
    // This would integrate with PageSpeed Insights API
    // For now, return a placeholder score
    return { score: 75, issues: ['Performance analysis requires PageSpeed Insights API key'] };
  }

  public static async performAudit(url: string, cityRegion?: string): Promise<AuditResult> {
    try {
      // Fetch and parse website
      const html = await this.fetchWebsite(url);
      const websiteData = this.parseHtml(html);
      
      // Check technical basics
      const technicalBasics = await this.checkTechnicalBasics(url);
      const fullData = { ...websiteData, ...technicalBasics };
      
      // Calculate scores
      const seo = this.calculateSEOScore(fullData);
      const technical = this.calculateTechnicalScore(fullData);
      const local = this.calculateLocalScore(fullData, cityRegion);
      const content = this.calculateContentScore(fullData);
      const performance = this.calculatePerformanceScore();
      
      // Calculate overall score
      const overallScore = Math.round(
        (seo.score + technical.score + local.score + content.score + performance.score) / 5
      );
      
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
      };
    } catch (error) {
      throw new Error(`Audit failed: ${error}`);
    }
  }
}
