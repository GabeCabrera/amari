/**
 * Database type definitions
 * Generated from Supabase schema
 */

export type UserRole = 'planner' | 'couple' | 'vendor';

export type WeddingStatus = 'planning' | 'active' | 'completed' | 'cancelled';

export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Wedding {
  id: string;
  name: string;
  date?: string;
  owner_id: string;
  status: WeddingStatus;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  wedding_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface File {
  id: string;
  wedding_id: string;
  uploader: string;
  url: string;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export interface Message {
  id: string;
  wedding_id: string;
  user_id: string;
  content: string;
  created_at: string;
}
