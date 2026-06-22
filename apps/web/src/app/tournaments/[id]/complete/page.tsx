'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { StandingsTable } from '@/components/tournament/StandingsTable';
import { Button } from '@/components/ui/Button';
import { FileText, Trophy } from 'lucide-react';

export default function TournamentCompletePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [tournament, setTournament] = useState<any>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);
      const [dr, sr] = await Promise.all([
        fetch(`/api/tournaments/${id}`),
        fetch(`/api/tournaments/${id}/standings`),
      ]);
      const d = await dr.json();
      setTournament(d.tournament);
      const s = await sr.json();
      setStandings(Array.isArray(s) ? s : []);
    });
  }, [params]);

  if (!tournament) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" /></div>;

  const champion = standings[0];
  const runnerUp = standings[1];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col">
      <div className="mb-4">
        <button 
          onClick={() => router.push(`/tournaments/${id}`)} 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors border border-border/50 text-foreground shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>
        <h1 className="text-3xl font-bold mb-1">{tournament.name}</h1>
        <p className="text-muted text-sm mb-8">Tournament Complete</p>

        {champion && (
          <div className="glass-heavy rounded-2xl p-6 mb-4">
            <p className="text-xs text-yellow-card tracking-widest mb-2">🥇 CHAMPION</p>
            <p className="text-3xl font-bold">{champion.teamName}</p>
            <p className="text-muted text-sm mt-1">{champion.won}W {champion.drawn}D {champion.lost}L · {champion.points} pts</p>
          </div>
        )}

        {runnerUp && (
          <div className="glass rounded-xl p-4 mb-6">
            <p className="text-xs text-muted tracking-widest mb-1">🥈 RUNNER UP</p>
            <p className="text-xl font-bold">{runnerUp.teamName}</p>
          </div>
        )}

        {standings.length > 0 && (
          <div className="glass rounded-xl p-4 mb-6 overflow-hidden text-left">
            <StandingsTable standings={standings.map(s => ({
              teamName: s.teamName, played: s.played ?? 0, won: s.won ?? 0, drawn: s.drawn ?? 0,
              lost: s.lost ?? 0, goalsFor: s.goalsFor ?? 0, goalsAgainst: s.goalsAgainst ?? 0,
              goalDifference: s.goalDifference ?? 0, points: s.points ?? 0,
            }))} />
          </div>
        )}

        <Button size="lg" className="w-full" onClick={() => router.push(`/tournaments/${id}/report`)}>
          <FileText size={18} /> Generate Tournament Report
        </Button>
      </motion.div>
    </div>
  );
}
