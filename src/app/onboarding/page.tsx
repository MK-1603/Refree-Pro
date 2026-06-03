'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';

const steps = [
  {
    emoji: '⚽',
    title: 'Create a Match',
    desc: 'Set up teams, players, and match configuration in seconds. Choose squad format, duration, and more.',
  },
  {
    emoji: '⏱️',
    title: 'Track Live Events',
    desc: 'Real-time timer with goals, cards, and substitutions. Every event auto-saved to the cloud instantly.',
  },
  {
    emoji: '📄',
    title: 'Generate Reports & Posters',
    desc: 'Create professional PDF reports and shareable match posters in one tap after the final whistle.',
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleComplete = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'onboarded', value: 'true' }),
      });
    } catch {}
    router.push('/dashboard');
  };

  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex justify-end p-4">
        <button onClick={handleComplete} className="text-sm text-muted hover:text-foreground px-3 py-2">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-sm"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-5xl">{steps[step].emoji}</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">{steps[step].title}</h2>
            <p className="text-muted leading-relaxed">{steps[step].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-primary w-6' : 'bg-foreground/20'}`} />
          ))}
        </div>

        <Button size="lg" className="w-full max-w-sm" onClick={isLast ? handleComplete : () => setStep(s => s + 1)}>
          {isLast ? 'Get Started →' : <><ChevronRight size={18} /> Next</>}
        </Button>
      </div>
    </div>
  );
}
