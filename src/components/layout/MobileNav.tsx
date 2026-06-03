'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Swords, Calendar, History, Settings, Plus } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

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

      <Modal open={showQuick} onClose={() => setShowQuick(false)} title="Quick Action">
        <div className="flex flex-col gap-3">
          <Button onClick={() => { setShowQuick(false); router.push('/matches/create/details'); }} className="w-full" size="lg">
            ⚽ Create Match
          </Button>
          <Button onClick={() => { setShowQuick(false); router.push('/tournaments/create'); }} variant="secondary" className="w-full" size="lg">
            🏆 Create Tournament
          </Button>
        </div>
      </Modal>
    </>
  );
}
