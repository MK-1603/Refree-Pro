'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Download, Upload, Trash2, Info, ChevronRight, Shield, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

import { BookOpen, AlertCircle, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [notifications, setNotifications] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | 'system' || 'dark';
    setTheme(saved);
  }, []);

  const applyTheme = (t: 'dark' | 'light' | 'system') => {
    setTheme(t);
    localStorage.setItem('theme', t);
    const html = document.documentElement;
    if (t === 'dark') { html.classList.add('dark'); html.classList.remove('light'); }
    else if (t === 'light') { html.classList.remove('dark'); html.classList.add('light'); }
    else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) { html.classList.add('dark'); html.classList.remove('light'); }
      else { html.classList.remove('dark'); html.classList.add('light'); }
    }
  };

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    if (!notifications) {
      toast('Push notifications enabled');
    } else {
      toast('Push notifications disabled', 'info');
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/export');
      const data = await res.json();

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let page = pdfDoc.addPage([595, 842]);
      const { height } = page.getSize();
      let y = height - 50;

      const draw = (text: string, x: number, yPos: number, size: number = 11, f = font, color = rgb(0, 0, 0)) => {
        page.drawText(text, { x, y: yPos, size, font: f, color });
      };

      draw('REFEREE PRO — DATABASE EXPORT', 50, y, 16, bold); y -= 20;
      draw(`Generated: ${new Date().toLocaleString()}`, 50, y, 10, font, rgb(0.5, 0.5, 0.5)); y -= 40;

      for (const m of data.matches || []) {
        if (y < 100) { page = pdfDoc.addPage([595, 842]); y = height - 50; }
        draw(`Match ${m.matchNumber}: ${m.teamA} vs ${m.teamB}`, 50, y, 12, bold); y -= 15;
        draw(`Date: ${m.matchDate}  |  Venue: ${m.venue}  |  Score: ${m.scoreA ?? 0} - ${m.scoreB ?? 0}`, 50, y, 10, font); y -= 25;
      }

      if ((data.matches || []).length === 0) { draw('No matches recorded yet.', 50, y, 11, font); }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `referee-pro-backup-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click(); URL.revokeObjectURL(url);
      toast('PDF Exported successfully!');
    } catch { toast('Export failed', 'error'); }
    setLoading(false);
  };

  const handleClearData = async () => {
    if (confirmText !== 'CONFIRM') return;
    setClearing(true);
    try {
      const res = await fetch('/api/settings/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmText: 'CONFIRM' }),
      });
      if (res.ok) {
        toast('All database data cleared successfully!');
        setShowClearModal(false);
        setConfirmText('');
      } else {
        const errorData = await res.json();
        toast(errorData.error || 'Failed to clear data', 'error');
      }
    } catch { toast('Network error while clearing data', 'error'); }
    finally { setClearing(false); }
  };

  type SettingItem =
    | { type: 'custom'; content: React.ReactNode }
    | { type?: undefined; label: string; icon: React.ReactNode; iconBg: string; onClick: () => void; isDestructive?: boolean; value?: string; badge?: string };

  interface SettingSection {
    title: string;
    items: SettingItem[];
  }

  const sections: SettingSection[] = [
    {
      title: 'Preferences',
      items: [
        {
          type: 'custom',
          content: (
            <div className="flex items-center justify-between py-2.5 px-4 w-full">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-[0.6rem] flex items-center justify-center bg-blue-500/10 text-blue-500 shrink-0 shadow-sm border border-blue-500/20">
                  <Shield size={16} />
                </div>
                <span className="text-[15px] font-medium text-foreground tracking-wide">Theme</span>
              </div>
              <div className="flex bg-foreground/5 dark:bg-foreground/10 rounded-lg p-0.5 border border-border/10 relative">
                {(['dark', 'light', 'system'] as const).map((t, _idx) => (
                  <button key={t} onClick={() => applyTheme(t)}
                    className={cn('px-3.5 py-1.5 rounded-md text-[13px] capitalize transition-all outline-none relative z-10',
                      theme === t ? 'text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground/80')}
                    style={theme === t ? { backgroundColor: 'var(--tw-prose-body, rgba(120,120,120,0.15))' } : {}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )
        },
        {
          type: 'custom',
          content: (
            <div className="flex items-center justify-between py-2.5 px-4 w-full cursor-pointer hover:bg-foreground/[0.03] transition-colors" onClick={handleToggleNotifications}>
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-[0.6rem] flex items-center justify-center bg-rose-500/10 text-rose-500 shrink-0 shadow-sm border border-rose-500/20">
                  <Bell size={16} />
                </div>
                <span className="text-[15px] font-medium text-foreground tracking-wide">Push Notifications</span>
              </div>
              <div className="flex items-center">
                <div className={cn("w-11 h-6 rounded-full transition-colors relative", notifications ? "bg-emerald-500" : "bg-foreground/10")}>
                  <div className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm", notifications ? "translate-x-5" : "translate-x-0")} />
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: 'Resources',
      items: [
        {
          label: 'User Guide & Tutorials',
          icon: <BookOpen size={16} />,
          iconBg: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
          onClick: () => router.push('/onboarding?from=settings')
        },
        {
          label: 'About Referee Pro',
          icon: <AlertCircle size={16} />,
          iconBg: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
          onClick: () => router.push('/settings/about')
        }
      ]
    },
    {
      title: 'Data & Storage',
      items: [
        { label: loading ? 'Generating PDF...' : 'Export Database', icon: <Download size={16} />, iconBg: 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20', onClick: handleExport },
        { label: 'Import Backup', icon: <Upload size={16} />, iconBg: 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20', onClick: () => router.push('/settings/import') },
        { label: 'Reset Database', icon: <Trash2 size={16} />, iconBg: 'bg-red-500/10 text-red-500 border border-red-500/20', onClick: () => setShowClearModal(true), isDestructive: true },
      ]
    },
    {
      title: 'Legal & System',
      items: [
        {
          label: 'Software Update',
          icon: <Download size={16} />,
          iconBg: 'bg-violet-500/10 text-violet-500 border border-violet-500/20',
          value: 'Check',
          badge: 'v1.0.0',
          onClick: () => router.push('/settings/update')
        },
        {
          label: 'Privacy Policy',
          icon: <Shield size={16} />,
          iconBg: 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20',
          onClick: () => router.push('/settings/privacy')
        },
        {
          label: 'Terms of Service',
          icon: <Info size={16} />,
          iconBg: 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20',
          onClick: () => router.push('/settings/terms')
        }
      ]
    }
  ];

  return (
    <AppLayout>
      <div className="pb-16 max-w-2xl mx-auto relative min-h-screen flex flex-col">
        {/* Fixed App Header */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 h-14 flex items-center justify-center mb-6">
          <button onClick={() => router.back()} className="absolute left-4 md:left-6 flex items-center gap-1 text-blue-500 hover:text-blue-400 transition-colors text-[15px] font-medium">
            <ChevronLeft size={22} strokeWidth={2.5} className="-ml-1" />
            Back
          </button>
          <h1 className="text-[17px] font-bold text-foreground tracking-wide">Settings</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 px-4 md:px-8">
          {sections.map(({ title, items }) => (
            <div key={title} className="space-y-2">
              <p className="text-[12px] text-muted-foreground/80 uppercase font-bold tracking-[0.1em] ml-4">{title}</p>
              <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                {items.map((item, i) => {
                  const isLast = i === items.length - 1;
                  if (item.type === 'custom') {
                    return (
                      <div key={i} className={cn("flex items-center min-h-[56px] py-1 bg-background/30", !isLast && "border-b border-border/40")}>
                        {item.content}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={i}
                      onClick={item.onClick}
                      className={cn(
                        "w-full flex items-center justify-between min-h-[56px] px-4 hover:bg-foreground/[0.03] transition-colors active:bg-foreground/[0.06] text-left group bg-background/30",
                        !isLast && "border-b border-border/40"
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={cn("w-8 h-8 rounded-[0.6rem] flex items-center justify-center shrink-0 shadow-sm transition-transform group-active:scale-95", item.iconBg)}>
                          {item.icon}
                        </div>
                        <span className={cn("text-[15px] font-medium tracking-wide", item.isDestructive ? "text-red-500" : "text-foreground")}>
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-500">
                            {item.badge}
                          </span>
                        )}
                        {item.value && <span className="text-[14px] text-muted-foreground">{item.value}</span>}
                        <ChevronRight size={18} className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Premium Footer App Badge */}
          <div className="pt-10 pb-6 text-center space-y-3">
            <div className="w-24 h-24 rounded-[1.5rem] mx-auto overflow-hidden shadow-xl shadow-blue-500/10 border border-border/50">
              <Image src="/icon-192.png" alt="Referee Pro" width={192} height={192} className="w-full h-full object-cover" priority unoptimized />
            </div>
            <div>
              <p className="font-black text-foreground text-xl tracking-tight">Referee Pro</p>
              <p className="text-[13px] text-muted-foreground font-medium mt-1">Professional Edition • v1.0.0</p>
            </div>
          </div>
        </motion.div>

        {/* Modal */}
        <Modal open={showClearModal} onClose={() => { setShowClearModal(false); setConfirmText(''); }} title="Reset Database">
          <div className="p-1">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
              This action will permanently delete all local matches, tournaments, players, and match events. This action is irreversible.
            </p>
            <div className="bg-foreground/5 rounded-xl p-4 mb-6 border border-border/40">
              <p className="text-sm mb-2 font-medium">Type <span className="font-mono text-red-500 font-bold bg-red-500/10 px-1.5 py-0.5 rounded">CONFIRM</span> to proceed:</p>
              <Input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="CONFIRM" className="bg-background border-border/50" />
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 h-11 font-semibold" onClick={() => { setShowClearModal(false); setConfirmText(''); }} disabled={clearing}>Cancel</Button>
              <Button variant="danger" className="flex-1 h-11 font-semibold" disabled={confirmText !== 'CONFIRM'} loading={clearing} onClick={handleClearData}>
                Reset Database
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
