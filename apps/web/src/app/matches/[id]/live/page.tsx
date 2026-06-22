'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMatchStore } from '@/store/matchStore';
import { MatchTimer } from '@/lib/timer';
import { StopwatchModel } from '@/components/3d/StopwatchModel';
import { GoalModal } from '@/components/match/GoalModal';
import { CardModal } from '@/components/match/CardModal';
import { SubModal } from '@/components/match/SubModal';
import { EventItem } from '@/components/match/EventItem';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Pause, Play, Timer, CheckCircle, ChevronLeft, ArrowLeftRight, RotateCcw, AlignRight, AlertTriangle } from 'lucide-react';

export default function LiveMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [match, setMatch] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [showGoal, setShowGoal] = useState(false);
  const [showYellow, setShowYellow] = useState(false);
  const [showRed, setShowRed] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showHalftimeModal, setShowHalftimeModal] = useState(false);
  const [showDecisionPanel, setShowDecisionPanel] = useState(false);
  const [customInjuryTime, setCustomInjuryTime] = useState('');
  const [timeExceeded, setTimeExceeded] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editState, setEditState] = useState({ minute: '', playerName: '', playerIn: '', playerOut: '' });

  const { timer, setTimer, tickTimer, setScore, scoreA, scoreB } = useMatchStore();
  const { toast } = useToast();
  const router = useRouter();
  const rafRef = useRef<number | undefined>(undefined);
  const [pendingElapsedMs, setPendingElapsedMs] = useState<number | null>(null);

  const getOffsetElapsedMs = () => {
    const offset =
      timer.currentHalf === 2 ? (match?.matchDuration ?? 45) * 60 * 1000 :
      timer.currentHalf === 3 ? (match?.matchDuration ?? 45) * 2 * 60 * 1000 : 0;
    return timer.elapsedMs + offset;
  };

  const triggerGoal   = () => { setPendingElapsedMs(getOffsetElapsedMs()); setShowGoal(true); };
  const triggerYellow = () => { setPendingElapsedMs(getOffsetElapsedMs()); setShowYellow(true); };
  const triggerRed    = () => { setPendingElapsedMs(getOffsetElapsedMs()); setShowRed(true); };
  const triggerSub    = () => { setPendingElapsedMs(getOffsetElapsedMs()); setShowSub(true); };

  useEffect(() => {
    params.then(async ({ id: matchId }) => {
      setId(matchId);
      const [mRes, eRes] = await Promise.all([
        fetch(`/api/matches/${matchId}`),
        fetch(`/api/matches/${matchId}/events`),
      ]);
      const mData = await mRes.json();
      const eData = await eRes.json();
      setMatch(mData.match);
      setPlayers(mData.players || []);
      setEvents(Array.isArray(eData) ? eData : []);
      setScore(mData.match.scoreA ?? 0, mData.match.scoreB ?? 0);
      if (mData.timer) {
        const t = mData.timer;
        const elapsed = t.isRunning
          ? MatchTimer.calculateElapsed(t.startedAtUnix, t.totalPausedMs, null, true)
          : MatchTimer.calculateElapsed(t.startedAtUnix, t.totalPausedMs, t.pausedAtUnix, false);
        setTimer({ startedAtUnix: t.startedAtUnix, pausedAtUnix: t.pausedAtUnix, totalPausedMs: t.totalPausedMs, isRunning: t.isRunning, currentHalf: t.currentHalf ?? 1, elapsedMs: elapsed, injuryTimeMs: t.injuryTimeMs ?? 0 });
        if (t.isRunning) toast('Resumed from saved state', 'info');
      } else {
        setTimer({ startedAtUnix: null, pausedAtUnix: null, totalPausedMs: 0, isRunning: false, currentHalf: 1, elapsedMs: 0 });
      }
    });
  }, [params]);

  useEffect(() => {
    const tick = () => { tickTimer(); rafRef.current = requestAnimationFrame(tick); };
    if (timer.isRunning) rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [timer.isRunning]);

  useEffect(() => {
    if (!id || !timer.isRunning) return;
    const pauseOnHide = () => fetch(`/api/matches/${id}/timer/pause`, { method: 'POST', keepalive: true }).catch(() => {});
    const onVis = () => { if (document.visibilityState === 'hidden') pauseOnHide(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('beforeunload', pauseOnHide);
    return () => { document.removeEventListener('visibilitychange', onVis); window.removeEventListener('beforeunload', pauseOnHide); pauseOnHide(); };
  }, [id, timer.isRunning]);

  // ── Detect time exceeded → show injury strip, then auto decision panel ──
  useEffect(() => {
    if (!match || !timer.isRunning) return;
    const halfMs = match.matchDuration * 60 * 1000;
    const threshold = halfMs + (timer.injuryTimeMs || 0);
    if ((timer.currentHalf === 1 || timer.currentHalf === 2) && timer.elapsedMs >= threshold) {
      // Mark time exceeded so injury time strip appears
      setTimeExceeded(true);
      // Auto-pause and show decision modal if no extra time added
      handlePause();
      setShowDecisionPanel(true);
    }
  }, [timer.elapsedMs, match, timer.currentHalf, timer.isRunning, timer.injuryTimeMs]);

  // Show injury strip whenever we are running past regulation (injury time already added)
  useEffect(() => {
    if (!match) return;
    const halfMs = match.matchDuration * 60 * 1000;
    const exceeded = (timer.currentHalf === 1 || timer.currentHalf === 2) && timer.elapsedMs >= halfMs;
    setTimeExceeded(exceeded);
  }, [timer.elapsedMs, match, timer.currentHalf]);

  const currentMinute = timer.currentHalf === 2
    ? MatchTimer.getMinute(timer.elapsedMs + (match?.matchDuration ?? 45) * 60 * 1000)
    : MatchTimer.getMinute(timer.elapsedMs);

  const apiCall = useCallback(async (url: string, body: object) => {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error();
    return res.json();
  }, []);

  const handleAddInjuryTime = async (minutes: number) => {
    if (!minutes || minutes <= 0) return;
    try {
      const ms = (timer.injuryTimeMs || 0) + minutes * 60000;
      await fetch(`/api/matches/${id}/timer/injury-time`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ injuryTimeMs: ms }) });
      setTimer({ injuryTimeMs: ms });
      setShowDecisionPanel(false);
      setCustomInjuryTime('');
      if (!timer.isRunning) handlePause();
      toast(`+${minutes} min added`);
    } catch { toast('Failed', 'error'); }
  };

  const handleGoal = async (data: any) => {
    try { const res = await apiCall(`/api/matches/${id}/goals`, data); setScore(res.scoreA, res.scoreB); setEvents(e => [...e, { ...res.goal, eventType: 'goal' }]); toast('⚽ Goal recorded!'); }
    catch { toast('Failed to record goal', 'error'); }
  };
  const handleCard = async (data: any) => {
    try { const res = await apiCall(`/api/matches/${id}/cards`, data); setEvents(e => [...e, { ...res, eventType: 'card' }]); toast(`${data.cardType === 'yellow' ? '🟨' : '🟥'} Card issued`); }
    catch { toast('Failed', 'error'); }
  };
  const handleSub = async (data: any) => {
    try { const res = await apiCall(`/api/matches/${id}/substitutions`, data); setEvents(e => [...e, { ...res, eventType: 'sub' }]); toast('🔄 Sub recorded'); }
    catch { toast('Failed', 'error'); }
  };

  const handlePause = async () => {
    try {
      const running = timer.isRunning;
      const now = Date.now();
      if (running) {
        setTimer({ isRunning: false, pausedAtUnix: now });
      } else {
        const extra = timer.pausedAtUnix ? now - timer.pausedAtUnix : 0;
        setTimer({ isRunning: true, pausedAtUnix: null, totalPausedMs: timer.totalPausedMs + extra, startedAtUnix: timer.startedAtUnix || now });
      }
      const res = await fetch(`/api/matches/${id}/timer/${running ? 'pause' : 'start'}`, { method: 'POST' });
      const t = await res.json();
      setTimer({ isRunning: t.isRunning, pausedAtUnix: t.pausedAtUnix, totalPausedMs: t.totalPausedMs, startedAtUnix: t.startedAtUnix });
    } catch { toast('Timer error', 'error'); }
  };

  const handleHalftime = async () => {
    try { await fetch(`/api/matches/${id}/timer/halftime`, { method: 'POST' }); router.push(`/matches/${id}/halftime`); }
    catch { toast('Failed', 'error'); }
  };

  const handleUndo = async () => {
    try {
      const res = await fetch(`/api/matches/${id}/undo`, { method: 'POST' });
      const data = await res.json();
      if (data.scoreA !== undefined) setScore(data.scoreA, data.scoreB);
      setEvents(evs => { const last = [...evs].reverse().find(e => !e.isUndone); if (!last) return evs; return evs.map(e => e.id === last.id ? { ...e, isUndone: true } : e); });
      toast('Event undone');
      setShowUndo(false);
    } catch { toast('Undo failed', 'error'); }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    try {
      const type = editingEvent.eventType === 'goal' ? 'goal' : editingEvent.cardType ? editingEvent.cardType : 'sub';
      const payload = {
        ...editingEvent,
        eventType: type,
        minute: parseInt(editState.minute) || editingEvent.minute,
        playerName: editState.playerName,
        playerIn: editState.playerIn,
        playerOut: editState.playerOut,
      };
      await fetch(`/api/matches/${id}/events/${editingEvent.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setEvents(evs => evs.map(e => e.id === editingEvent.id ? { ...e, ...payload } : e));
      setEditingEvent(null);
      toast('Event updated');
    } catch { toast('Failed to update event', 'error'); }
  };

  useEffect(() => {
    if (editingEvent) {
      setEditState({
        minute: String(editingEvent.minute),
        playerName: editingEvent.playerName || '',
        playerIn: editingEvent.playerIn || '',
        playerOut: editingEvent.playerOut || '',
      });
    }
  }, [editingEvent]);

  if (!match) return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#08080E]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-[1.5px] border-white/10 border-t-white/50 animate-spin" />
        <p className="text-[11px] tracking-[0.2em] text-white/30 uppercase">Loading Match</p>
      </div>
    </div>
  );

  const active = events.filter(e => !e.isUndone);
  const yA = active.filter(e => e.cardType === 'yellow' && e.team === 'team_a').length;
  const yB = active.filter(e => e.cardType === 'yellow' && e.team === 'team_b').length;
  const rA = active.filter(e => e.cardType === 'red'    && e.team === 'team_a').length;
  const rB = active.filter(e => e.cardType === 'red'    && e.team === 'team_b').length;
  const injMins = timer.injuryTimeMs > 0 ? Math.ceil(timer.injuryTimeMs / 60000) : 0;
  const halfLabel = timer.currentHalf === 1 ? '1st Half' : '2nd Half';

  return (
    <div className="fixed inset-0 flex flex-col bg-[#08080E] text-white overflow-hidden select-none">

      {/* ══════════ HEADER ══════════ */}
      <header className="flex-none flex items-center justify-between px-5 pt-5 pb-3">

        <button onClick={() => router.push(`/matches/${id}`)}
          className="w-9 h-9 rounded-[11px] bg-white/[0.06] hover:bg-white/10 flex items-center justify-center transition-colors">
          <ChevronLeft size={18} className="text-white/50" />
        </button>

        {/* Center: Half label + duration + live dot */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] tracking-[0.18em] uppercase text-white/30 font-semibold">{halfLabel}</p>
            <span className="text-white/15 text-[10px]">·</span>
            <p className="text-[10px] tracking-[0.18em] uppercase text-white/30 font-semibold">{match.matchDuration} MIN</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-[0.12em] uppercase transition-colors ${
            timer.isRunning
              ? 'bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-400'
              : 'bg-amber-500/[0.08] border-amber-500/20 text-amber-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${timer.isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {timer.isRunning ? 'Live' : 'Paused'}
          </div>
        </div>

        <button onClick={() => setShowTimeline(true)}
          className="relative w-9 h-9 rounded-[11px] bg-white/[0.06] hover:bg-white/10 flex items-center justify-center transition-colors">
          <AlignRight size={16} className="text-white/50" />
          {active.length > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-indigo-500 text-[9px] font-bold flex items-center justify-center leading-none">
              {active.length}
            </span>
          )}
        </button>
      </header>

      {/* ══════════ SCOREBOARD ══════════ */}
      <div className="flex-none px-5 pt-1 pb-4">
        <div className="flex items-center justify-between">

          {/* Team A */}
          <div className="flex-1 flex flex-col items-start gap-1.5 min-w-0 pr-3">
            <div className="w-6 h-[3px] rounded-full" style={{ backgroundColor: match.teamAColor }} />
            <p className="text-[16px] font-black truncate leading-tight" style={{ color: match.teamAColor }}>
              {match.teamA}
            </p>
            {(yA > 0 || rA > 0) && (
              <div className="flex items-center gap-1">
                {yA > 0 && <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/15"><div className="w-[5px] h-[7px] bg-yellow-400 rounded-[1px]" /><span className="text-[10px] font-bold text-yellow-400">{yA}</span></div>}
                {rA > 0 && <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/15"><div className="w-[5px] h-[7px] bg-red-500 rounded-[1px]" /><span className="text-[10px] font-bold text-red-400">{rA}</span></div>}
              </div>
            )}
          </div>

          {/* Score pill */}
          <div className="flex items-center gap-2.5 px-6 py-3 rounded-[18px]" style={{ background: 'rgba(255,255,255,0.032)', border: '1px solid rgba(255,255,255,0.055)' }}>
            <motion.span key={`a${scoreA}`} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[52px] font-black tabular-nums leading-none">
              {scoreA}
            </motion.span>
            <span className="text-[22px] font-extralight text-white/10 pb-1">–</span>
            <motion.span key={`b${scoreB}`} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[52px] font-black tabular-nums leading-none">
              {scoreB}
            </motion.span>
          </div>

          {/* Team B */}
          <div className="flex-1 flex flex-col items-end gap-1.5 min-w-0 pl-3">
            <div className="w-6 h-[3px] rounded-full" style={{ backgroundColor: match.teamBColor }} />
            <p className="text-[16px] font-black truncate leading-tight text-right" style={{ color: match.teamBColor }}>
              {match.teamB}
            </p>
            {(yB > 0 || rB > 0) && (
              <div className="flex items-center gap-1">
                {yB > 0 && <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/15"><div className="w-[5px] h-[7px] bg-yellow-400 rounded-[1px]" /><span className="text-[10px] font-bold text-yellow-400">{yB}</span></div>}
                {rB > 0 && <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/15"><div className="w-[5px] h-[7px] bg-red-500 rounded-[1px]" /><span className="text-[10px] font-bold text-red-400">{rB}</span></div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════ STOPWATCH — CENTERED ══════════ */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative">
        {/* Subtle ambient glow behind clock */}
        <div className="absolute w-64 h-64 rounded-full pointer-events-none"
          style={{ background: timer.isRunning ? 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)' }} />
        <StopwatchModel matchDuration={match?.matchDuration} size={260} />

        {/* Injury time added badge — shown only when injury time is running */}
        {injMins > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-[11px] font-bold text-orange-400 tracking-wide">+{injMins} min injury time</span>
          </motion.div>
        )}
      </div>

      {/* ══════════ INJURY TIME STRIP — only when time exceeded ══════════ */}
      <AnimatePresence>
        {timeExceeded && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="flex-none px-5 pb-2"
          >
            {/* Alert label */}
            <div className="flex items-center gap-2 mb-2.5">
              <AlertTriangle size={12} className="text-orange-400" />
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-orange-400/80">
                {timer.currentHalf === 1 ? '45:00' : '90:00'} exceeded — add injury time
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 5, 10].map(m => (
                <button key={m} onClick={() => handleAddInjuryTime(m)}
                  className="flex-1 h-9 rounded-[10px] text-[12px] font-bold bg-orange-500/[0.08] hover:bg-orange-500/[0.16] border border-orange-500/[0.18] text-orange-400 hover:text-orange-300 transition-all active:scale-95">
                  +{m}
                </button>
              ))}
              <input
                type="number"
                placeholder="…"
                value={customInjuryTime}
                min={1}
                max={99}
                maxLength={2}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setCustomInjuryTime(val);
                }}
                className="w-12 h-9 rounded-[10px] bg-white/[0.04] border border-white/[0.07] text-[12px] text-center text-white/70 placeholder:text-white/20 focus:outline-none focus:border-orange-500/40"
              />
              <button onClick={() => handleAddInjuryTime(parseInt(customInjuryTime) || 0)}
                className="w-9 h-9 flex-shrink-0 rounded-[10px] bg-orange-500/15 border border-orange-500/25 text-orange-400 text-[13px] font-bold hover:bg-orange-500/25 transition-all active:scale-95">
                +
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ TIMER CONTROLS ══════════ */}
      <div className="flex-none px-5 pb-3 pt-1">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={handlePause}
            className={`h-[50px] rounded-[14px] flex items-center justify-center gap-2 text-[13px] font-bold tracking-wide transition-all active:scale-[0.97] ${
              timer.isRunning
                ? 'bg-amber-500/[0.10] border border-amber-500/[0.22] text-amber-400'
                : 'bg-indigo-500/[0.10] border border-indigo-500/[0.22] text-indigo-400'
            }`}>
            {timer.isRunning
              ? <><Pause size={15} strokeWidth={2.5} /> Pause</>
              : <><Play  size={15} strokeWidth={2.5} /> {timer.startedAtUnix ? 'Resume' : 'Start Match'}</>}
          </button>

          {timer.currentHalf === 1 ? (
            <button onClick={() => setShowHalftimeModal(true)}
              className="h-[50px] rounded-[14px] flex items-center justify-center gap-2 text-[13px] font-bold tracking-wide bg-rose-500/[0.10] border border-rose-500/[0.22] text-rose-400 transition-all active:scale-[0.97]">
              <Timer size={15} strokeWidth={2.5} /> End Half
            </button>
          ) : (
            <button onClick={() => setShowEndModal(true)}
              className="h-[50px] rounded-[14px] flex items-center justify-center gap-2 text-[13px] font-bold tracking-wide bg-rose-500/[0.10] border border-rose-500/[0.22] text-rose-400 transition-all active:scale-[0.97]">
              <CheckCircle size={15} strokeWidth={2.5} /> Full Time
            </button>
          )}
        </div>
      </div>

      {/* ══════════ BOTTOM ACTION BAR ══════════ */}
      <div className="flex-none border-t border-white/[0.045] bg-[#0A0A11] pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">

          <button onClick={triggerGoal}
            className="group flex flex-col items-center justify-center gap-[7px] py-4 hover:bg-white/[0.025] active:bg-white/[0.05] transition-colors">
            <div className="w-[42px] h-[42px] rounded-[13px] bg-white/[0.05] group-hover:bg-white/[0.09] flex items-center justify-center transition-all group-active:scale-90">
              <span className="text-[20px] leading-none">⚽</span>
            </div>
            <span className="text-[9px] font-bold tracking-[0.14em] text-white/25 group-hover:text-white/45 uppercase transition-colors">Goal</span>
          </button>

          <button onClick={triggerYellow}
            className="group flex flex-col items-center justify-center gap-[7px] py-4 hover:bg-yellow-500/[0.04] active:bg-yellow-500/[0.08] transition-colors">
            <div className="w-[42px] h-[42px] rounded-[13px] bg-yellow-400/[0.07] group-hover:bg-yellow-400/[0.14] flex items-center justify-center transition-all group-active:scale-90">
              <div style={{ width: 13, height: 17, backgroundColor: '#F1C40F', borderRadius: 3, boxShadow: '0 0 10px rgba(241,196,15,0.35)' }} />
            </div>
            <span className="text-[9px] font-bold tracking-[0.14em] text-yellow-700/60 group-hover:text-yellow-400/80 uppercase transition-colors">Yellow</span>
          </button>

          <button onClick={triggerRed}
            className="group flex flex-col items-center justify-center gap-[7px] py-4 hover:bg-red-500/[0.04] active:bg-red-500/[0.08] transition-colors">
            <div className="w-[42px] h-[42px] rounded-[13px] bg-red-500/[0.07] group-hover:bg-red-500/[0.14] flex items-center justify-center transition-all group-active:scale-90">
              <div style={{ width: 13, height: 17, backgroundColor: '#E74C3C', borderRadius: 3, boxShadow: '0 0 10px rgba(231,76,60,0.35)' }} />
            </div>
            <span className="text-[9px] font-bold tracking-[0.14em] text-red-700/60 group-hover:text-red-400/80 uppercase transition-colors">Red</span>
          </button>

          <button onClick={triggerSub}
            className="group flex flex-col items-center justify-center gap-[7px] py-4 hover:bg-blue-500/[0.04] active:bg-blue-500/[0.08] transition-colors">
            <div className="w-[42px] h-[42px] rounded-[13px] bg-blue-500/[0.07] group-hover:bg-blue-500/[0.14] flex items-center justify-center transition-all group-active:scale-90">
              <ArrowLeftRight size={16} className="text-blue-400/70 group-hover:text-blue-400" strokeWidth={2} />
            </div>
            <span className="text-[9px] font-bold tracking-[0.14em] text-blue-700/60 group-hover:text-blue-400/80 uppercase transition-colors">Sub</span>
          </button>

          <button onClick={() => setShowUndo(true)}
            className="group flex flex-col items-center justify-center gap-[7px] py-4 hover:bg-white/[0.025] active:bg-white/[0.05] transition-colors">
            <div className="w-[42px] h-[42px] rounded-[13px] bg-white/[0.04] group-hover:bg-white/[0.08] flex items-center justify-center transition-all group-active:scale-90">
              <RotateCcw size={15} className="text-white/25 group-hover:text-white/45" strokeWidth={2} />
            </div>
            <span className="text-[9px] font-bold tracking-[0.14em] text-white/18 group-hover:text-white/35 uppercase transition-colors">Undo</span>
          </button>
        </div>
      </div>

      {/* ══════════ MODALS ══════════ */}
      <GoalModal open={showGoal} onClose={() => setShowGoal(false)} teamA={match.teamA} teamB={match.teamB} players={players} currentMinute={currentMinute} elapsedMs={pendingElapsedMs} onSave={handleGoal} />
      <CardModal open={showYellow} onClose={() => setShowYellow(false)} cardType="yellow" teamA={match.teamA} teamB={match.teamB} players={players} currentMinute={currentMinute} elapsedMs={pendingElapsedMs} onSave={handleCard} />
      <CardModal open={showRed} onClose={() => setShowRed(false)} cardType="red" teamA={match.teamA} teamB={match.teamB} players={players} currentMinute={currentMinute} elapsedMs={pendingElapsedMs} onSave={handleCard} />
      <SubModal open={showSub} onClose={() => setShowSub(false)} teamA={match.teamA} teamB={match.teamB} players={players} currentMinute={currentMinute} elapsedMs={pendingElapsedMs} onSave={handleSub} />

      <Modal open={showUndo} onClose={() => setShowUndo(false)} title="Undo Last Event">
        <p className="text-muted text-sm mb-5">This will mark the most recent event as undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setShowUndo(false)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleUndo}>Undo</Button>
        </div>
      </Modal>

      <Modal open={showHalftimeModal} onClose={() => setShowHalftimeModal(false)} title="End First Half?">
        <p className="text-muted text-sm mb-5 text-center">End the first half and go to the break?</p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setShowHalftimeModal(false)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleHalftime}>End Half</Button>
        </div>
      </Modal>

      <Modal open={showEndModal} onClose={() => setShowEndModal(false)} title="Confirm Full Time?">
        <p className="text-muted text-sm mb-5 text-center">Confirm match completion?</p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setShowEndModal(false)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={() => router.push(`/matches/${id}/finish`)}>Full Time</Button>
        </div>
      </Modal>

      <Modal open={showDecisionPanel} onClose={() => setShowDecisionPanel(false)} title={`${timer.currentHalf === 1 ? '45:00' : '90:00'} — Time Reached`}>
        <p className="text-muted text-sm mb-5 text-center">Regulation time completed. What is your decision?</p>
        <Button className="w-full mb-5" variant="danger" size="lg" onClick={() => { setShowDecisionPanel(false); if (timer.currentHalf === 1) setShowHalftimeModal(true); else setShowEndModal(true); }}>
          {timer.currentHalf === 1 ? 'Blow Whistle — End Half' : 'Blow Whistle — Full Time'}
        </Button>
        <p className="text-[10px] text-muted/50 text-center mb-3 tracking-widest uppercase">Or add injury time</p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[1, 2, 3, 5, 10, 15].map(m => (
            <Button key={m} variant="secondary" onClick={() => handleAddInjuryTime(m)} className="bg-white/5 border-white/10 text-sm">+{m} min</Button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="number" placeholder="Custom minutes" className="flex-1 bg-foreground/5 border border-border/40 rounded-lg px-4 text-sm text-foreground py-2 focus:outline-none focus:border-orange-500/40" value={customInjuryTime} onChange={e => setCustomInjuryTime(e.target.value)} />
          <Button variant="secondary" onClick={() => handleAddInjuryTime(parseInt(customInjuryTime) || 0)} className="bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">Add</Button>
        </div>
      </Modal>

      <Modal open={!!editingEvent} onClose={() => setEditingEvent(null)} title="Edit Event">
        {editingEvent && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider font-semibold">Minute</label>
              <input type="number" value={editState.minute} onChange={e => setEditState({ ...editState, minute: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
            </div>
            {editingEvent.eventType === 'sub' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider font-semibold">Player Out</label>
                  <input value={editState.playerOut} onChange={e => setEditState({ ...editState, playerOut: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider font-semibold">Player In</label>
                  <input value={editState.playerIn} onChange={e => setEditState({ ...editState, playerIn: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider font-semibold">Player Name</label>
                <input value={editState.playerName} onChange={e => setEditState({ ...editState, playerName: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors" />
              </div>
            )}
            <div className="flex gap-3 mt-6 pt-2 border-t border-white/[0.05]">
              <Button variant="ghost" className="flex-1 bg-white/[0.03] hover:bg-white/[0.08]" onClick={() => setEditingEvent(null)}>Cancel</Button>
              <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white" onClick={handleUpdateEvent}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ══════════ TIMELINE DRAWER ══════════ */}
      <AnimatePresence>
        {showTimeline && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowTimeline(false)} className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed right-0 top-0 bottom-0 w-[82vw] max-w-[340px] z-50 flex flex-col"
              style={{ background: '#0E0E18', borderLeft: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.05]">
                <div>
                  <p className="text-[13px] font-bold">Match Timeline</p>
                  <p className="text-[10px] text-white/25 mt-0.5 tracking-wide">{active.length} events recorded</p>
                </div>
                <button onClick={() => setShowTimeline(false)} className="w-8 h-8 rounded-[9px] bg-white/[0.05] hover:bg-white/[0.09] flex items-center justify-center text-white/40 text-base leading-none transition-colors">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                {[...events].reverse().map(e => {
                  const type = e.eventType === 'goal' ? 'goal' : e.cardType ? e.cardType : 'sub';
                  let name = e.eventType === 'sub' ? `${e.playerOut} → ${e.playerIn}` : e.playerName;
                  if (e.jerseyNo) name += ` #${e.jerseyNo}`;
                  const extra = e.eventType === 'goal' && e.goalType !== 'normal' ? ` (${e.goalType})` : '';
                  return <EventItem key={e.id} minute={e.minute} elapsedMs={e.elapsedMs} type={type as any} playerName={`${name}${extra}`} teamSide={e.team === 'team_a' ? 'home' : 'away'} isUndone={e.isUndone} onClick={() => !e.isUndone && setEditingEvent(e)} />;
                })}
                {events.length === 0 && (
                  <div className="flex items-center justify-center h-40 text-white/20 text-sm">No events yet</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
