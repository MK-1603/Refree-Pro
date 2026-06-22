'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import {
  ChevronLeft, Play, Edit, Lock, FileText, Image as ImageIcon,
  Activity, Users, BarChart3, Info,
  MapPin, Calendar, Clock, User, Layers, Timer, Coffee, Zap,
  ArrowLeftRight, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Status badge ─────────────────────────────────────────────── */
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    scheduled:  { label: 'Scheduled',  cls: 'bg-foreground/8 text-foreground/60 border-border/30' },
    live:       { label: '● Live',     cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
    completed:  { label: 'Completed',  cls: 'bg-foreground/8 text-foreground/60 border-border/30' },
    abandoned:  { label: 'Abandoned',  cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-foreground/5 text-muted-foreground border-border/30' };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border', s.cls)}>
      {s.label}
    </span>
  );
}

/* ── Jersey dot ──────────────────────────────────────────────── */
function JerseyDot({ color, size = 10 }: { color: string; size?: number }) {
  const isWhite = color?.toUpperCase() === '#FFFFFF';
  const isBlack = ['#1A1D20', '#000000'].includes(color?.toUpperCase());
  const c = isWhite ? '#94a3b8' : isBlack ? '#64748b' : color;
  return (
    <div
      className="rounded-full ring-1 ring-white/10 shrink-0"
      style={{ width: size, height: size, backgroundColor: c }}
    />
  );
}

/* ── Score number ──────────────────────────────────────────────── */
function ScoreNum({ v }: { v: number }) {
  return (
    <span
      className="text-[72px] leading-none font-black tabular-nums text-foreground"
      style={{ fontFamily: 'var(--font-bebas), Oswald, system-ui, sans-serif' }}
    >
      {v}
    </span>
  );
}

/* ── Info row ─────────────────────────────────────────────────── */
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/10 last:border-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-foreground/6 flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
        <span className="text-[12px] font-semibold text-muted-foreground">{label}</span>
      </div>
      <span className="text-[13px] font-bold text-foreground">{value || '—'}</span>
    </div>
  );
}

/* ── Stat bar ─────────────────────────────────────────────────── */
function StatBar({ label, a, b, icon }: { label: string; a: number; b: number; icon: React.ReactNode }) {
  const total = a + b || 1;
  const pctA  = (a / total) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[18px] font-black text-foreground">{a}</span>
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-[18px] font-black text-foreground">{b}</span>
      </div>
      <div className="h-1.5 rounded-full bg-foreground/8 overflow-hidden flex">
        <div className="h-full bg-foreground rounded-l-full transition-all duration-500" style={{ width: `${pctA}%` }} />
        <div className="h-full bg-foreground/30 rounded-r-full flex-1" />
      </div>
    </div>
  );
}

/* ── Event row ─────────────────────────────────────────────────── */
function EventRow({ e, teamA, teamB }: { e: any; teamA: string; teamB: string }) {
  const isGoal   = e.eventType === 'goal';
  const isYellow = e.cardType === 'yellow';
  const isRed    = e.cardType === 'red';
  const isSub    = e.eventType === 'sub';
  const name = isSub ? `${e.playerOut} → ${e.playerIn}` : e.playerName || '—';
  const extra = isGoal && e.goalType !== 'normal' ? ` · ${e.goalType}` : '';
  const teamName = e.team === 'team_a' ? teamA : teamB;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/8 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
        {isGoal   && <span className="text-[13px]">⚽</span>}
        {isYellow && <div className="w-2.5 h-3 bg-yellow-400 rounded-[2px]" />}
        {isRed    && <div className="w-2.5 h-3 bg-red-500 rounded-[2px]" />}
        {isSub    && <ArrowLeftRight size={11} className="text-foreground/50" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold text-foreground truncate">{name}{extra}</p>
        <p className="text-[10px] text-muted-foreground">{teamName}</p>
      </div>
      <span className="text-[12px] font-black text-muted-foreground font-mono">{e.minute}'</span>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',  label: 'Overview',  icon: Info },
  { id: 'timeline',  label: 'Timeline',  icon: Activity },
  { id: 'squads',    label: 'Squads',    icon: Users },
  { id: 'stats',     label: 'Statistics', icon: BarChart3 },
];

export default function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId]       = useState('');
  const [match, setMatch] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [tab, setTab]     = useState('overview');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);
      const [mr, er] = await Promise.all([
        fetch(`/api/matches/${id}`),
        fetch(`/api/matches/${id}/events`),
      ]);
      const d = await mr.json();
      setMatch(d.match);
      setPlayers(d.players || []);
      setEvents(await er.json());
      setLoading(false);
    });
  }, [params]);

  if (loading) return (
    <AppLayout>
      <div className="p-4 max-w-lg mx-auto space-y-4 pt-6">
        <SkeletonCard /><SkeletonCard />
      </div>
    </AppLayout>
  );

  if (!match) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center p-8">
        <AlertCircle size={32} className="text-muted-foreground/40" />
        <p className="text-[15px] font-bold text-foreground">Match not found</p>
        <p className="text-[12px] text-muted-foreground">This match may have been deleted.</p>
      </div>
    </AppLayout>
  );

  const active = events.filter(e => !e.isUndone);
  const goalsA = active.filter(e => e.eventType === 'goal' && e.team === 'team_a').length;
  const goalsB = active.filter(e => e.eventType === 'goal' && e.team === 'team_b').length;
  const yellowA = active.filter(e => e.cardType === 'yellow' && e.team === 'team_a').length;
  const yellowB = active.filter(e => e.cardType === 'yellow' && e.team === 'team_b').length;
  const redA   = active.filter(e => e.cardType === 'red' && e.team === 'team_a').length;
  const redB   = active.filter(e => e.cardType === 'red' && e.team === 'team_b').length;
  const subA   = active.filter(e => e.eventType === 'sub' && e.team === 'team_a').length;
  const subB   = active.filter(e => e.eventType === 'sub' && e.team === 'team_b').length;

  const winner =
    goalsA > goalsB ? match.teamA :
    goalsB > goalsA ? match.teamB : null;

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto pb-24">

        {/* ── HEADER ── */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border/10 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full border border-border/40 bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 active:scale-95 transition-all shrink-0"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
              {match.venue || 'Match'} · #{match.matchNumber}
            </p>
            <h1 className="text-[16px] font-black text-foreground truncate">
              {match.teamA} vs {match.teamB}
            </h1>
          </div>
          <StatusPill status={match.status} />
        </div>

        {/* ── SCOREBOARD CARD ── */}
        <div className="mx-4 mt-4 rounded-2xl border border-border/25 bg-card/40 overflow-hidden">
          {/* Color strip */}
          <div className="h-0.5 flex">
            <div className="flex-1" style={{ backgroundColor: match.teamAColor }} />
            <div className="flex-1" style={{ backgroundColor: match.teamBColor }} />
          </div>

          <div className="px-5 py-6">
            {/* Teams */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1">
                <JerseyDot color={match.teamAColor} size={10} />
                <p className="text-[11px] font-black text-foreground/80 uppercase tracking-widest truncate">
                  {match.teamA}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <p className="text-[11px] font-black text-foreground/80 uppercase tracking-widest truncate text-right">
                  {match.teamB}
                </p>
                <JerseyDot color={match.teamBColor} size={10} />
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center justify-center gap-6">
              <ScoreNum v={match.scoreA ?? goalsA} />
              <span className="text-[28px] font-black text-foreground/15 pb-1">—</span>
              <ScoreNum v={match.scoreB ?? goalsB} />
            </div>

            {/* Winner */}
            {winner && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2"
              >
                🏆 {winner} wins
              </motion.p>
            )}
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="mx-4 mt-3 flex flex-wrap gap-2">
          {match.status === 'scheduled' && (
            <button
              onClick={() => router.push(`/matches/${id}/countdown`)}
              className="flex items-center gap-2 px-4 h-10 rounded-xl bg-foreground text-background text-[12px] font-black hover:opacity-90 active:scale-95 transition-all"
            >
              <Play size={13} className="fill-current" /> Start Match
            </button>
          )}
          {match.status === 'live' && (
            <button
              onClick={() => router.push(`/matches/${id}/live`)}
              className="flex items-center gap-2 px-4 h-10 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-[12px] font-black hover:bg-green-500/15 active:scale-95 transition-all"
            >
              <Play size={13} className="fill-current" /> Resume Live
            </button>
          )}
          {!match.isLocked && (
            <button
              onClick={() => router.push(`/matches/${id}/edit`)}
              className="flex items-center gap-2 px-4 h-10 rounded-xl border border-border/40 bg-foreground/5 text-[12px] font-black hover:bg-foreground/10 active:scale-95 transition-all"
            >
              <Edit size={13} /> Edit
            </button>
          )}
          {match.status === 'completed' && !match.isLocked && (
            <>
              <button
                onClick={() => router.push(`/matches/${id}/live`)}
                className="flex items-center gap-2 px-4 h-10 rounded-xl border border-border/40 bg-foreground/5 text-[12px] font-black hover:bg-foreground/10 active:scale-95 transition-all"
              >
                <Edit size={13} /> Edit Timeline
              </button>
              <button
                onClick={() => router.push(`/matches/${id}/lock`)}
                className="flex items-center gap-2 px-4 h-10 rounded-xl border border-border/40 bg-foreground/5 text-[12px] font-black hover:bg-foreground/10 active:scale-95 transition-all"
              >
                <Lock size={13} /> Lock Match
              </button>
            </>
          )}
          {match.status === 'completed' && (
            <>
              <button
                onClick={() => router.push(`/matches/${id}/report`)}
                className="flex items-center gap-2 px-4 h-10 rounded-xl bg-foreground text-background text-[12px] font-black hover:opacity-90 active:scale-95 transition-all"
              >
                <FileText size={13} /> Report
              </button>
              <button
                onClick={() => router.push(`/matches/${id}/poster`)}
                className="flex items-center gap-2 px-4 h-10 rounded-xl border border-border/40 bg-foreground/5 text-[12px] font-black hover:bg-foreground/10 active:scale-95 transition-all"
              >
                <ImageIcon size={13} /> Poster
              </button>
            </>
          )}
        </div>

        {/* ── TABS ── */}
        <div className="mx-4 mt-4 border-b border-border/20 flex gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-all duration-200 -mb-px',
                tab === t.id
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <t.icon size={12} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mx-4 mt-4"
          >

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-border/25 bg-card/40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border/15 bg-foreground/3">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Match Info</p>
                  </div>
                  <div className="px-4">
                    <InfoRow icon={<MapPin size={13} />}  label="Venue"    value={match.venue} />
                    <InfoRow icon={<Calendar size={13} />} label="Date"    value={match.matchDate} />
                    <InfoRow icon={<Clock size={13} />}    label="Kickoff" value={match.matchTime} />
                    <InfoRow icon={<User size={13} />}     label="Referee" value={match.refereeName || 'Not assigned'} />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/25 bg-card/40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border/15 bg-foreground/3">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Rules & Format</p>
                  </div>
                  <div className="px-4">
                    <InfoRow icon={<Layers size={13} />}  label="Format"   value={match.squadFormat} />
                    <InfoRow icon={<Timer size={13} />}   label="Duration" value={`${match.matchDuration} min / half`} />
                    <InfoRow icon={<Coffee size={13} />}  label="Break"    value={`${match.breakDuration} min`} />
                    <InfoRow icon={<Zap size={13} />}     label="Extra Time" value={match.extraTime ? `${match.extraTime} min` : 'Off'} />
                  </div>
                </div>
              </div>
            )}

            {/* TIMELINE */}
            {tab === 'timeline' && (
              <div className="rounded-2xl border border-border/25 bg-card/40 overflow-hidden">
                {active.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Activity size={28} className="text-muted-foreground/30" />
                    <p className="text-[12px] text-muted-foreground font-medium">No events recorded</p>
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b border-border/15 bg-foreground/3">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
                        {active.length} events
                      </p>
                    </div>
                    {active.map(e => (
                      <EventRow key={e.id} e={e} teamA={match.teamA} teamB={match.teamB} />
                    ))}
                  </>
                )}
              </div>
            )}

            {/* SQUADS */}
            {tab === 'squads' && (
              <div className="grid grid-cols-2 gap-3">
                {(['team_a', 'team_b'] as const).map(team => {
                  const teamPlayers = players.filter(p => p.team === team);
                  const teamName = team === 'team_a' ? match.teamA : match.teamB;
                  const teamColor = team === 'team_a' ? match.teamAColor : match.teamBColor;
                  return (
                    <div key={team} className="rounded-2xl border border-border/25 bg-card/40 overflow-hidden">
                      {/* Header strip */}
                      <div className="h-0.5" style={{ backgroundColor: teamColor }} />
                      <div className="px-3 py-3 border-b border-border/15">
                        <div className="flex items-center gap-2">
                          <JerseyDot color={teamColor} size={8} />
                          <p className="text-[10px] font-black text-foreground uppercase tracking-widest truncate">
                            {teamName}
                          </p>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-0.5">
                          {teamPlayers.length} players
                        </p>
                      </div>
                      <div className="py-1">
                        {teamPlayers.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground italic text-center py-5">No squad</p>
                        ) : teamPlayers.map(p => (
                          <div key={p.id} className="flex items-center gap-2 px-3 py-2 border-b border-border/8 last:border-0">
                            <span className="text-[9px] font-black text-muted-foreground font-mono w-5 text-right shrink-0">
                              {p.jerseyNo ?? '—'}
                            </span>
                            <span className="text-[11px] font-semibold text-foreground truncate">{p.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STATS */}
            {tab === 'stats' && (
              <div className="rounded-2xl border border-border/25 bg-card/40 overflow-hidden">
                <div className="px-4 py-3 border-b border-border/15 bg-foreground/3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <JerseyDot color={match.teamAColor} size={8} />
                      <p className="text-[10px] font-black text-foreground uppercase tracking-widest">{match.teamA}</p>
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">vs</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] font-black text-foreground uppercase tracking-widest">{match.teamB}</p>
                      <JerseyDot color={match.teamBColor} size={8} />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 space-y-5">
                  <StatBar label="Goals"         a={goalsA}  b={goalsB}  icon={<span className="text-[11px]">⚽</span>} />
                  <StatBar label="Yellow Cards"  a={yellowA} b={yellowB} icon={<div className="w-2 h-2.5 bg-yellow-400 rounded-[1px]" />} />
                  <StatBar label="Red Cards"     a={redA}    b={redB}    icon={<div className="w-2 h-2.5 bg-red-500 rounded-[1px]" />} />
                  <StatBar label="Substitutions" a={subA}    b={subB}    icon={<ArrowLeftRight size={11} className="text-muted-foreground" />} />
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </AppLayout>
  );
}
