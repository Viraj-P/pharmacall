"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2, Download, RefreshCw, Copy, Check, Lock, TrendingUp, Target, Zap, BarChart3, MapPin, Globe, Smartphone, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PDFService, PDFAuditData } from "@/lib/pdf-service";

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
  detailed_analysis?: {
    seo: any;
    technical: any;
    local: any;
    performance: any;
    content: any;
  };
  recommendations?: any[];
  competitor_analysis?: any;
}

interface Audit {
  id: string;
  business_name: string;
  website_url: string;
  status: string;
  created_at: string;
}

export default function AuditReportClient({ 
  audit, 
  auditResult, 
  dbError 
}: { 
  audit: Audit; 
  auditResult: AuditResult | null; 
  dbError: boolean;
}) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isReauditing, setIsReauditing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await fetch(`/api/audits/${audit.id}/share`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.shareable_url);
        toast.success('Shareable link created!');
      } else {
        toast.error('Failed to create shareable link');
      }
    } catch (error) {
      toast.error('Error creating shareable link');
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const handleReaudit = async () => {
    setIsReauditing(true);
    try {
      const response = await fetch(`/api/audits/${audit.id}/reaudit`, {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success('Re-audit started! Refreshing page...');
        // Refresh the page to show new results
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(`Re-audit failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Error starting re-audit');
    } finally {
      setIsReauditing(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Prepare data for PDF generation
      const pdfData: PDFAuditData = {
        business_name: audit.business_name,
        website_url: audit.website_url,
        created_at: audit.created_at,
        overall_score: result.overall_score,
        seo_score: result.seo_score,
        technical_score: result.technical_score,
        local_score: result.local_score,
        performance_score: result.performance_score,
        content_score: result.content_score,
        seo_issues: result.seo_issues,
        technical_issues: result.technical_issues,
        local_issues: result.local_issues,
        performance_issues: result.performance_issues,
        content_issues: result.content_issues,
      };

      // Show loading state
      toast.loading('Generating PDF report...');

      // Generate PDF
      const pdfBlob = await PDFService.generateAuditReport(pdfData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `localiq-audit-${audit.business_name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  // If no results in DB, use fallback data
  const result: AuditResult = auditResult || {
    id: audit.id,
    audit_id: audit.id,
    seo_score: 75,
    technical_score: 70,
    local_score: 65,
    performance_score: 80,
    content_score: 85,
    overall_score: 75,
    seo_issues: ['Sample SEO issue'],
    technical_issues: ['Sample technical issue'],
    local_issues: ['Sample local issue'],
    performance_issues: ['Sample performance issue'],
    content_issues: ['Sample content issue'],
    raw_data: {},
    created_at: new Date().toISOString(),
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Database Connection Notice */}
      {dbError && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-blue-800 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs">ℹ</span>
              </div>
              <strong>Demo Mode Active</strong>
            </div>
            <p className="mb-2">
              Database connection not available. Showing comprehensive sample data to demonstrate LocalIQ's capabilities.
            </p>
            <div className="text-xs text-blue-600">
              <strong>What you're seeing:</strong> Full-featured audit report with detailed analysis, recommendations, and premium insights.
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        {!shareUrl ? (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleShare}
            disabled={isSharing}
          >
            <Share2 className="h-4 w-4" />
            {isSharing ? 'Creating...' : 'Share Report'}
          </Button>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="text-sm bg-transparent border-none outline-none text-green-800 min-w-64"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="text-green-600 hover:text-green-800"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
        <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleReaudit} disabled={isReauditing}>
          <RefreshCw className="h-4 w-4" />
          {isReauditing ? 'Re-auditing...' : 'Re-audit'}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
          onClick={() => setShowPaywall(!showPaywall)}
        >
          <Lock className="h-4 w-4" />
          Premium Insights
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{audit.business_name}</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{audit.website_url}</p>
        <div className="flex items-center gap-4 mt-4">
          <Badge className={getScoreBadgeColor(result.overall_score)}>
            {result.overall_score}/100
          </Badge>
          <Badge variant="outline">{audit.status}</Badge>
          <span className="text-sm text-gray-500">
            {formatDate(audit.created_at)}
          </span>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className={`text-4xl font-bold ${getScoreColor(result.overall_score)}`}>
              {result.overall_score}/100
            </div>
            <Progress value={result.overall_score} className="flex-1" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {result.overall_score >= 80 ? "Excellent! Your website is well-optimized." :
             result.overall_score >= 60 ? "Good, but there's room for improvement." :
             "Your website needs significant optimization work."}
          </p>
        </CardContent>
      </Card>

      {/* Score Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(result.seo_score)}`}>
              {result.seo_score}
            </div>
            <p className="text-sm text-gray-600">SEO Score</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(result.technical_score)}`}>
              {result.technical_score}
            </div>
            <p className="text-sm text-gray-600">Technical</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(result.local_score)}`}>
              {result.local_score}
            </div>
            <p className="text-sm text-gray-600">Local</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(result.performance_score)}`}>
              {result.performance_score}
            </div>
            <p className="text-sm text-gray-600">Performance</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(result.content_score)}`}>
              {result.content_score}
            </div>
            <p className="text-sm text-gray-600">Content</p>
          </CardContent>
        </Card>
      </div>

      {/* Premium Insights Paywall */}
      {showPaywall && (
        <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-900">Unlock Premium Insights</CardTitle>
            <p className="text-blue-700">
              Get detailed competitor analysis, advanced recommendations, and actionable insights
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Competitor Analysis</h4>
                <p className="text-sm text-gray-600">See how you stack up against competitors</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Advanced Metrics</h4>
                <p className="text-sm text-gray-600">Deep dive into Core Web Vitals and more</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Actionable Insights</h4>
                <p className="text-sm text-gray-600">Prioritized recommendations with impact scores</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Upgrade to Pro - $29/month
              </Button>
              <Button variant="outline" onClick={() => setShowPaywall(false)}>
                Maybe Later
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="seo" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="seo">SEO ({result.seo_score})</TabsTrigger>
          <TabsTrigger value="technical">Technical ({result.technical_score})</TabsTrigger>
          <TabsTrigger value="local">Local ({result.local_score})</TabsTrigger>
          <TabsTrigger value="performance">Performance ({result.performance_score})</TabsTrigger>
          <TabsTrigger value="content">Content ({result.content_score})</TabsTrigger>
        </TabsList>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                On-page SEO
                <span className={getScoreColor(result.seo_score)}>{result.seo_score}/100</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={result.seo_score} className="mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Analysis of title tags, meta descriptions, headings, and more.
              </p>
              
              {/* Detailed SEO Analysis */}
              {result.detailed_analysis?.seo && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Title Optimization</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span className={result.detailed_analysis.seo.title_optimization.length >= 30 && result.detailed_analysis.seo.title_optimization.length <= 60 ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.seo.title_optimization.length} characters
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Keywords:</span>
                        <span className={result.detailed_analysis.seo.title_optimization.has_keywords ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.seo.title_optimization.has_keywords ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Meta Description</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span className={result.detailed_analysis.seo.meta_description.length >= 120 && result.detailed_analysis.seo.meta_description.length <= 160 ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.seo.meta_description.length} characters
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Call to Action:</span>
                        <span className={result.detailed_analysis.seo.meta_description.has_call_to_action ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.seo.meta_description.has_call_to_action ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {result.seo_issues.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Issues Found:</h4>
                  <ul className="space-y-1">
                    {result.seo_issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-green-600 text-sm">No SEO issues found! 🎉</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Technical Basics
                <span className={getScoreColor(result.technical_score)}>{result.technical_score}/100</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={result.technical_score} className="mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Robots.txt, sitemap, HTTPS, mobile-friendliness, and more.
              </p>
              
              {/* Detailed Technical Analysis */}
              {result.detailed_analysis?.technical && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Security & Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>HTTPS:</span>
                        <span className={result.detailed_analysis.technical.security.https ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.technical.security.https ? '✓ Secure' : '✗ Not Secure'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobile Viewport:</span>
                        <span className={result.detailed_analysis.technical.mobile_optimization.viewport_meta ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.technical.mobile_optimization.viewport_meta ? '✓ Optimized' : '✗ Not Optimized'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Crawlability</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Robots.txt:</span>
                        <span className={result.detailed_analysis.technical.crawlability.robots_txt ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.technical.crawlability.robots_txt ? '✓ Found' : '✗ Missing'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sitemap:</span>
                        <span className={result.detailed_analysis.technical.crawlability.sitemap ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.technical.crawlability.sitemap ? '✓ Found' : '✗ Missing'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {result.technical_issues.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Issues Found:</h4>
                  <ul className="space-y-1">
                    {result.technical_issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-green-600 text-sm">No technical issues found! 🎉</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Local Signals
                <span className={getScoreColor(result.local_score)}>{result.local_score}/100</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={result.local_score} className="mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                NAP consistency, local schema, and map integration.
              </p>
              
              {/* Detailed Local Analysis */}
              {result.detailed_analysis?.local && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">NAP Consistency</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Business Name:</span>
                        <span className={result.detailed_analysis.local.nap_consistency.name ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.local.nap_consistency.name ? '✓ Consistent' : '✗ Inconsistent'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Address:</span>
                        <span className={result.detailed_analysis.local.nap_consistency.address ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.local.nap_consistency.address ? '✓ Found' : '✗ Missing'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Local Optimization</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Local Schema:</span>
                        <span className={result.detailed_analysis.local.local_schema.has_schema ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.local.local_schema.has_schema ? '✓ Implemented' : '✗ Missing'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Map Integration:</span>
                        <span className={result.detailed_analysis.local.map_integration.has_map ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.local.map_integration.has_map ? '✓ Found' : '✗ Missing'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {result.local_issues.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Issues Found:</h4>
                  <ul className="space-y-1">
                    {result.local_issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-green-600 text-sm">No local SEO issues found! 🎉</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Performance
                <span className={getScoreColor(result.performance_score)}>{result.performance_score}/100</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={result.performance_score} className="mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Core Web Vitals and page speed analysis.
              </p>
              
              {/* Detailed Performance Analysis */}
              {result.detailed_analysis?.performance && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Core Web Vitals</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>LCP:</span>
                        <span className={result.detailed_analysis.performance.core_web_vitals.lcp <= 2.5 ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.performance.core_web_vitals.lcp}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>FID:</span>
                        <span className={result.detailed_analysis.performance.core_web_vitals.fid <= 100 ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.performance.core_web_vitals.fid}ms
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Page Resources</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Images:</span>
                        <span>{result.detailed_analysis.performance.page_resources.image_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scripts:</span>
                        <span>{result.detailed_analysis.performance.page_resources.script_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {result.performance_issues.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Issues Found:</h4>
                  <ul className="space-y-1">
                    {result.performance_issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-green-600 text-sm">No performance issues found! 🎉</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Content Quality
                <span className={getScoreColor(result.content_score)}>{result.content_score}/100</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={result.content_score} className="mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Word count, heading structure, and image optimization.
              </p>
              
              {/* Detailed Content Analysis */}
              {result.detailed_analysis?.content && (
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Readability</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Word Count:</span>
                        <span className={result.detailed_analysis.content.readability.word_count >= 500 ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.content.readability.word_count} words
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Flesch Score:</span>
                        <span className={result.detailed_analysis.content.readability.flesch_score >= 60 ? 'text-green-600' : 'text-red-600'}>
                          {result.detailed_analysis.content.readability.flesch_score}/100
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Multimedia</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Images:</span>
                        <span>{result.detailed_analysis.content.multimedia.image_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Alt Text Coverage:</span>
                        <span className={result.detailed_analysis.content.multimedia.alt_text_coverage >= 80 ? 'text-green-600' : 'text-red-600'}>
                          {Math.round(result.detailed_analysis.content.multimedia.alt_text_coverage)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {result.content_issues.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Issues Found:</h4>
                  <ul className="space-y-1">
                    {result.content_issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-green-600 text-sm">No content issues found! 🎉</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recommendations Section */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Actionable Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">Impact:</span>
                      <p className="text-gray-600">{rec.impact}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Effort:</span>
                      <p className="text-gray-600">{rec.effort}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Improvement:</span>
                      <p className="text-gray-600">+{rec.estimated_improvement} points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
