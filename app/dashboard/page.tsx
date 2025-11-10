import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // Fetch user profile with role
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-serif font-semibold text-[#2E2E2E]">
            Welcome back, {profile?.full_name || 'there'}!
          </h1>
          <p className="text-[#6E6E6E] mt-2">
            Role: <span className="capitalize font-medium text-[#2E2E2E]">{profile?.role}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#C9D6CF]/30 p-6">
            <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">Your Weddings</h3>
            <p className="text-[#6E6E6E]">No weddings yet. Create your first one!</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-[#C9D6CF]/30 p-6">
            <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">Recent Tasks</h3>
            <p className="text-[#6E6E6E]">No tasks assigned.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-[#C9D6CF]/30 p-6">
            <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">Upcoming</h3>
            <p className="text-[#6E6E6E]">No upcoming events.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
