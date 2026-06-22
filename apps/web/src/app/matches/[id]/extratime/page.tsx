'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Scoreboard } from '@/components/match/Scoreboard';
import { useToast } from '@/components/ui/Toast';

export default function ExtraTimePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [match, setMatch] = useState<any>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetch(`/api/matches/${id}`).then(r => r.json()).then(d => setMatch(d.match));
    });
  }, [params]);

  const startCountdown = () => {
    setCountdown(5);
    let c = 5;
    const interval = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(interval);
        handleStart();
      }
    }, 1000);
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      await fetch(`/api/matches/${id}/timer/extra-time`, { method: 'POST' });
      router.push(`/matches/${id}/live`);
    } catch { toast('Failed', 'error'); setLoading(false); }
  };

  if (!match) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md w-full">
        <h1 className="text-6xl font-bold score-digit text-yellow-card tracking-widest mb-4">EXTRA TIME</h1>
        <p className="text-white/40 mb-6">{match.extraTime} minutes · Draw after full time</p>

        <Scoreboard teamA={match.teamA} teamB={match.teamB}
          scoreA={match.scoreA ?? 0} scoreB={match.scoreB ?? 0}
          teamAColor={match.teamAColor} teamBColor={match.teamBColor} />

        {countdown !== null && countdown > 0 ? (
          <motion.div
            key={countdown}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[120px] font-bold score-digit text-white"
          >
            {countdown}
          </motion.div>
        ) : (
          <Button size="xl" className="w-full mt-6" onClick={startCountdown} loading={loading}>
            START EXTRA TIME →
          </Button>
        )}
      </motion.div>
    </div>
  );
}
