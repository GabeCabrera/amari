import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function VendorsPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-serif font-semibold text-[#2E2E2E]">
          Vendor Directory
        </h1>
        <p className="text-[#6E6E6E] mt-2">
          Discover and connect with wedding vendors
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-[#C9D6CF]/30 p-12 text-center">
        <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">Coming Soon</h3>
        <p className="text-[#6E6E6E]">
          The vendor directory will be available in a future update
        </p>
      </div>
    </div>
  );
}
