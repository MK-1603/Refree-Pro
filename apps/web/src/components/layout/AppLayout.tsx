import { DesktopSidebar } from './DesktopSidebar';
import { MobileNav } from './MobileNav';
import { MobileTopNav } from './MobileTopNav';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <MobileTopNav />
      <main className="flex-1 pt-16 md:pt-0 pb-28 md:pb-0 overflow-auto">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
