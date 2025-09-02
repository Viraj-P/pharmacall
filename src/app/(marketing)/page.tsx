import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Globe, TrendingUp, MapPin, Zap, FileText, Search, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-8 w-8 text-blue-600" />
                <MapPin className="h-4 w-4 text-green-600 absolute -bottom-1 -right-1" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                LocalIQ
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Dashboard
              </Link>
              <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <Link href="/new">Start Audit</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Automated Local SEO Reports in
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Get actionable insights to improve rankings, attract more local customers, and close more clients — no SEO expertise required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Link href="/new">Start Free Audit</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>One-Click Website Audit</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive analysis covering on-page SEO, technical basics, local signals, performance, and content quality.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Instant Shareable Reports</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Generate professional reports instantly with shareable links perfect for client pitches and presentations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Local SEO Focus</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Specialized analysis for local businesses with NAP consistency, schema markup, and map integration.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Core Web Vitals analysis via PageSpeed Insights for optimal user experience and search rankings.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Downloadable PDF Reports</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Professional PDF reports with actionable insights and improvement recommendations for clients.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Recurring Re-audits</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Track progress over time with scheduled re-audits to show clients continuous improvement.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ideal Users Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Perfect For
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
              <CardHeader className="text-center">
                <h3 className="text-xl font-semibold text-blue-600">Freelancers</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Pitch SEO services with professional audit reports that demonstrate your expertise and value.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
              <CardHeader className="text-center">
                <h3 className="text-xl font-semibold text-green-600">Agencies</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Bulk audits for multiple clients with white-label branding and recurring re-audit capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
              <CardHeader className="text-center">
                <h3 className="text-xl font-semibold text-purple-600">Small Businesses</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Check local SEO health without hiring expensive consultants or learning complex SEO tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Simple Pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
              <CardHeader className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free</h3>
                <p className="text-gray-600 dark:text-gray-300">Perfect for trying out LocalIQ</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$0</div>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    1 audit per month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Basic SEO analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Shareable report links
                  </li>
                </ul>
                <Button asChild className="w-full mt-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  <Link href="/new">Start Free</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 dark:border-blue-400 shadow-xl bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-3 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pro</h3>
                <p className="text-gray-600 dark:text-gray-300">For professionals and agencies</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$29<span className="text-lg text-gray-600">/month</span></div>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    10 audits per month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Recurring re-audits
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    White-label branding
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    PDF downloads
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Priority support
                  </li>
                </ul>
                <Button asChild className="w-full mt-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  <Link href="/new">Start Pro Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Local SEO?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of professionals who trust LocalIQ for their SEO audits.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            <Link href="/new">Start Your Free Audit</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Search className="h-6 w-6 text-blue-600" />
              <MapPin className="h-3 w-3 text-green-600 absolute -bottom-0.5 -right-0.5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              LocalIQ
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 LocalIQ. Automated Local SEO Reports in Minutes.
          </p>
        </div>
      </footer>
    </div>
  );
}
