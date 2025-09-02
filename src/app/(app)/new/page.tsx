"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function NewAuditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    website_url: "",
    city_region: "",
    google_business_profile_url: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create audit");

      const result = await response.json();
      router.push(`/audits/${result.id}`);
    } catch (error) {
      alert("Failed to create audit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-semibold">Local SEO Audit</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Dashboard
              </Link>
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Home
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New SEO Audit</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Fill in your business details to start a comprehensive SEO analysis.</p>
        </div>

        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="business_name" className="text-sm font-medium">Business Name *</Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="Your Business Name"
                />
              </div>

              <div>
                <Label htmlFor="website_url" className="text-sm font-medium">Website URL *</Label>
                <Input
                  id="website_url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  required
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Make sure the website is publicly accessible and not behind a login
                </p>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="city_region" className="text-sm font-medium">City/Region (optional)</Label>
                <Input
                  id="city_region"
                  value={formData.city_region}
                  onChange={(e) => setFormData({ ...formData, city_region: e.target.value })}
                  className="mt-1"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div>
                <Label htmlFor="google_business_profile_url" className="text-sm font-medium">Google Business Profile URL (optional)</Label>
                <Input
                  id="google_business_profile_url"
                  type="url"
                  value={formData.google_business_profile_url}
                  onChange={(e) => setFormData({ ...formData, google_business_profile_url: e.target.value })}
                  className="mt-1"
                  placeholder="https://business.google.com/..."
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Audit...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Start SEO Audit</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
