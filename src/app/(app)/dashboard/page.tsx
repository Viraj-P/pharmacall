import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Plus, Eye, Calendar, TrendingUp } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

interface Audit {
  id: string;
  business_name: string;
  website_url: string;
  status: string;
  created_at: string;
}

interface AuditResult {
  overall_score: number;
  seo_score: number;
  technical_score: number;
  local_score: number;
  performance_score: number;
  content_score: number;
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  
  // Fetch all audits
  const { data: audits } = await supabase
    .from("audits")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch audit results for scoring
  const { data: auditResults } = await supabase
    .from("audit_results")
    .select("*");

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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAuditResult = (auditId: string) => {
    return auditResults?.find(result => result.audit_id === auditId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <Globe className="h-6 w-6 text-blue-600" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                LocalIQ
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Home
              </Link>
              <Button asChild>
                <Link href="/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Audit
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">LocalIQ Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track your website SEO audits and performance over time.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{audits?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {audits?.filter(a => a.status === 'completed').length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {audits?.filter(a => a.status === 'pending').length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {auditResults && auditResults.length > 0 
                  ? Math.round(auditResults.reduce((sum, r) => sum + r.overall_score, 0) / auditResults.length)
                  : 0
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audits List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Audits</h2>
            <Button asChild>
              <Link href="/new">
                <Plus className="h-4 w-4 mr-2" />
                New Audit
              </Link>
            </Button>
          </div>

          {!audits || audits.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No audits yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Start your first SEO audit to see your website's performance.
                </p>
                <Button asChild>
                  <Link href="/new">Start Your First Audit</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {audits.map((audit) => {
                const result = getAuditResult(audit.id);
                return (
                  <Card key={audit.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {audit.business_name}
                            </h3>
                            <Badge variant="outline">{audit.status}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            {audit.website_url}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Created {formatDate(audit.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {result && (
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(result.overall_score)}`}>
                                {result.overall_score}/100
                              </div>
                              <Badge className={getScoreBadgeColor(result.overall_score)}>
                                {result.overall_score >= 80 ? 'Excellent' :
                                 result.overall_score >= 60 ? 'Good' : 'Needs Work'}
                              </Badge>
                            </div>
                          )}
                          
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/audits/${audit.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
