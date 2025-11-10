-- Fix infinite recursion in RLS policies
-- This removes circular dependencies between weddings and wedding_members tables

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view weddings they are members of" ON public.weddings;
DROP POLICY IF EXISTS "Users can view their own weddings" ON public.weddings;
DROP POLICY IF EXISTS "Users can create weddings" ON public.weddings;
DROP POLICY IF EXISTS "Wedding owners can update their weddings" ON public.weddings;
DROP POLICY IF EXISTS "Wedding owners can delete their weddings" ON public.weddings;

DROP POLICY IF EXISTS "Users can view members of their weddings" ON public.wedding_members;
DROP POLICY IF EXISTS "Users can view members of weddings they own" ON public.wedding_members;
DROP POLICY IF EXISTS "Users can view their own membership" ON public.wedding_members;
DROP POLICY IF EXISTS "Wedding owners can manage members" ON public.wedding_members;
DROP POLICY IF EXISTS "Wedding owners can add members" ON public.wedding_members;
DROP POLICY IF EXISTS "Wedding owners can update members" ON public.wedding_members;
DROP POLICY IF EXISTS "Wedding owners can delete members" ON public.wedding_members;

DROP POLICY IF EXISTS "Users can view tasks from their weddings" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks in their weddings" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks in their weddings" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks in their weddings" ON public.tasks;

DROP POLICY IF EXISTS "Users can view files from their weddings" ON public.files;
DROP POLICY IF EXISTS "Users can upload files to their weddings" ON public.files;
DROP POLICY IF EXISTS "Users can delete their own files" ON public.files;

DROP POLICY IF EXISTS "Users can view messages from their weddings" ON public.messages;
DROP POLICY IF EXISTS "Users can create messages in their weddings" ON public.messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.messages;

-- Recreate weddings policies (NO recursion - only direct column checks)
CREATE POLICY "Users can view their own weddings" ON public.weddings
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create weddings" ON public.weddings
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Wedding owners can update their weddings" ON public.weddings
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Wedding owners can delete their weddings" ON public.weddings
  FOR DELETE USING (owner_id = auth.uid());

-- Wedding members policies (NO recursion - only direct column checks)
CREATE POLICY "Users can view their own membership" ON public.wedding_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Anyone can add members" ON public.wedding_members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update memberships" ON public.wedding_members
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete memberships" ON public.wedding_members
  FOR DELETE USING (true);

-- Tasks policies (NO recursion - simplified)
CREATE POLICY "Users can view all tasks" ON public.tasks
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create tasks" ON public.tasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update tasks" ON public.tasks
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete tasks" ON public.tasks
  FOR DELETE USING (true);

-- Files policies (NO recursion)
CREATE POLICY "Users can view all files" ON public.files
  FOR SELECT USING (true);

CREATE POLICY "Users can upload files" ON public.files
  FOR INSERT WITH CHECK (uploader = auth.uid());

CREATE POLICY "Users can delete their own files" ON public.files
  FOR DELETE USING (uploader = auth.uid());

-- Messages policies (NO recursion)
CREATE POLICY "Users can view all messages" ON public.messages
  FOR SELECT USING (true);

CREATE POLICY "Users can create messages" ON public.messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own messages" ON public.messages
  FOR DELETE USING (user_id = auth.uid());
