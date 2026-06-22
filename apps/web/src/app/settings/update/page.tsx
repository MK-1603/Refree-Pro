'use client';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Download, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function UpdatePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [upToDate, setUpToDate] = useState(false);

  const handleCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setUpToDate(true);
    }, 2000);
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-md mx-auto text-center mt-4">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-blue-500 hover:opacity-80 transition-opacity mb-8 -ml-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6" /></svg>
          Back
        </button>

        <div className="w-24 h-24 rounded-3xl mx-auto bg-foreground/5 flex items-center justify-center mb-6">
          <Download size={40} className="text-indigo-500" />
        </div>

        <h1 className="text-3xl font-bold mb-2 text-foreground">Software Update</h1>
        <p className="text-muted-foreground mb-8">Keep Referee Pro updated to get the latest features and bug fixes.</p>

        {upToDate ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
            <CheckCircle size={32} className="text-emerald-500 mx-auto mb-3" />
            <h3 className="text-emerald-500 font-bold text-lg mb-1">You're up to date</h3>
            <p className="text-emerald-500/80 text-sm">Referee Pro v1.0.0 is the latest version available.</p>
          </div>
        ) : (
          <div className="bg-card border border-border/30 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Current Version</span>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Auto-Update</span>
              <span className="text-sm text-emerald-500">Enabled</span>
            </div>
          </div>
        )}

        {!upToDate && (
          <Button className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCheck} loading={checking}>
            {checking ? 'Checking for updates...' : 'Check for Updates'}
          </Button>
        )}
      </motion.div>
    </AppLayout>
  );
}
