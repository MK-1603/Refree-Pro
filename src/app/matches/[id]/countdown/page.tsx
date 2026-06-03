'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const sequence = ['PLAYERS READY', 'REFEREE READY', 'MATCH STARTING', '3', '2', '1', 'KICK OFF!'];

export default function CountdownPage({ params }: { params: Promise<{ id: string }> }) {
  const [step, setStep] = useState(0);
  const [id, setId] = useState('');
  const router = useRouter();

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (step >= sequence.length) return;

    const isLast = step === sequence.length - 1;
    const delay = isLast ? 1000 : 800;

    const timer = setTimeout(async () => {
      if (isLast) {
        try { navigator.vibrate?.([200, 100, 200]); } catch {}
        router.push(`/matches/${id}/live`);
      } else {
        setStep(s => s + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [step, id, router]);

  const current = sequence[step];
  const isNumber = ['3', '2', '1'].includes(current);
  const isKickOff = current === 'KICK OFF!';

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="w-96 h-96 rounded-full bg-primary"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.3 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 text-center"
        >
          <span className={`
            font-bold tracking-wider block
            ${isNumber ? 'score-digit text-[160px] leading-none text-white' : ''}
            ${isKickOff ? 'score-digit text-6xl md:text-8xl text-primary' : ''}
            ${!isNumber && !isKickOff ? 'text-2xl md:text-4xl text-white/70 tracking-[0.2em]' : ''}
          `}>
            {current}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
