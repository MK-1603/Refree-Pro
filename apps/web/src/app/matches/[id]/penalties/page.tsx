'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export default function PenaltiesPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [match, setMatch] = useState<any>(null);
  const [kicks, setKicks] = useState<any[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [jerseyNo, setJerseyNo] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);
      const [mr, pr] = await Promise.all([
        fetch(`/api/matches/${id}`), fetch(`/api/matches/${id}/penalties`)
      ]);
      setMatch((await mr.json()).match);
      setKicks(await pr.json());
    });
  }, [params]);

  if (!match) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" /></div>;

  const teamAKicks = kicks.filter(k => k.team === 'team_a');
  const teamBKicks = kicks.filter(k => k.team === 'team_b');
  const teamAScore = teamAKicks.filter(k => k.result === 'scored').length;
  const teamBScore = teamBKicks.filter(k => k.result === 'scored').length;

  const kickCount = kicks.length;
  const currentTeam = kickCount % 2 === 0 ? 'team_a' : 'team_b';
  const currentKickNum = Math.floor(kickCount / 2) + 1;

  const handleRecord = async () => {
    if (!playerName || !result) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/matches/${id}/penalties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team: currentTeam, playerName, jerseyNo: jerseyNo ? parseInt(jerseyNo) : undefined, kickNumber: currentKickNum, result }),
      });
      const kick = await res.json();
      setKicks(k => [...k, kick]);
      setPlayerName(''); setJerseyNo(''); setResult('');
      toast('Kick recorded');
    } catch { toast('Failed', 'error'); }
    finally { setLoading(false); }
  };

  const resultIcon: Record<string, string> = { scored: '⚽', missed: '❌', saved: '🧤' };
  const resultColor: Record<string, string> = { scored: 'text-primary', missed: 'text-red-card', saved: 'text-yellow-card' };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 score-digit">PENALTY SHOOTOUT</h1>
        <p className="text-center text-white/40 text-sm mb-6">
          Match: {match.teamA} {match.scoreA} – {match.scoreB} {match.teamB}
        </p>

        {/* Pen score */}
        <div className="glass rounded-xl p-4 text-center mb-6">
          <div className="flex items-center justify-center gap-6">
            <div>
              <p className="text-sm font-semibold" style={{ color: match.teamAColor }}>{match.teamA}</p>
              <p className="text-4xl font-bold score-digit">{teamAScore}</p>
            </div>
            <p className="text-white/20">–</p>
            <div>
              <p className="text-sm font-semibold" style={{ color: match.teamBColor }}>{match.teamB}</p>
              <p className="text-4xl font-bold score-digit">{teamBScore}</p>
            </div>
          </div>
        </div>

        {/* Current kick */}
        <div className="glass-heavy rounded-xl p-5 mb-6">
          <p className="text-xs text-white/40 tracking-widest mb-4">
            {currentTeam === 'team_a' ? match.teamA : match.teamB} — KICK {currentKickNum}
          </p>
          <div className="space-y-3">
            <Input label="Player Name" value={playerName} onChange={e => setPlayerName(e.target.value)} />
            <Input label="Jersey No (optional)" type="number" value={jerseyNo} onChange={e => setJerseyNo(e.target.value)} />
            <div className="grid grid-cols-3 gap-2">
              {['scored', 'missed', 'saved'].map(r => (
                <button key={r} onClick={() => setResult(r)}
                  className={cn('py-3 rounded-xl text-sm font-bold capitalize min-h-[52px] transition-all',
                    result === r ? 'bg-primary text-white' : 'glass text-white/60')}>
                  {resultIcon[r]} {r}
                </button>
              ))}
            </div>
            <Button className="w-full" onClick={handleRecord} loading={loading} disabled={!playerName || !result}>
              Record Kick
            </Button>
          </div>
        </div>

        {/* History */}
        <div className="glass rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {[{ team: 'team_a', ks: teamAKicks, label: match.teamA }, { team: 'team_b', ks: teamBKicks, label: match.teamB }].map(({ team, ks, label }) => (
              <div key={team}>
                <p className="text-xs text-white/40 mb-2">{label}</p>
                <div className="flex flex-wrap gap-1">
                  {ks.map((k: any) => (
                    <span key={k.id} className={`text-lg ${resultColor[k.result]}`}>{resultIcon[k.result]}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="secondary" className="w-full" onClick={() => router.push(`/matches/${id}/finish`)}>
          CONFIRM RESULT →
        </Button>
      </motion.div>
    </div>
  );
}
