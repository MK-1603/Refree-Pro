'use client';
import Link from 'next/link';
import { Settings, Shield } from 'lucide-react';

import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function MobileTopNav() {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-xl border-b border-border h-16 flex items-center justify-between px-4">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-transparent dark:bg-card dark:shadow-lg dark:shadow-primary/20">
          <img src="/image.png" alt="Logo" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
        </div>
        <span className="font-bold text-sm tracking-wide text-foreground">REFEREE PRO</span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link 
          href="/settings" 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 border border-border text-muted hover:text-foreground hover:bg-foreground/10 transition-colors"
        >
          <Settings size={20} />
        </Link>
      </div>
    </header>
  );
}
