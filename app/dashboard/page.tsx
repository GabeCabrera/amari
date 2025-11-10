import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

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

  // Fetch user's weddings
  const { data: weddings } = await supabase
    .from('weddings')
    .select('*')
    .or(`owner_id.eq.${user.id},id.in.(${
      // Also get weddings where user is a member
      await supabase
        .from('wedding_members')
        .select('wedding_id')
        .eq('user_id', user.id)
        .then(({ data }) => data?.map(m => m.wedding_id).join(',') || '')
    })`)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#2E2E2E] mb-2">
            Welcome back, {profile?.full_name || 'there'}!
          </h1>
          <p className="text-[#6E6E6E]">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E6D9FF]/50 text-[#2E2E2E] font-medium capitalize text-sm">
              {profile?.role} account
            </span>
          </p>
        </div>
        <Button 
          asChild
          className="bg-[#EFB7B7] hover:bg-[#F5C16C] text-[#2E2E2E] font-medium rounded-xl px-6 py-6 transition-all duration-200 hover:scale-105 shadow-lg border-0"
        >
          <Link href="/dashboard/weddings/new">
            <Plus className="mr-2 h-5 w-5" />
            New Wedding
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 hover:scale-105 transition-all duration-200 group">
          <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2 group-hover:text-[#EFB7B7] transition-colors">Your Weddings</h3>
          {weddings && weddings.length > 0 ? (
            <p className="text-3xl font-bold text-[#EFB7B7]">{weddings.length}</p>
          ) : (
            <p className="text-[#6E6E6E]">No weddings yet. Create your first one!</p>
          )}
        </div>
        
        <div className="glass-card p-6 hover:scale-105 transition-all duration-200 group">
          <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2 group-hover:text-[#EFB7B7] transition-colors">Recent Tasks</h3>
          <p className="text-[#6E6E6E]">No tasks assigned.</p>
        </div>
        
        <div className="glass-card p-6 hover:scale-105 transition-all duration-200 group">
          <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2 group-hover:text-[#EFB7B7] transition-colors">Upcoming</h3>
          <p className="text-[#6E6E6E]">No upcoming events.</p>
        </div>
      </div>

      {weddings && weddings.length > 0 && (
        <div className="mt-8">
          <h2 className="text-3xl font-serif font-semibold text-[#2E2E2E] mb-6">Your Weddings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddings.map((wedding) => (
              <Link 
                key={wedding.id} 
                href={`/dashboard/weddings/${wedding.id}`}
                className="block group"
              >
                <div className="glass-card p-6 hover:scale-105 hover:shadow-2xl transition-all duration-200">
                  <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2 group-hover:text-[#EFB7B7] transition-colors">{wedding.name}</h3>
                  {wedding.date && (
                    <p className="text-[#6E6E6E] text-sm mb-2 flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      {new Date(wedding.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#C9D6CF]/30 to-[#E6D9FF]/30 text-[#2E2E2E] capitalize">
                    {wedding.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
