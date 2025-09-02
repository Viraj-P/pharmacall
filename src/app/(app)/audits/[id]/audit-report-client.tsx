"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2, Download, RefreshCw, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

  const handleDownloadPDF = () => {
    // Open PDF in new tab
    window.open(`/api/audits/${audit.id}/pdf`, '_blank');
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Database Connection Notice */}
      {dbError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-yellow-800 text-sm">
            <strong>Note:</strong> Database connection issue detected. Showing sample data. 
            Your actual audit results will appear once the connection is restored.
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
    </div>
  );
}
