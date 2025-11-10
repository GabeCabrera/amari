-- Amari Database Schema
-- Wedding planning project management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('planner', 'couple', 'vendor')) NOT NULL DEFAULT 'couple',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weddings table
CREATE TABLE public.weddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  date DATE,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'cancelled')) DEFAULT 'planning',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wedding members (for sharing access)
CREATE TABLE public.wedding_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wedding_id, user_id)
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('todo', 'in-progress', 'completed')) DEFAULT 'todo',
  assignee UUID REFERENCES public.users(id) ON DELETE SET NULL,
  due_date DATE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  uploader UUID REFERENCES public.users(id) ON DELETE SET NULL NOT NULL,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages/Comments table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Weddings policies
CREATE POLICY "Users can view weddings they are members of" ON public.weddings
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.wedding_members
      WHERE wedding_id = weddings.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create weddings" ON public.weddings
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Wedding owners can update their weddings" ON public.weddings
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Wedding owners can delete their weddings" ON public.weddings
  FOR DELETE USING (owner_id = auth.uid());

-- Wedding members policies
CREATE POLICY "Users can view members of their weddings" ON public.wedding_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE id = wedding_members.wedding_id AND owner_id = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Wedding owners can manage members" ON public.wedding_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE id = wedding_members.wedding_id AND owner_id = auth.uid()
    )
  );

-- Tasks policies
CREATE POLICY "Users can view tasks from their weddings" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE id = tasks.wedding_id AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.wedding_members
          WHERE wedding_id = weddings.id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create tasks in their weddings" ON public.tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE id = tasks.wedding_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in their weddings" ON public.tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE id = tasks.wedding_id AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.wedding_members
          WHERE wedding_id = weddings.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
        )
      )
    )
  );

-- Files policies
CREATE POLICY "Users can view files from their weddings" ON public.files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE id = files.wedding_id AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.wedding_members
          WHERE wedding_id = weddings.id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can upload files to their weddings" ON public.files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE id = files.wedding_id AND owner_id = auth.uid()
    )
  );

-- Messages policies
CREATE POLICY "Users can view messages from their weddings" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE id = messages.wedding_id AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.wedding_members
          WHERE wedding_id = weddings.id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create messages in their weddings" ON public.messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE id = messages.wedding_id AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.wedding_members
          WHERE wedding_id = weddings.id AND user_id = auth.uid()
        )
      )
    )
  );

-- Create indexes for performance
CREATE INDEX idx_weddings_owner_id ON public.weddings(owner_id);
CREATE INDEX idx_wedding_members_wedding_id ON public.wedding_members(wedding_id);
CREATE INDEX idx_wedding_members_user_id ON public.wedding_members(user_id);
CREATE INDEX idx_tasks_wedding_id ON public.tasks(wedding_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee);
CREATE INDEX idx_files_wedding_id ON public.files(wedding_id);
CREATE INDEX idx_messages_wedding_id ON public.messages(wedding_id);
CREATE INDEX idx_messages_task_id ON public.messages(task_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weddings_updated_at BEFORE UPDATE ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
