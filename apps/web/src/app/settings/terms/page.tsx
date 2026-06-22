'use client';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const router = useRouter();
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-blue-500 hover:opacity-80 transition-opacity mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6" /></svg>
          Back to Settings
        </button>
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
          <p>Last updated: June 2026</p>
          <p>Please read these terms and conditions carefully before using Our Service.</p>
          <h3 className="text-foreground font-bold mt-6 text-xl">1. Acceptance of Terms</h3>
          <p>By accessing or using Referee Pro, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>
          <h3 className="text-foreground font-bold mt-6 text-xl">2. Pro Version License</h3>
          <p>The Pro Version is intended for professional use. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us.</p>
        </div>
      </motion.div>
    </AppLayout>
  );
}
