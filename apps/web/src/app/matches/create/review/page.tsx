'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateMatch } from '../CreateMatchContext';
import { CreateMatchStepper } from '../CreateMatchStepper';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  MapPin, Calendar, Clock, User, Trophy, Timer, Coffee, Layers,
  ChevronLeft, CheckCircle2, Rocket,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { matchService } from '@/services/matchService';

const FootballModel = dynamic(
  () => import('@/components/3d/FootballModel').then(m => ({ default: m.FootballModel })),
  { ssr: false }
);

const JerseyIcon = ({ color, size = 36 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}
    stroke="var(--color-foreground)" strokeWidth="1.2" strokeOpacity="0.15"
    className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
  >
    <path d="M6 3L8 5C9 4 10 3.5 12 3.5C14 3.5 15 4 16 5L18 3C19 3 20 4 20 5V10H17V21H7V10H4V5C4 4 5 3 6 3Z" />
  </svg>
);

function TeamNameLabel({ name, color }: { name: string; color: string }) {
  const isWhite = color === '#FFFFFF';
  const isBlack = color === '#1A1D20';
  if (isWhite || isBlack) {
    return (
      <span className="text-[13px] font-black px-2 py-0.5 rounded-md"
        style={{ color: isWhite ? '#FFFFFF' : '#000000', backgroundColor: isWhite ? '#1A1D20' : '#FFFFFF' }}>
        {name || 'TBD'}
      </span>
    );
  }
  return (
    <span className="text-[13px] font-black" style={{ color }}>
      {name || 'TBD'}
    </span>
  );
}

export default function ReviewPage() {
  const { state, reset } = useCreateMatch();
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const router  = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => { reset(); router.push('/matches'); }, 3200);
      return () => clearTimeout(t);
    }
  }, [success, reset, router]);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await matchService.createMatch({
        tournamentId:  state.tournamentId?.trim() || null,
        venue:         state.venue,
        matchNumber:   parseInt(state.matchNumber),
        matchDate:     state.matchDate,
        matchTime:     state.matchTime,
        refereeName:   state.refereeName || null,
        teamA:         state.teamA,
        teamB:         state.teamB,
        teamAColor:    state.teamAColor,
        teamBColor:    state.teamBColor,
        squadFormat:   state.squadFormat,
        matchDuration: state.matchDuration,
        breakDuration: state.breakDuration,
        extraTime:     state.extraTime,
        players:       state.players.filter(p => p.name),
      });
      setSuccess(true);
    } catch (e) {
      toast(`Error: ${e instanceof Error ? e.message : 'Storage error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const details = [
    { icon: MapPin,   label: 'Venue',    value: state.venue },
    { icon: Calendar, label: 'Date',     value: state.matchDate },
    { icon: Clock,    label: 'Time',     value: state.matchTime },
    { icon: Layers,   label: 'Format',   value: state.squadFormat },
    { icon: Timer,    label: 'Duration', value: `${state.matchDuration} min/half` },
    { icon: Coffee,   label: 'Break',    value: `${state.breakDuration} min` },
    { icon: User,     label: 'Referee',  value: state.refereeName || 'Not set' },
    { icon: Trophy,   label: 'Extra T.', value: state.extraTime ? `${state.extraTime} min` : 'Off' },
  ];

  const teamAPlayers = state.players.filter(p => p.name && p.team === 'team_a');
  const teamBPlayers = state.players.filter(p => p.name && p.team === 'team_b');

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-lg flex flex-col bg-background">

      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-5 pb-4 border-b border-border/10 bg-background/95 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.push('/matches/create/config')}
            className="w-9 h-9 rounded-full border border-border/40 bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 active:scale-95 transition-all"
          >
            <ChevronLeft size={18} strokeWidth={2.5} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-black text-foreground tracking-tight">New Match</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Step 4 of 4 — Review & Launch</p>
          </div>
        </div>
        <CreateMatchStepper current={3} />
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-5 space-y-4">

        {/* VS Card */}
        <div className="rounded-2xl border border-border/30 bg-card/40 p-5">
          <div className="flex items-center justify-between gap-3">
            {/* Team A */}
            <div className="flex flex-col items-center gap-2 flex-1 text-center">
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-border/20 flex items-center justify-center">
                <JerseyIcon color={state.teamAColor} size={40} />
              </div>
              <TeamNameLabel name={state.teamA} color={state.teamAColor} />
            </div>

            {/* VS */}
            <div className="flex flex-col items-center shrink-0 gap-1">
              <div className="w-10 h-10 rounded-full bg-foreground/8 border border-border/30 flex items-center justify-center">
                <span className="text-[11px] font-black text-foreground">VS</span>
              </div>
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Match {state.matchNumber}</span>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center gap-2 flex-1 text-center">
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-border/20 flex items-center justify-center">
                <JerseyIcon color={state.teamBColor} size={40} />
              </div>
              <TeamNameLabel name={state.teamB} color={state.teamBColor} />
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="rounded-2xl border border-border/30 bg-card/40 overflow-hidden">
          <div className="px-4 py-3 bg-foreground/3 border-b border-border/20">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Match Details</p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-border/20">
            {details.map(({ icon: Icon, label, value }, i) => (
              <div
                key={label}
                className={`flex items-center gap-3 px-4 py-3 ${i % 2 === 0 ? 'border-r-0' : ''} ${i > 1 ? 'border-t border-border/15' : ''}`}
              >
                <div className="w-7 h-7 rounded-lg bg-foreground/8 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
                  <p className="text-[12px] font-bold text-foreground truncate">{value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Squads */}
        {(teamAPlayers.length > 0 || teamBPlayers.length > 0) && (
          <div className="rounded-2xl border border-border/30 bg-card/40 overflow-hidden">
            <div className="px-4 py-3 bg-foreground/3 border-b border-border/20">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Registered Squads</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-border/20 p-4 gap-4">
              {/* Team A */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: state.teamAColor }} />
                  <span className="text-[10px] font-black text-foreground uppercase tracking-wide truncate">
                    {state.teamA || 'Team A'}
                  </span>
                </div>
                {teamAPlayers.length === 0
                  ? <p className="text-[11px] text-muted-foreground italic">No players</p>
                  : teamAPlayers.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                        style={{ backgroundColor: state.teamAColor, color: state.teamAColor === '#FFFFFF' || state.teamAColor === '#F1C40F' ? '#000' : '#fff' }}>
                        {p.jerseyNo ?? '?'}
                      </span>
                      <span className="text-[11px] font-semibold text-foreground truncate">{p.name}</span>
                    </div>
                  ))
                }
              </div>
              {/* Team B */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: state.teamBColor }} />
                  <span className="text-[10px] font-black text-foreground uppercase tracking-wide truncate">
                    {state.teamB || 'Team B'}
                  </span>
                </div>
                {teamBPlayers.length === 0
                  ? <p className="text-[11px] text-muted-foreground italic">No players</p>
                  : teamBPlayers.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                        style={{ backgroundColor: state.teamBColor, color: state.teamBColor === '#FFFFFF' || state.teamBColor === '#F1C40F' ? '#000' : '#fff' }}>
                        {p.jerseyNo ?? '?'}
                      </span>
                      <span className="text-[11px] font-semibold text-foreground truncate">{p.name}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 px-4 pt-3 pb-8 border-t border-border/10 bg-background/95 backdrop-blur-xl flex gap-3">
        <Button
          variant="ghost"
          className="w-[30%] h-12 text-muted-foreground hover:bg-foreground/5 font-semibold"
          onClick={() => router.back()}
          disabled={loading}
        >
          ← Back
        </Button>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="flex-1 h-12 rounded-xl bg-foreground text-background text-[15px] font-black tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Creating...
            </span>
          ) : (
            <span className="flex items-center gap-2"><Rocket size={16} /> Launch Match</span>
          )}
        </button>
      </div>

      {/* ── Success Overlay ── */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/97 backdrop-blur-xl"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-80 h-80 rounded-full bg-foreground/10 blur-[100px]"
              />
            </div>

            <motion.div
              initial={{ scale: 0.75, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
              className="relative z-10 flex flex-col items-center text-center px-8 gap-5"
            >
              <div className="mb-2">
                <FootballModel size={200} />
              </div>

              <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center shadow-lg">
                <CheckCircle2 size={26} className="text-background" />
              </div>

              <div>
                <h2 className="text-[28px] font-black text-foreground tracking-tight">Match Created!</h2>
                <p className="text-muted-foreground text-[13px] mt-1 font-medium">Redirecting to Match Hub...</p>
              </div>

              <div className="w-48 h-1 bg-foreground/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                  className="h-full bg-foreground rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
