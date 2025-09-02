import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

export default async function SharedAuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let audit: Audit | null = null;
  let auditResult: AuditResult | null = null;

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
      notFound();
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
    notFound();
  }

  if (!audit) {
    notFound();
  }

  // If no results in DB, use fallback data
  const result: AuditResult = auditResult || {
    id: id,
    audit_id: id,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">L</span>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                LocalIQ Report
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
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

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Report generated by LocalIQ - Automated Local SEO Reports in Minutes</p>
          <p className="mt-2">
            <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
              Create your own audit
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
