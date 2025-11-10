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
    <div className="max-w-7xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-[#2E2E2E]">
            Welcome back, {profile?.full_name || 'there'}!
          </h1>
          <p className="text-[#6E6E6E] mt-2">
            <span className="capitalize font-medium text-[#2E2E2E]">{profile?.role}</span> account
          </p>
        </div>
        <Button 
          asChild
          className="bg-[#EFB7B7] hover:bg-[#F5C16C] text-[#2E2E2E] font-medium transition-colors"
        >
          <Link href="/dashboard/weddings/new">
            <Plus className="mr-2 h-4 w-4" />
            New Wedding
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#C9D6CF]/30 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">Your Weddings</h3>
          {weddings && weddings.length > 0 ? (
            <p className="text-2xl font-bold text-[#EFB7B7]">{weddings.length}</p>
          ) : (
            <p className="text-[#6E6E6E]">No weddings yet. Create your first one!</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-[#C9D6CF]/30 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">Recent Tasks</h3>
          <p className="text-[#6E6E6E]">No tasks assigned.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-[#C9D6CF]/30 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">Upcoming</h3>
          <p className="text-[#6E6E6E]">No upcoming events.</p>
        </div>
      </div>

      {weddings && weddings.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-serif font-semibold text-[#2E2E2E] mb-4">Your Weddings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddings.map((wedding) => (
              <Link 
                key={wedding.id} 
                href={`/dashboard/weddings/${wedding.id}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-sm border border-[#C9D6CF]/30 p-6 hover:shadow-md hover:border-[#EFB7B7] transition-all">
                  <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">{wedding.name}</h3>
                  {wedding.date && (
                    <p className="text-[#6E6E6E] text-sm mb-2">
                      {new Date(wedding.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#C9D6CF]/20 text-[#2E2E2E] capitalize">
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
