'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCreateMatch } from '../CreateMatchContext';
import { CreateMatchStepper } from '../CreateMatchStepper';
import { Button } from '@/components/ui/Button';
import { Stepper } from '@/components/ui/Stepper';
import { Card } from '@/components/ui/Card';
import { Timer, Coffee, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ConfigPage() {
  const { state, update } = useCreateMatch();
  const router = useRouter();

  const configs = [
    {
      icon: Timer, label: 'Match Duration', desc: 'Duration of each half in minutes',
      value: state.matchDuration, key: 'matchDuration', unit: 'min',
    },
    {
      icon: Coffee, label: 'Break Duration', desc: 'Half-time break length in minutes',
      value: state.breakDuration, key: 'breakDuration', unit: 'min',
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => router.push('/matches/create/teams')} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors border border-border/50 text-foreground shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Create Match</h1>
            <p className="text-primary font-medium text-sm tracking-wider uppercase">Step 3 of 4 — Config</p>
          </div>
        </div>
        <CreateMatchStepper current={2} />

        <div className="space-y-4">
          {configs.map(({ icon: Icon, label, desc, value, key, unit }) => (
            <Card key={key} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Stepper value={value} onChange={(v) => update({ [key]: v } as any)} min={1} max={120} />
                  <span className="text-xs text-muted w-6">{unit}</span>
                </div>
              </div>
            </Card>
          ))}

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-foreground/5 rounded-xl flex items-center justify-center">
                  <Plus size={18} className="text-muted" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Extra Time</p>
                  <p className="text-xs text-muted">Optional extra time if draw</p>
                </div>
              </div>
              {state.extraTime === null ? (
                <Button variant="secondary" size="sm" onClick={() => update({ extraTime: 15 })}>
                  Enable
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Stepper value={state.extraTime} onChange={(v) => update({ extraTime: v })} min={1} max={60} />
                  <button onClick={() => update({ extraTime: null })} className="text-xs text-red-card ml-2">Remove</button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="secondary" onClick={() => router.back()}>← Back</Button>
          <Button className="flex-1" onClick={() => router.push('/matches/create/review')}>
            Next → Review
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
