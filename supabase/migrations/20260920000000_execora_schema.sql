-- Execora AI Execution Readiness Engine PostgreSQL Database Schema
-- Supabase Migration file

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  cognee_dataset_id TEXT,
  readiness_score INT DEFAULT 62,
  readiness_status TEXT DEFAULT 'READY WITH WARNINGS',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sources / Ingested Documents
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  content TEXT NOT NULL,
  parsed_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analysis History
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  summary TEXT,
  readiness_score INT NOT NULL,
  readiness_status TEXT NOT NULL,
  confidence FLOAT DEFAULT 0.85,
  raw_analysis_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extracted Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  task_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT DEFAULT 'Unassigned',
  priority TEXT DEFAULT 'Medium',
  deadline TEXT,
  status TEXT DEFAULT 'Pending',
  source_evidence TEXT,
  duration_hours FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dependencies
CREATE TABLE IF NOT EXISTS public.dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  from_task_key TEXT NOT NULL,
  to_task_key TEXT NOT NULL,
  relationship_type TEXT DEFAULT 'depends_on',
  confidence_type TEXT DEFAULT 'EXPLICIT',
  source_evidence TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risks
CREATE TABLE IF NOT EXISTS public.risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  risk_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  evidence TEXT,
  classification TEXT DEFAULT 'CONFIRMED',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clarification Items
CREATE TABLE IF NOT EXISTS public.clarifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  reason TEXT NOT NULL,
  impact TEXT DEFAULT 'HIGH',
  priority INT DEFAULT 1,
  status TEXT DEFAULT 'OPEN',
  answer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Action Plans & Steps
CREATE TABLE IF NOT EXISTS public.execution_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  steps JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scenarios & Simulation Results
CREATE TABLE IF NOT EXISTS public.scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  readiness_score INT NOT NULL,
  readiness_status TEXT NOT NULL,
  affected_tasks JSONB,
  affected_people JSONB,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Source Evidence Traceability
CREATE TABLE IF NOT EXISTS public.source_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_name TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Fast Query Performance
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_deps_project ON public.dependencies(project_id);
CREATE INDEX IF NOT EXISTS idx_risks_project ON public.risks(project_id);
CREATE INDEX IF NOT EXISTS idx_clarifications_project ON public.clarifications(project_id);
CREATE INDEX IF NOT EXISTS idx_analyses_project ON public.analyses(project_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for Hackathon Demo Mode
CREATE POLICY "Allow public select on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert on projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tasks" ON public.tasks FOR INSERT WITH CHECK (true);
