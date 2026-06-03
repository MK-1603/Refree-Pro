'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Download, Upload, Trash2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [showClearModal, setShowClearModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/export');
      const data = await res.json();
      
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      let page = pdfDoc.addPage([595, 842]); // A4
      const { width, height } = page.getSize();
      let y = height - 50;
      
      const draw = (text: string, x: number, yPos: number, size: number = 11, f = font, color = rgb(0, 0, 0)) => {
        page.drawText(text, { x, y: yPos, size, font: f, color });
      };

      draw('REFEREE PRO — DATABASE EXPORT', 50, y, 16, bold); y -= 20;
      draw(`Generated: ${new Date().toLocaleString()}`, 50, y, 10, font, rgb(0.5, 0.5, 0.5)); y -= 40;

      for (const m of data.matches || []) {
        if (y < 100) {
          page = pdfDoc.addPage([595, 842]);
          y = height - 50;
        }
        draw(`Match #${m.matchNumber}: ${m.teamA} vs ${m.teamB}`, 50, y, 12, bold); y -= 15;
        draw(`Date: ${m.matchDate}  |  Venue: ${m.venue}  |  Score: ${m.scoreA ?? 0} - ${m.scoreB ?? 0}`, 50, y, 10, font); y -= 25;
      }

      if ((data.matches || []).length === 0) {
        draw('No matches recorded yet.', 50, y, 11, font);
      }

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

  type SettingItem = 
    | { type: 'custom'; content: React.ReactNode }
    | { type?: undefined; label: string; icon: React.ReactNode; onClick: () => void; isDestructive?: boolean };

  interface SettingSection {
    title: string;
    items: SettingItem[];
  }

  const sections: SettingSection[] = [
    {
      title: 'APPEARANCE',
      items: [
        {
          type: 'custom',
          content: (
            <div className="flex items-center justify-between p-3.5 px-4">
              <span className="text-[15px] text-foreground">Theme</span>
              <div className="flex bg-foreground/10 rounded-lg p-0.5 border border-border/50">
                {(['dark', 'light', 'system'] as const).map(t => (
                  <button key={t} onClick={() => applyTheme(t)}
                    className={cn('px-3 py-1 rounded-md text-sm capitalize transition-all',
                      theme === t ? 'bg-background text-foreground shadow-sm font-medium' : 'text-muted hover:text-foreground')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: 'STORAGE & DATA',
      items: [
        { label: loading ? 'Generating PDF...' : 'Export All Data (.pdf)', icon: <Download size={18} className="text-blue-400" />, onClick: handleExport },
        { label: 'Import Data', icon: <Upload size={18} className="text-green-400" />, onClick: () => router.push('/settings/import') },
        { label: 'Clear All Data', icon: <Trash2 size={18} className="text-red-500" />, onClick: () => setShowClearModal(true), isDestructive: true },
      ]
    },
    {
      title: 'ABOUT',
      items: [
        {
          type: 'custom',
          content: (
            <div className="p-6 text-center space-y-1">
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 overflow-hidden bg-black shadow-lg shadow-black/50">
                <img src="/image.png" className="w-full h-full object-cover" />
              </div>
              <p className="font-bold text-foreground text-base">Referee Pro</p>
              <p className="text-[13px] text-muted">Version 1.0.0</p>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6 ml-2">
          <button onClick={() => router.back()} className="text-primary hover:opacity-80 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>

        <div className="space-y-6">
          {sections.map(({ title, items }) => (
            <div key={title}>
              <p className="text-[13px] text-muted uppercase tracking-wide mb-1.5 ml-4">{title}</p>
              <div className="glass border border-border/50 rounded-[10px] overflow-hidden shadow-sm">
                {items.map((item, i) => (
                  <div key={i} className={cn("relative", i !== items.length - 1 && "after:content-[''] after:absolute after:bottom-0 after:left-12 after:right-0 after:h-[1px] after:bg-border/50")}>
                    {item.type === 'custom' ? (
                      item.content
                    ) : (
                      <button 
                        onClick={item.onClick}
                        className="w-full flex items-center justify-between p-3.5 px-4 hover:bg-foreground/5 transition-colors active:bg-foreground/10 text-left"
                      >
                        <div className="flex items-center gap-3.5">
                          {item.icon}
                          <span className={cn("text-[15px]", item.isDestructive ? "text-red-500" : "text-foreground")}>{item.label}</span>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted/30"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Modal open={showClearModal} onClose={() => { setShowClearModal(false); setConfirmText(''); }} title="Clear All Data">
          <p className="text-white/60 text-sm mb-4">
            This will permanently delete ALL matches, tournaments, players and events. This cannot be undone.
          </p>
          <p className="text-sm mb-3">Type <span className="font-mono text-red-card">CONFIRM</span> to proceed:</p>
          <Input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="CONFIRM" className="mb-4" />
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => { setShowClearModal(false); setConfirmText(''); }}>Cancel</Button>
            <Button variant="danger" className="flex-1" disabled={confirmText !== 'CONFIRM'}
              onClick={() => { toast('Clear all data is not implemented in demo', 'info'); setShowClearModal(false); setConfirmText(''); }}>
              Delete Everything
            </Button>
          </div>
        </Modal>
      </motion.div>
    </AppLayout>
  );
}
