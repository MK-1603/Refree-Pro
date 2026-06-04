'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Swords, Calendar, History, Settings, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/matches', icon: Swords, label: 'Matches' },
  { href: '/history', icon: Calendar, label: 'History' },
  { href: '/tournaments', icon: History, label: 'Tournaments' },
];

export function MobileNav() {
  const pathname = usePathname();
  const [showQuick, setShowQuick] = useState(false);
  const router = useRouter();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-border/50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center h-[68px] px-2 pb-1">
          {navItems.slice(0, 2).map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={cn('flex-1 flex flex-col items-center gap-1 py-1.5 min-h-[44px] justify-center transition-all duration-300 rounded-2xl mx-1', isActive(href) ? 'text-primary bg-foreground/5' : 'text-muted hover:text-foreground/70')}>
              <Icon size={20} className={cn("transition-transform duration-300", isActive(href) && "scale-110")} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          ))}
          <div className="relative -top-5 mx-2 shrink-0">
            <button
              onClick={() => setShowQuick(true)}
              className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-md text-white transform transition-transform hover:scale-105 active:scale-95"
            >
              <Plus size={28} />
            </button>
          </div>
          {navItems.slice(2).map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={cn('flex-1 flex flex-col items-center gap-1 py-1.5 min-h-[44px] justify-center transition-all duration-300 rounded-2xl mx-1', isActive(href) ? 'text-primary bg-foreground/5' : 'text-muted hover:text-foreground/70')}>
              <Icon size={20} className={cn("transition-transform duration-300", isActive(href) && "scale-110")} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {showQuick && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuick(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
            />
            {/* Bottom Sheet Container */}
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed bottom-6 left-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm mx-auto pb-safe"
            >
              {/* Main Actions Card */}
              <div className="bg-card border border-border rounded-[24px] p-5 shadow-2xl flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-foreground tracking-tight">Quick Action</span>
                  <button
                    onClick={() => setShowQuick(false)}
                    className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Buttons container */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowQuick(false);
                      router.push('/matches/create/details');
                    }}
                    className="w-full py-4 px-4 bg-primary hover:bg-primary/90 text-white font-bold text-[17px] rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    ⚽ Schedule Match
                  </button>
                  <button
                    onClick={() => {
                      setShowQuick(false);
                      router.push('/tournaments/create');
                    }}
                    className="w-full py-4 px-4 bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold text-[17px] rounded-2xl active:scale-98 transition-all flex items-center justify-center gap-2 border border-border/50"
                  >
                    🏆 Create Tournament
                  </button>
                </div>
              </div>

              {/* Cancel Button Block */}
              <button
                onClick={() => setShowQuick(false)}
                className="w-full bg-card hover:bg-foreground/5 border border-border rounded-2xl py-4 text-center text-[17px] font-bold text-red-card active:scale-95 transition-all shadow-xl outline-none"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
