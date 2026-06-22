'use client';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-blue-500 hover:opacity-80 transition-opacity mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6" /></svg>
          Back to Settings
        </button>
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
          <p>Last updated: June 2026</p>
          <p>Referee Pro ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Referee Pro.</p>
          <h3 className="text-foreground font-bold mt-6 text-xl">1. Information We Collect</h3>
          <p>All your match data, tournament data, and settings are stored locally on your device and synced via our secure database. We do not sell your personal data.</p>
          <h3 className="text-foreground font-bold mt-6 text-xl">2. How We Use Your Information</h3>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide, operate, and maintain our application</li>
            <li>Improve, personalize, and expand our application</li>
            <li>Understand and analyze how you use our application</li>
          </ul>
        </div>
      </motion.div>
    </AppLayout>
  );
}
