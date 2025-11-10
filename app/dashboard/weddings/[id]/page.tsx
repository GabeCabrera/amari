import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default async function WeddingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }

  // Fetch wedding details
  const { data: wedding, error: weddingError } = await supabase
    .from('weddings')
    .select('*')
    .eq('id', id)
    .single();

  if (weddingError || !wedding) {
    redirect('/dashboard/weddings');
  }

  // Check if user has access to this wedding
  const isOwner = wedding.owner_id === user.id;
  const { data: membership } = await supabase
    .from('wedding_members')
    .select('*')
    .eq('wedding_id', id)
    .eq('user_id', user.id)
    .single();

  if (!isOwner && !membership) {
    redirect('/dashboard/weddings');
  }

  // Fetch tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:users(full_name, email)
    `)
    .eq('wedding_id', id)
    .order('created_at', { ascending: false });

  const tasksByStatus = {
    todo: tasks?.filter(t => t.status === 'todo') || [],
    'in-progress': tasks?.filter(t => t.status === 'in-progress') || [],
    completed: tasks?.filter(t => t.status === 'completed') || [],
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Wedding Header */}
      <div className="glass-card p-8 mb-8 animate-fade-in">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-serif font-semibold text-[#2E2E2E] mb-2">
              {wedding.name}
            </h1>
            {wedding.description && (
              <p className="text-[#6E6E6E] text-lg">{wedding.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-[#C9D6CF]/30 to-[#E6D9FF]/30 text-[#2E2E2E] capitalize backdrop-blur-sm">
              {wedding.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wedding.date && (
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#EFB7B7] to-[#F5C16C] text-white">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#6E6E6E]">Wedding Date</p>
                <p className="text-sm font-medium text-[#2E2E2E]">
                  {new Date(wedding.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#C9D6CF] to-[#E6D9FF] text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-[#6E6E6E]">Tasks Completed</p>
              <p className="text-sm font-medium text-[#2E2E2E]">
                {tasksByStatus.completed.length} / {tasks?.length || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#F5C16C] to-[#EFB7B7] text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-[#6E6E6E]">Team Members</p>
              <p className="text-sm font-medium text-[#2E2E2E]">
                {isOwner ? 'Owner' : membership?.role || 'Member'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Board */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-semibold text-[#2E2E2E]">Tasks</h2>
          <Button className="bg-[#EFB7B7] hover:bg-[#F5C16C] text-[#2E2E2E] font-medium transition-colors">
            Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-[#6E6E6E]" />
              <h3 className="font-semibold text-[#2E2E2E]">To Do</h3>
              <span className="ml-auto text-sm text-[#6E6E6E] bg-white/30 px-2 py-1 rounded-full">
                {tasksByStatus.todo.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.todo.length > 0 ? (
                tasksByStatus.todo.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    <h4 className="font-medium text-[#2E2E2E] mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-[#6E6E6E] line-clamp-2 mb-2">{task.description}</p>
                    )}
                    {task.due_date && (
                      <p className="text-xs text-[#6E6E6E]">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-[#C97070]/20 text-[#C97070]' :
                        task.priority === 'medium' ? 'bg-[#F5C16C]/20 text-[#F5C16C]' :
                        'bg-[#C9D6CF]/20 text-[#C9D6CF]'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#6E6E6E] text-center py-8">No tasks</p>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-[#F5C16C]" />
              <h3 className="font-semibold text-[#2E2E2E]">In Progress</h3>
              <span className="ml-auto text-sm text-[#6E6E6E] bg-white/30 px-2 py-1 rounded-full">
                {tasksByStatus['in-progress'].length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus['in-progress'].length > 0 ? (
                tasksByStatus['in-progress'].map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    <h4 className="font-medium text-[#2E2E2E] mb-1">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-[#6E6E6E] line-clamp-2 mb-2">{task.description}</p>
                    )}
                    {task.due_date && (
                      <p className="text-xs text-[#6E6E6E]">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-[#C97070]/20 text-[#C97070]' :
                        task.priority === 'medium' ? 'bg-[#F5C16C]/20 text-[#F5C16C]' :
                        'bg-[#C9D6CF]/20 text-[#C9D6CF]'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#6E6E6E] text-center py-8">No tasks</p>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-[#C9D6CF]" />
              <h3 className="font-semibold text-[#2E2E2E]">Completed</h3>
              <span className="ml-auto text-sm text-[#6E6E6E] bg-white/30 px-2 py-1 rounded-full">
                {tasksByStatus.completed.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.completed.length > 0 ? (
                tasksByStatus.completed.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:scale-105 transition-all duration-200 cursor-pointer opacity-75"
                  >
                    <h4 className="font-medium text-[#2E2E2E] mb-1 line-through">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-[#6E6E6E] line-clamp-2 mb-2">{task.description}</p>
                    )}
                    {task.due_date && (
                      <p className="text-xs text-[#6E6E6E]">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#6E6E6E] text-center py-8">No tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
