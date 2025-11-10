import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F8F8]">
      <main className="flex flex-col items-center justify-center gap-8 px-8 text-center max-w-2xl">
        <h1 className="text-5xl font-serif font-semibold text-[#2E2E2E] tracking-tight">
          Welcome to Amari
        </h1>
        <p className="text-xl text-[#6E6E6E] leading-relaxed">
          The modern wedding planning platform designed for planners and couples.
          Manage tasks, collaborate seamlessly, and bring your special day to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            asChild
            className="bg-[#EFB7B7] hover:bg-[#F5C16C] text-[#2E2E2E] font-medium px-8 py-6 text-lg transition-colors"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button 
            asChild
            variant="outline"
            className="border-[#C9D6CF] hover:bg-[#C9D6CF]/10 text-[#2E2E2E] font-medium px-8 py-6 text-lg transition-colors"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
