'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCreateMatch } from '../CreateMatchContext';
import { CreateMatchStepper } from '../CreateMatchStepper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

export default function ReviewPage() {
  const { state, reset } = useCreateMatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId: state.tournamentId && state.tournamentId.trim() !== '' ? state.tournamentId : null,
          venue: state.venue,
          matchNumber: parseInt(state.matchNumber),
          matchDate: state.matchDate,
          matchTime: state.matchTime,
          refereeName: state.refereeName || null,
          teamA: state.teamA,
          teamB: state.teamB,
          teamAColor: state.teamAColor,
          teamBColor: state.teamBColor,
          squadFormat: state.squadFormat,
          matchDuration: state.matchDuration,
          breakDuration: state.breakDuration,
          extraTime: state.extraTime,
          players: state.players.filter(p => p.name),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const detail = data?.detail || data?.error || 'Unknown error';
        toast(`Failed: ${detail}`, 'error');
        return;
      }

      toast('Match created successfully!');
      reset();
      router.push(`/matches/${data.id}/intro`);
    } catch (e) {
      toast(`Error: ${e instanceof Error ? e.message : 'Network error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const rows = [
    { label: 'Venue', value: state.venue },
    { label: 'Match #', value: state.matchNumber },
    { label: 'Date', value: state.matchDate },
    { label: 'Time', value: state.matchTime },
    { label: 'Format', value: state.squadFormat },
    { label: 'Duration', value: `${state.matchDuration} min per half` },
    { label: 'Break', value: `${state.breakDuration} min` },
    { label: 'Extra Time', value: state.extraTime ? `${state.extraTime} min` : 'None' },
    { label: 'Referee', value: state.refereeName || '—' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => router.push('/matches/create/config')} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors border border-border/50 text-foreground shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Create Match</h1>
            <p className="text-primary font-medium text-sm tracking-wider uppercase">Step 4 of 4 — Review</p>
          </div>
        </div>
        <CreateMatchStepper current={3} />

        <Card className="mb-4 p-5">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/30">
            <span className="font-bold text-lg" style={{ color: state.teamAColor }}>{state.teamA || 'Team A'}</span>
            <span className="text-muted text-sm">vs</span>
            <span className="font-bold text-lg" style={{ color: state.teamBColor }}>{state.teamB || 'Team B'}</span>
          </div>
          <div className="space-y-2">
            {rows.map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted">{label}</span>
                <span className="font-medium text-foreground">{value || '—'}</span>
              </div>
            ))}
          </div>
        </Card>

        {state.players.filter(p => p.name).length > 0 && (
          <Card className="mb-6 p-4">
            <p className="text-xs text-muted tracking-widest mb-3">SQUAD</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {state.players.filter(p => p.name).map((p, i) => (
                <div key={i} className="text-sm flex gap-2">
                  <span className="text-muted w-5">#{p.jerseyNo ?? '—'}</span>
                  <span className="text-foreground">{p.name}</span>
                  <span className="text-muted text-xs">{p.team === 'team_a' ? state.teamA : state.teamB}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.back()}>← Back</Button>
          <Button className="flex-1" onClick={handleCreate} loading={loading}>
            Confirm & Create Match →
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
