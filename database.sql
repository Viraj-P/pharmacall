-- Local SEO Audit Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (handled by Supabase Auth)
-- We'll reference auth.users directly

-- Audits table
CREATE TABLE audits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  city_region TEXT,
  google_business_profile_url TEXT,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Audit results table
CREATE TABLE audit_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  
  -- Scores (0-100)
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  technical_score INTEGER CHECK (technical_score >= 0 AND technical_score <= 100),
  local_score INTEGER CHECK (local_score >= 0 AND local_score <= 100),
  performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
  content_score INTEGER CHECK (content_score >= 0 AND content_score <= 100),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  
  -- Issues (stored as JSONB)
  seo_issues JSONB DEFAULT '[]',
  technical_issues JSONB DEFAULT '[]',
  local_issues JSONB DEFAULT '[]',
  performance_issues JSONB DEFAULT '[]',
  content_issues JSONB DEFAULT '[]',
  
  -- Raw data (for reference)
  raw_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table (for PDF storage)
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  pdf_url TEXT, -- Supabase Storage URL
  shareable_url TEXT UNIQUE, -- Public shareable link
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_audits_user_id ON audits(user_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX idx_audit_results_audit_id ON audit_results(audit_id);
CREATE INDEX idx_reports_audit_id ON reports(audit_id);
CREATE INDEX idx_reports_shareable_url ON reports(shareable_url);

-- Row Level Security (RLS)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Audits: Users can only see their own audits
CREATE POLICY "Users can view own audits" ON audits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audits" ON audits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audits" ON audits
  FOR UPDATE USING (auth.uid() = user_id);

-- Audit results: Users can only see results for their own audits
CREATE POLICY "Users can view own audit results" ON audit_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM audits 
      WHERE audits.id = audit_results.audit_id 
      AND audits.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert audit results" ON audit_results
  FOR INSERT WITH CHECK (true); -- Allow system to insert results

-- Reports: Users can view their own reports, public can view shareable reports
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM audits 
      WHERE audits.id = reports.audit_id 
      AND audits.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view shareable reports" ON reports
  FOR SELECT USING (shareable_url IS NOT NULL);

CREATE POLICY "System can insert reports" ON reports
  FOR INSERT WITH CHECK (true);

-- Update trigger for audits.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_audits_updated_at 
  BEFORE UPDATE ON audits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
