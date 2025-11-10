import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

async function DashboardNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const handleSignOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  };

  const initials = profile?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-serif font-semibold text-[#2E2E2E] hover:text-[#EFB7B7] transition-colors">
              Amari
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className="text-[#6E6E6E] hover:text-[#EFB7B7] font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/30"
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/weddings" 
                className="text-[#6E6E6E] hover:text-[#EFB7B7] font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/30"
              >
                Weddings
              </Link>
              {profile?.role === 'planner' && (
                <Link 
                  href="/dashboard/vendors" 
                  className="text-[#6E6E6E] hover:text-[#EFB7B7] font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/30"
                >
                  Vendors
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-transform">
                  <Avatar className="h-10 w-10 ring-2 ring-white/20">
                    <AvatarFallback className="bg-gradient-to-br from-[#EFB7B7] to-[#F5C16C] text-white font-semibold shadow-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card border-white/15" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-[#2E2E2E]">{profile?.full_name}</p>
                    <p className="text-xs leading-none text-[#6E6E6E]">{user.email}</p>
                    <p className="text-xs leading-none text-[#6E6E6E] mt-1">
                      <span className="capitalize inline-flex items-center px-2 py-0.5 rounded-full bg-[#E6D9FF]/50 text-[#2E2E2E] font-medium">
                        {profile?.role}
                      </span>
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="hover:bg-white/30 cursor-pointer">
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="hover:bg-white/30 cursor-pointer">
                  <form action={handleSignOut}>
                    <button type="submit" className="w-full text-left text-[#C97070]">
                      Sign out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-subtle">
      <DashboardNav />
      <main className="mx-auto px-6 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
