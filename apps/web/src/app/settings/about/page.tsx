'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft, Globe, Heart } from 'lucide-react';

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function AboutPage() {
  const router = useRouter();
  return (
    <AppLayout>
      <div className="mb-16 max-w-2xl mx-auto relative">
        <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md px-4 md:px-8 py-4 pt-6 border-b border-border/40 mb-8 flex items-center">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-blue-500 hover:text-blue-400 transition-colors text-[15px] font-medium w-fit -ml-1">
            <ChevronLeft size={20} strokeWidth={2.5} className="-ml-1" />
            Settings
          </button>
        </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 pt-0">
        
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-24 h-24 rounded-3xl overflow-hidden mb-6 shadow-2xl shadow-blue-500/20 border border-white/10">
            <Image unoptimized src="/icon-192.png" alt="Referee Pro Icon" width={192} height={192} className="w-full h-full object-cover" priority />
          </div>
          <h1 className="text-[32px] font-black tracking-tight text-foreground mb-2">Referee Pro</h1>
          <p className="text-[15px] text-muted-foreground font-medium">Professional Match Management System</p>
          <div className="mt-4 px-3 py-1 rounded-full bg-foreground/5 border border-border/40 text-[12px] font-mono text-muted-foreground">
            Version 1.0.0 (Build 2026.06)
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Our Mission</h3>
            <p className="text-[15px] leading-relaxed text-foreground/80">
              Referee Pro was built from the ground up to provide professional and grassroots football referees with a reliable, digital-first match engine. 
              Our mission is to eliminate paper-based errors, automate tournament standings, and provide instant, beautiful match reports.
            </p>
          </div>

          <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl p-2 divide-y divide-border/20">
            {[
              { label: 'Website', icon: <Globe size={18} />, value: 'refereepro.app' },
              { label: 'Twitter (X)', icon: <XIcon />, value: '@refereepro' },
              { label: 'Source Code', icon: <GithubIcon />, value: 'GitHub' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-foreground/[0.02] transition-colors rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">{item.icon}</div>
                  <span className="font-medium text-[15px]">{item.label}</span>
                </div>
                <span className="text-[14px] text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[13px] text-muted-foreground flex items-center justify-center gap-1.5">
            Crafted with <Heart size={14} className="text-red-500 fill-red-500" /> by ManMadhan
          </p>
          <p className="text-[11px] text-muted-foreground/50 mt-2">© 2026 Referee Pro. All rights reserved.</p>
        </div>
      </motion.div>
      </div>
    </AppLayout>
  );
}
