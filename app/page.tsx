import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-romantic animate-gradient-shift" />
      
      {/* Glassmorphic main content */}
      <main className="relative z-10 flex flex-col items-center justify-center gap-8 px-8 text-center max-w-3xl">
        <div className="glass-card p-12 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-serif font-semibold text-[#2E2E2E] tracking-tight mb-6 leading-tight">
            Welcome to Amari
          </h1>
          <p className="text-xl md:text-2xl text-[#6E6E6E] leading-relaxed mb-8 font-light">
            The modern wedding planning platform designed for planners and couples.
            Manage tasks, collaborate seamlessly, and bring your special day to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              className="bg-[#EFB7B7] hover:bg-[#F5C16C] text-[#2E2E2E] font-medium px-10 py-7 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border-0"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="glass-button border-[#C9D6CF] text-[#2E2E2E] font-medium px-10 py-7 text-lg rounded-xl hover:scale-105 transition-all duration-200"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#EFB7B7]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#C9D6CF]/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-20 w-24 h-24 bg-[#E6D9FF]/20 rounded-full blur-2xl animate-pulse" />
      </main>
    </div>
  );
}
