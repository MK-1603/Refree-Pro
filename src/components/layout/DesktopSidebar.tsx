'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Swords, Trophy, History, FileText, Settings, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Command Center' },
  { href: '/matches', icon: Swords, label: 'Match Hub' },
  { href: '/tournaments', icon: Trophy, label: 'Tournaments' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/reports', icon: FileText, label: 'Reports' },
];

export function DesktopSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className={cn(
      'hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 h-screen sticky top-0',
      collapsed ? 'w-16' : 'w-60'
    )}>
      <div className="flex items-center gap-3 p-4 border-b border-border h-16">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-transparent dark:bg-card dark:shadow-lg dark:shadow-primary/20">
          <img src="/image.png" alt="Logo" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
        </div>
        {!collapsed && <span className="font-bold text-sm tracking-wide">REFEREE PRO</span>}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all min-h-[44px]',
              isActive(href) ? 'bg-primary/15 text-primary' : 'text-muted hover:text-foreground hover:bg-foreground/5'
            )}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-border space-y-1">
        <Link href="/settings" className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all min-h-[44px]', pathname.startsWith('/settings') ? 'bg-primary/15 text-primary' : 'text-muted hover:text-foreground hover:bg-foreground/5')}>
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
        <div className={cn('flex items-center px-3 py-2.5', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && <span className="text-sm font-medium text-muted">Theme</span>}
          <ThemeToggle />
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:text-foreground hover:bg-foreground/5 transition-all w-full min-h-[44px]"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
