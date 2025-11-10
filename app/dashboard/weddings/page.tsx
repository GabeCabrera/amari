import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function WeddingsPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // Fetch user's weddings
  const { data: weddings } = await supabase
    .from('weddings')
    .select('*')
    .or(`owner_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-[#2E2E2E]">
            Weddings
          </h1>
          <p className="text-[#6E6E6E] mt-2">
            Manage all your wedding projects
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

      {weddings && weddings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((wedding) => (
            <Link 
              key={wedding.id} 
              href={`/dashboard/weddings/${wedding.id}`}
              className="block"
            >
              <div className="glass-card p-6 hover:scale-105 hover:shadow-2xl transition-all duration-200">
                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">{wedding.name}</h3>
                {wedding.description && (
                  <p className="text-[#6E6E6E] text-sm mb-3 line-clamp-2">{wedding.description}</p>
                )}
                {wedding.date && (
                  <p className="text-[#6E6E6E] text-sm mb-3">
                    📅 {new Date(wedding.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#C9D6CF]/30 to-[#E6D9FF]/30 text-[#2E2E2E] capitalize backdrop-blur-sm">
                  {wedding.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center animate-fade-in">
          <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">No weddings yet</h3>
          <p className="text-[#6E6E6E] mb-6">Create your first wedding project to get started</p>
          <Button 
            asChild
            className="bg-[#EFB7B7] hover:bg-[#F5C16C] text-[#2E2E2E] font-medium transition-colors"
          >
            <Link href="/dashboard/weddings/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Wedding
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
