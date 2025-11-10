'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-romantic animate-gradient-shift" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-[#EFB7B7]/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#C9D6CF]/10 rounded-full blur-3xl animate-float-delayed" />
      
      <Card className="relative z-10 w-full max-w-md glass-card border-white/30 animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-serif text-[#2E2E2E]">Welcome back</CardTitle>
          <CardDescription className="text-[#6E6E6E]">
            Sign in to your Amari account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-xl bg-[#C97070]/10 border border-[#C97070]/30 backdrop-blur-sm p-3 text-sm text-[#C97070]">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#2E2E2E] font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="glass-input rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#2E2E2E] font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="glass-input rounded-xl"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EFB7B7] hover:bg-[#F5C16C] text-[#2E2E2E] font-medium rounded-xl py-6 transition-all duration-200 hover:scale-105 shadow-lg border-0"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            <p className="text-sm text-[#6E6E6E] text-center">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#EFB7B7] hover:text-[#F5C16C] font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
