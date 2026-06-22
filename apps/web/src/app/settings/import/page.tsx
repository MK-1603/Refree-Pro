'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useToast } from '@/components/ui/Toast';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

type Step = 'pick' | 'validating' | 'preview' | 'conflict' | 'importing' | 'done' | 'error';

export default function ImportPage() {
  const [step, setStep] = useState<Step>('pick');
  const [data, setData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStep('validating');
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed.matches && !parsed.tournaments) throw new Error('Invalid format');
      setData(parsed);
      setStep('preview');
    } catch (err) {
      setError('Invalid JSON file or unsupported format');
      setStep('error');
    }
  };

  const handleImport = async (mode: 'merge' | 'replace') => {
    setStep('importing');
    setProgress(10);
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, mode }),
      });
      setProgress(90);
      const r = await res.json();
      setResults(r);
      setProgress(100);
      setStep('done');
    } catch {
      setError('Import failed');
      setStep('error');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-4 mb-8">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors border border-border/50 text-foreground shrink-0 backdrop-blur-sm mt-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-none mb-2">Import & Restore</h1>
            <p className="text-muted text-sm">Restore data from a backup file</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'pick' && (
            <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-12">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,230,118,0.15)]">
                <Upload size={40} className="text-primary" />
              </div>
              <p className="text-muted mb-10 text-lg">Select a .json backup file to restore</p>
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFile} />
              <Button size="xl" className="w-full shadow-[0_0_20px_rgba(0,230,118,0.2)]" onClick={() => fileRef.current?.click()}>
                <Upload size={20} /> Choose Backup File
              </Button>
            </motion.div>
          )}

          {step === 'validating' && (
            <motion.div key="validating" className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full mx-auto mb-4" />
              <p className="text-muted">Validating file...</p>
            </motion.div>
          )}

          {step === 'preview' && data && (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass rounded-xl p-5 mb-6">
                <p className="text-sm font-semibold mb-3">File Contents</p>
                <div className="space-y-2 text-sm text-muted">
                  <div className="flex justify-between"><span>Tournaments</span><span className="font-bold text-foreground">{data.tournaments?.length ?? 0}</span></div>
                  <div className="flex justify-between"><span>Matches</span><span className="font-bold text-foreground">{data.matches?.length ?? 0}</span></div>
                  <div className="flex justify-between"><span>Players</span><span className="font-bold text-foreground">{data.players?.length ?? 0}</span></div>
                </div>
              </div>
              <p className="text-sm text-muted mb-4">How would you like to import?</p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => handleImport('merge')}>Merge</Button>
                <Button className="flex-1" onClick={() => handleImport('replace')}>Replace All</Button>
              </div>
            </motion.div>
          )}

          {step === 'importing' && (
            <motion.div key="importing" className="text-center py-8">
              <p className="text-muted mb-6">Importing data...</p>
              <ProgressBar value={progress} max={100} className="mb-2" />
              <p className="text-xs text-muted">{progress}%</p>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8">
              <CheckCircle size={48} className="mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-bold mb-2">Import Complete</h2>
              <p className="text-muted text-sm mb-6">
                {results?.imported} records imported
                {results?.failed > 0 ? `, ${results.failed} failed` : ''}
              </p>
              <Button className="w-full" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div key="error" className="text-center py-8">
              <XCircle size={48} className="mx-auto mb-4 text-red-card" />
              <h2 className="text-xl font-bold mb-2">Import Failed</h2>
              <p className="text-muted text-sm mb-6">{error}</p>
              <Button variant="secondary" className="w-full" onClick={() => setStep('pick')}>Try Again</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
