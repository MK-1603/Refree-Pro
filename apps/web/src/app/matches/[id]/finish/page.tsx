'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';
import { CheckCircle, Flag, CreditCard, ArrowLeftRight, Clock, MapPin, Hash } from 'lucide-react';
import { matchService } from '@/services/matchService';

type Event = any;

function JerseyDot({ color }: { color: string }) {
  const isWhite = color?.toUpperCase() === '#FFFFFF';
  const isBlack = color?.toUpperCase() === '#1A1D20' || color?.toUpperCase() === '#000000';
  const displayColor = isWhite ? '#94a3b8' : isBlack ? '#64748b' : color;
  return <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: displayColor }} />;
}

function TeamLabel({ name, color }: { name: string; color: string }) {
  return (
    <p className="text-[13px] font-black text-foreground/90 uppercase tracking-widest truncate">
      {name}
    </p>
  );
}

export default function FinishPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId]     = useState('');
  const [match, setMatch] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { toast } = useToast();
  const router    = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);
      try {
        const data = await matchService.getMatchFull(id);
        setMatch(data.match);
        setEvents(data.events || []);
      } catch (err) {
        console.error(err);
      }
    });
  }, [params]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await matchService.updateMatch(id, { status: 'completed', completedAt: new Date() });
      setConfirmed(true);
      setTimeout(() => router.push(`/matches/${id}/lock`), 1800);
    } catch {
      toast('Failed to confirm match', 'error');
      setLoading(false);
    }
  };

  /* Loading skeleton */
  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-foreground/10 border-t-foreground animate-spin" />
      </div>
    );
  }

  const active   = events.filter(e => !e.isUndone);
  const goals    = active.filter(e => e.eventType === 'goal').length;
  const yellows  = active.filter(e => e.cardType === 'yellow').length;
  const reds     = active.filter(e => e.cardType === 'red').length;
  const subs     = active.filter(e => e.eventType === 'sub').length;
  const goalsA   = active.filter(e => e.eventType === 'goal' && e.team === 'team_a').length;
  const goalsB   = active.filter(e => e.eventType === 'goal' && e.team === 'team_b').length;

  const winner =
    goalsA > goalsB ? match.teamA :
    goalsB > goalsA ? match.teamB : null;

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">

      {/* ── TOP STATUS BAR ── */}
      <div className="shrink-0 px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Full Time
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
            {match.matchDate && (
              <span className="flex items-center gap-1">
                <Clock size={9} />
                {match.matchDate}
              </span>
            )}
            {match.venue && (
              <span className="flex items-center gap-1">
                <MapPin size={9} />
                {match.venue}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Hash size={9} />
              {match.matchNumber}
            </span>
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 pb-6 space-y-4">

        {/* MAIN RESULT CARD */}
        <div className="rounded-2xl border border-border/25 bg-card/40 overflow-hidden">
          {/* Winner banner */}
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="px-4 py-2 bg-foreground/5 border-b border-border/20 text-center"
              >
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  🏆 {winner} wins
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Score section */}
          <div className="px-6 py-8">
            <div className="flex items-center justify-between gap-4">
              {/* Team A */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <JerseyDot color={match.teamAColor} />
                <TeamLabel name={match.teamA} color={match.teamAColor} />
                <span
                  className="text-[64px] font-black leading-none"
                  style={{ fontFamily: 'var(--font-bebas), Oswald, sans-serif' }}
                >
                  {match.scoreA ?? goalsA}
                </span>
              </div>

              {/* Divider */}
              <div className="flex flex-col items-center gap-1 shrink-0 pb-6">
                <span className="text-[28px] font-black text-foreground/20">—</span>
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <JerseyDot color={match.teamBColor} />
                <TeamLabel name={match.teamB} color={match.teamBColor} />
                <span
                  className="text-[64px] font-black leading-none"
                  style={{ fontFamily: 'var(--font-bebas), Oswald, sans-serif' }}
                >
                  {match.scoreB ?? goalsB}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STAT PILLS */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Goals',  value: goals,   icon: <Flag size={13} />, color: 'text-foreground' },
            { label: 'Yellow', value: yellows, icon: <div className="w-3 h-3.5 bg-yellow-400 rounded-[2px]" />, color: 'text-yellow-400' },
            { label: 'Red',    value: reds,    icon: <div className="w-3 h-3.5 bg-red-500 rounded-[2px]" />, color: 'text-red-400' },
            { label: 'Subs',   value: subs,    icon: <ArrowLeftRight size={13} />, color: 'text-foreground/60' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="rounded-xl border border-border/25 bg-card/40 p-3 flex flex-col items-center gap-1.5">
              <div className={`${color}`}>{icon}</div>
              <span className={`text-[22px] font-black ${color} leading-none`}>{value}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>

        {/* TIMELINE */}
        {active.length > 0 && (
          <div className="rounded-2xl border border-border/25 bg-card/40 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/15">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
                Match Timeline · {active.length} Events
              </p>
            </div>
            <div className="divide-y divide-border/10">
              {active.map(e => {
                const isGoal   = e.eventType === 'goal';
                const isYellow = e.cardType === 'yellow';
                const isRed    = e.cardType === 'red';
                const isSub    = e.eventType === 'sub';
                const playerName = isSub
                  ? `${e.playerOut} → ${e.playerIn}`
                  : e.playerName;
                const extra = isGoal && e.goalType !== 'normal' ? ` · ${e.goalType}` : '';
                const teamName = e.team === 'team_a' ? match.teamA : match.teamB;

                return (
                  <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                    {/* Icon */}
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-foreground/5">
                      {isGoal   && <span className="text-[14px]">⚽</span>}
                      {isYellow && <div className="w-2.5 h-3 bg-yellow-400 rounded-[2px]" />}
                      {isRed    && <div className="w-2.5 h-3 bg-red-500 rounded-[2px]" />}
                      {isSub    && <ArrowLeftRight size={12} className="text-foreground/50" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-foreground truncate">
                        {playerName}{extra}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{teamName}</p>
                    </div>

                    {/* Minute */}
                    <span className="text-[12px] font-black text-foreground/60 font-mono shrink-0">
                      {e.minute}'
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="shrink-0 px-5 pb-8 pt-3 border-t border-border/10 bg-background/95 backdrop-blur-xl">
        <button
          onClick={handleConfirm}
          disabled={loading || confirmed}
          className="w-full h-14 rounded-xl bg-foreground text-background text-[15px] font-black tracking-wide
            hover:opacity-90 active:scale-[0.98] transition-all duration-200
            flex items-center justify-center gap-2.5 disabled:opacity-60"
        >
          {confirmed ? (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Match Confirmed
            </motion.span>
          ) : loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Confirming...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle size={17} />
              Confirm Full Time
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
