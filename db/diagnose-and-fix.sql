-- Diagnostic and fix for user profile creation trigger

-- Step 1: Check if trigger exists
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Step 2: Check if function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Step 3: Check for any errors in the trigger
-- Look at recent logs
SELECT * FROM pg_stat_user_functions 
WHERE funcname = 'handle_new_user';

-- Step 4: Manually test the function for existing users
-- Run this to backfill profiles for existing auth users without profiles
INSERT INTO public.users (id, email, role, full_name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'couple'),
  COALESCE(au.raw_user_meta_data->>'full_name', '')
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- This will create profiles for any auth users that don't have a profile yet
