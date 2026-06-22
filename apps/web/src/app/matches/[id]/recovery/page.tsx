'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MatchTimer } from '@/lib/timer';
import { Scoreboard } from '@/components/match/Scoreboard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RefreshCw } from 'lucide-react';

export default function RecoveryPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [match, setMatch] = useState<any>(null);
  const [timer, setTimerData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);
      const res = await fetch(`/api/matches/${id}`);
      const d = await res.json();
      setMatch(d.match);
      setTimerData(d.timer);
    });
  }, [params]);

  if (!match) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" /></div>;

  const elapsed = timer ? MatchTimer.calculateElapsed(timer.startedAtUnix, timer.totalPausedMs, timer.pausedAtUnix, timer.isRunning) : 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <RefreshCw size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Match In Progress</h1>
        <p className="text-center text-muted text-sm mb-6">Saved state detected. Resume or abandon?</p>

        <Card className="mb-4">
          <Scoreboard teamA={match.teamA} teamB={match.teamB}
            scoreA={match.scoreA ?? 0} scoreB={match.scoreB ?? 0}
            teamAColor={match.teamAColor} teamBColor={match.teamBColor} compact />
          {timer && (
            <p className="text-center text-sm text-muted mt-2">
              Timer at: <span className="timer-display text-live">{MatchTimer.formatDisplay(elapsed)}</span>
            </p>
          )}
        </Card>

        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={() => router.push(`/matches/${id}/abandoned`)}>
            Abandon
          </Button>
          <Button className="flex-1" onClick={() => router.push(`/matches/${id}/live`)}>
            Resume Match
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
