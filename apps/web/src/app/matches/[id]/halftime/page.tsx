'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MatchTimer } from '@/lib/timer';
import { EventItem } from '@/components/match/EventItem';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Play, Pause, ChevronRight } from 'lucide-react';

export default function HalftimePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [match, setMatch] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [remainingMs, setRemainingMs] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const rafRef = useRef<number | undefined>(undefined);
  const lastTickRef = useRef(Date.now());
  const isRunningRef = useRef(true);

  const toggleTimer = () => {
    setIsRunning(v => { isRunningRef.current = !v; return !v; });
  };

  useEffect(() => {
    params.then(async ({ id: matchId }) => {
      setId(matchId);
      const [matchRes, eventsRes] = await Promise.all([
        fetch(`/api/matches/${matchId}`),
        fetch(`/api/matches/${matchId}/events`),
      ]);
      const d = await matchRes.json();
      setMatch(d.match);
      setEvents(await eventsRes.json());
      setRemainingMs(d.match.breakDuration * 60 * 1000);
      lastTickRef.current = Date.now();

      const tick = () => {
        const now = Date.now();
        if (isRunningRef.current) {
          const delta = now - lastTickRef.current;
          setRemainingMs(prev => Math.max(0, prev - delta));
        }
        lastTickRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    });
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [params]);

  const handleStartSecondHalf = async () => {
    setLoading(true);
    try {
      await fetch(`/api/matches/${id}/timer/second-half`, { method: 'POST' });
      router.push(`/matches/${id}/live`);
    } catch { toast('Failed', 'error'); setLoading(false); }
  };

  if (!match) return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#08080E]">
      <div className="w-9 h-9 rounded-full border-[1.5px] border-white/10 border-t-white/40 animate-spin" />
    </div>
  );

  const activeEvents = events.filter(e => !e.isUndone);
  const breakPct = match.breakDuration > 0 ? Math.max(0, (remainingMs / (match.breakDuration * 60 * 1000)) * 100) : 0;
  const breakOver = remainingMs === 0;

  return (
    <div className="fixed inset-0 flex flex-col bg-[#08080E] text-white overflow-hidden">

      {/* ── Header ── */}
      <header className="flex-none flex items-center justify-between px-5 pt-5 pb-3">
        <button onClick={() => router.push(`/matches/${id}`)}
          className="w-9 h-9 rounded-[11px] bg-white/[0.06] hover:bg-white/10 flex items-center justify-center transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-medium">Half Time</p>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-[0.12em] uppercase ${
            breakOver ? 'bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-400' : 'bg-amber-500/[0.08] border-amber-500/20 text-amber-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${breakOver ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            {breakOver ? 'Break Over' : 'Break'}
          </div>
        </div>
        <div className="w-9" /> {/* spacer */}
      </header>

      {/* ── Scoreboard ── */}
      <div className="flex-none px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex flex-col items-start gap-1 min-w-0 pr-3">
            <div className="w-6 h-[3px] rounded-full" style={{ backgroundColor: match.teamAColor }} />
            <p className="text-[15px] font-black truncate" style={{ color: match.teamAColor }}>{match.teamA}</p>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-[18px]"
            style={{ background: 'rgba(255,255,255,0.032)', border: '1px solid rgba(255,255,255,0.055)' }}>
            <span className="text-[44px] font-black tabular-nums leading-none">{match.scoreA ?? 0}</span>
            <span className="text-[20px] font-extralight text-white/10">–</span>
            <span className="text-[44px] font-black tabular-nums leading-none">{match.scoreB ?? 0}</span>
          </div>
          <div className="flex-1 flex flex-col items-end gap-1 min-w-0 pl-3">
            <div className="w-6 h-[3px] rounded-full" style={{ backgroundColor: match.teamBColor }} />
            <p className="text-[15px] font-black truncate text-right" style={{ color: match.teamBColor }}>{match.teamB}</p>
          </div>
        </div>
      </div>

      {/* ── Break Timer ── */}
      <div className="flex-none px-5 py-2">
        <div className="rounded-[18px] p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 text-center mb-3 font-semibold">
            {breakOver ? 'Break Complete' : 'Break Ends In'}
          </p>

          {/* Digital time */}
          <div className="flex items-baseline justify-center gap-1 mb-4">
            <motion.span
              key={Math.floor(remainingMs / 1000)}
              className={`text-[52px] font-black tabular-nums leading-none ${breakOver ? 'text-emerald-400' : 'text-white'}`}>
              {MatchTimer.formatDisplay(remainingMs).split('.')[0]}
            </motion.span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-[3px] rounded-full bg-white/[0.06] mb-4 overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-all ${breakOver ? 'bg-emerald-400' : 'bg-amber-400'}`}
              style={{ width: `${breakPct}%` }}
            />
          </div>

          {/* Pause / resume */}
          {!breakOver && (
            <button onClick={toggleTimer}
              className={`w-full h-10 rounded-[12px] flex items-center justify-center gap-2 text-[12px] font-bold tracking-wide transition-all active:scale-[0.97] ${
                isRunning
                  ? 'bg-amber-500/[0.10] border border-amber-500/[0.20] text-amber-400'
                  : 'bg-white/[0.05] border border-white/[0.10] text-white/50'
              }`}>
              {isRunning ? <><Pause size={14} strokeWidth={2.5} /> Pause Break</> : <><Play size={14} strokeWidth={2.5} /> Resume Break</>}
            </button>
          )}

          {breakOver && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-emerald-400 text-center font-semibold tracking-wide">
              Players should be ready ●
            </motion.p>
          )}
        </div>
      </div>

      {/* ── 1st Half Events ── */}
      <div className="flex-1 overflow-y-auto px-5 py-2 min-h-0">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/20 font-semibold mb-3">1st Half Events</p>
        {activeEvents.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-white/20 text-sm">No events recorded</div>
        ) : (
          <div className="space-y-1.5">
            {activeEvents.map(e => {
              const type = e.eventType === 'goal' ? 'goal' : e.cardType === 'yellow' ? 'yellow' : e.cardType === 'red' ? 'red' : 'sub';
              const name = e.eventType === 'sub' ? `${e.playerOut} → ${e.playerIn}` : e.playerName;
              const extra = e.eventType === 'goal' && e.goalType !== 'normal' ? ` (${e.goalType})` : '';
              return (
                <EventItem key={e.id} minute={e.minute} elapsedMs={e.elapsedMs}
                  type={type as any} playerName={`${name}${extra}`}
                  teamSide={e.team === 'team_a' ? 'home' : 'away'} />
              );
            })}
          </div>
        )}
      </div>

      {/* ── Start 2nd Half ── */}
      <div className="flex-none px-5 pb-6 pt-3 border-t border-white/[0.05]">
        <button onClick={handleStartSecondHalf} disabled={loading}
          className="w-full h-[54px] rounded-[16px] flex items-center justify-center gap-2.5 text-[14px] font-black tracking-wide bg-indigo-500/[0.15] border border-indigo-500/[0.30] text-indigo-400 hover:bg-indigo-500/[0.22] transition-all active:scale-[0.97] disabled:opacity-50">
          {loading
            ? <div className="w-5 h-5 rounded-full border-[1.5px] border-indigo-400/30 border-t-indigo-400 animate-spin" />
            : <><Play size={16} strokeWidth={2.5} /> Start Second Half <ChevronRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}
