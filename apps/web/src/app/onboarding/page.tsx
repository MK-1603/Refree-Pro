'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ChevronRight, ChevronLeft,
  MapPin, Calendar, Users, Zap,
  Flag, CreditCard, ArrowRightLeft, Clock,
  Pause, Play, Trophy, FileText, Share2,
  CheckCircle, BarChart3,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   ANIMATED DEMO PANELS
   ═══════════════════════════════════════════════════════════════ */

function DemoSchedule() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % 5), 1200);
    return () => clearInterval(t);
  }, []);
  const fields = [
    { icon: MapPin,    label: 'Venue',    value: 'City Sports Arena' },
    { icon: Calendar,  label: 'Kickoff',  value: '22 Jun 2026  ·  15:30' },
    { icon: Users,     label: 'Match',    value: 'FC Alpha  vs  FC Beta' },
    { icon: Zap,       label: 'Format',   value: '11 v 11  ·  45 min halves' },
  ];
  return (
    <div className="w-full rounded-2xl border border-border/50 bg-card/50 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2 bg-muted/20">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">New Match — Step 1 of 4</span>
      </div>
      <div className="p-4 space-y-2">
        {fields.map(({ icon: Icon, label, value }, i) => (
          <motion.div key={label}
            animate={{ opacity: phase > i ? 1 : 0.4, x: phase > i ? 0 : -6 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/40 bg-background/50">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${phase > i ? 'bg-blue-500/10 border border-blue-500/20 text-blue-500' : 'bg-muted text-muted-foreground'}`}>
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
              <p className={`text-[11px] font-semibold truncate transition-colors duration-300 ${phase > i ? 'text-foreground' : 'text-muted-foreground/50'}`}>{value}</p>
            </div>
            {phase > i && <CheckCircle size={14} className="text-blue-500 shrink-0" />}
          </motion.div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <motion.div animate={{ opacity: phase >= 4 ? 1 : 0.4 }}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-center text-[11px] font-bold text-white tracking-wide transition-opacity shadow-md shadow-blue-500/20">
          Launch Match Engine →
        </motion.div>
      </div>
    </div>
  );
}

function DemoLive() {
  const [secs, setSecs] = useState(1462);
  const [events, setEvents] = useState([
    { id: 1, type: 'goal', label: 'M. Torres — Goal', team: 'A', time: "24'" },
  ]);
  useEffect(() => { const t = setInterval(() => setSecs(s => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const t = setInterval(() => {
      setEvents(prev => [
        { id: Date.now(), type: prev.length % 2 === 0 ? 'goal' : 'card', label: prev.length % 2 === 0 ? 'K. Diallo — Goal' : 'R. Silva — Yellow', team: 'B', time: `${Math.floor(secs / 60)}'` },
        ...prev.slice(0, 2),
      ]);
    }, 3500);
    return () => clearInterval(t);
  }, [secs]);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <div className="w-full rounded-2xl border border-border/50 bg-card/50 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-[10px] font-black tracking-widest text-red-500">LIVE</span></div>
        <span className="text-[10px] text-muted-foreground font-bold tracking-wider">1ST HALF</span>
      </div>
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="text-center"><p className="text-[11px] text-muted-foreground font-medium mb-1">FC Alpha</p><p className="text-2xl font-black text-blue-600 dark:text-blue-400">2</p></div>
        <div className="text-center"><p className="font-mono text-3xl font-black text-foreground tabular-nums tracking-tight">{mm}:{ss}</p><p className="text-[9px] text-muted-foreground mt-1 tracking-widest font-bold">ELAPSED</p></div>
        <div className="text-center"><p className="text-[11px] text-muted-foreground font-medium mb-1">FC Beta</p><p className="text-2xl font-black text-foreground/40">1</p></div>
      </div>
      <div className="px-3 pb-3 grid grid-cols-3 gap-2">
        {[{ icon: Flag, label: 'Goal', cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
          { icon: CreditCard, label: 'Card', cls: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
          { icon: ArrowRightLeft, label: 'Sub', cls: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400' }].map(({ icon: Icon, label, cls }) => (
          <div key={label} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border ${cls} shadow-sm`}>
            <Icon size={16} /><span className="text-[10px] font-bold">{label}</span>
          </div>
        ))}
      </div>
      <div className="px-3 pb-4 space-y-2">
        <AnimatePresence>
          {events.slice(0, 2).map(ev => (
            <motion.div key={ev.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-background/50 border border-border/40 shadow-sm">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${ev.type === 'goal' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                {ev.type === 'goal' ? <Flag size={12} className="text-emerald-600 dark:text-emerald-400" /> : <CreditCard size={12} className="text-amber-600 dark:text-amber-400" />}
              </div>
              <span className="text-[11px] text-foreground font-medium flex-1 truncate">{ev.label}</span>
              <span className="text-[11px] text-muted-foreground font-mono font-medium">{ev.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DemoFlow() {
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep(s => (s + 1) % 3), 1800); return () => clearInterval(t); }, []);
  const stages = [
    { label: 'First Half Active', sub: '45:00 playing', color: 'text-blue-600 dark:text-blue-400', badge: 'LIVE', badgeColor: 'bg-red-500/20 text-red-600 dark:text-red-400' },
    { label: 'Half Time Break', sub: 'Clock paused', color: 'text-amber-600 dark:text-amber-400', badge: 'BREAK', badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400' },
    { label: 'Second Half Active', sub: '90:00 playing', color: 'text-emerald-600 dark:text-emerald-400', badge: 'LIVE', badgeColor: 'bg-red-500/20 text-red-600 dark:text-red-400' },
  ];
  const actions = ['End First Half', 'Start Second Half', 'Full Time'];
  return (
    <div className="w-full rounded-2xl border border-border/50 bg-card/50 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-muted/20">
        <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Match Flow Control</span>
        <motion.span key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${stages[step].badgeColor}`}>
          {stages[step].badge}
        </motion.span>
      </div>
      <div className="p-4 space-y-3">
        <motion.div key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-center pb-2">
          <p className={`text-lg font-black ${stages[step].color}`}>{stages[step].label}</p>
          <p className="text-[11px] text-muted-foreground font-medium mt-1">{stages[step].sub}</p>
        </motion.div>
        {actions.map((action, i) => (
          <motion.div key={action}
            animate={{ opacity: i === step ? 1 : i < step ? 0.6 : 0.3, scale: i === step ? 1 : 0.98 }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-semibold transition-all shadow-sm
              ${i === step ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'border-border/50 bg-background/50 text-foreground/70'}`}>
            <span>{action}</span>
            {i < step && <CheckCircle size={14} className="text-emerald-500" />}
            {i === step && <Play size={14} />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DemoReports() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    setPct(0);
    const t = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(t); return 100; } return p + 4; }), 55);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (pct === 100) { const t = setTimeout(() => setPct(0), 1800); return () => clearTimeout(t); } }, [pct]);
  const sections = ['Match Summary', 'Goal Timeline', 'Card Incidents', 'Player Statistics', 'Substitutions Log'];
  return (
    <div className="w-full rounded-2xl border border-border/50 bg-card/50 overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2 bg-muted/20">
        <FileText size={12} className="text-blue-500" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">PDF Report Generator</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          {sections.map((s, i) => {
            const done = pct > (i + 1) * 18;
            return (
              <div key={s} className="flex items-center gap-3">
                <motion.div animate={{ backgroundColor: done ? 'var(--blue-500, #3b82f6)' : 'var(--muted, rgba(150,150,150,0.1))' }}
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 border border-border/40">
                  {done && <CheckCircle size={10} className="text-white" />}
                </motion.div>
                <span className={`text-[11px] font-medium transition-colors ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
              </div>
            );
          })}
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground font-bold mb-1.5 uppercase tracking-wide"><span>Compiling report</span><span>{pct}%</span></div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div animate={{ width: `${pct}%` }} transition={{ ease: 'linear' }} className="h-full bg-blue-500 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[{ icon: FileText, label: 'PDF Report', active: pct === 100 }, { icon: Share2, label: 'Match Poster', active: pct === 100 }].map(({ icon: Icon, label, active }) => (
            <div key={label} className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-[11px] font-semibold transition-all duration-300 shadow-sm
              ${active ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'border-border/50 bg-background/50 text-muted-foreground'}`}>
              <Icon size={12} />{label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GUIDE STEPS DATA
   ═══════════════════════════════════════════════════════════════ */

const GUIDE_STEPS = [
  {
    num: '01',
    title: 'Schedule a Match',
    body: 'Set venue, date, kickoff time, and squad format. The system detects slot conflicts automatically before confirming.',
    features: [
      { icon: MapPin,    text: 'Venue with automatic conflict detection' },
      { icon: Users,     text: 'Squad format — 5v5 to 11v11' },
      { icon: Trophy,    text: 'Optional tournament assignment' },
    ],
    Demo: DemoSchedule,
  },
  {
    num: '02',
    title: 'Run the Live Engine',
    body: 'Log goals, cards, and substitutions in real time. Every event is cloud-synced instantly. Mistakes can be undone with a single tap.',
    features: [
      { icon: Flag,            text: 'Goals with player name and type' },
      { icon: CreditCard,      text: 'Yellow / Red cards with full audit trail' },
      { icon: ArrowRightLeft,  text: 'Substitutions — player in, player out' },
    ],
    Demo: DemoLive,
  },
  {
    num: '03',
    title: 'Control the Match Flow',
    body: 'End the first half, take the break, then restart the second half with a fresh timer. Extra time is supported as a third period.',
    features: [
      { icon: Pause,  text: 'Half-time with paused clock display' },
      { icon: Play,   text: 'Second half restarts the timer cleanly' },
      { icon: Clock,  text: 'Extra time as a separate third period' },
    ],
    Demo: DemoFlow,
  },
  {
    num: '04',
    title: 'Reports & Standings',
    body: 'Generate a full PDF match report or shareable poster instantly. Tournament standings update automatically after every completed match.',
    features: [
      { icon: FileText,    text: 'PDF report with complete event breakdown' },
      { icon: Share2,      text: 'Match poster formatted for social media' },
      { icon: BarChart3,   text: 'Standings auto-updated, recalculate any time' },
    ],
    Demo: DemoReports,
  },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

type Phase = 'welcome' | 'guide';

export default function OnboardingPage() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [guideStep, setGuideStep] = useState(0);
  const [fromSettings, setFromSettings] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (window.location.search.includes('from=settings')) {
      setFromSettings(true);
    }
  }, []);

  const handleComplete = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'onboarded', value: 'true' }),
      });
    } catch {}
    router.push('/dashboard');
  };

  /* ── WELCOME PHASE ─────────────────────────────────────────── */
  if (phase === 'welcome') {
    return (
      <div className="h-[100dvh] bg-background flex flex-col items-center relative overflow-hidden pb-8">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute bottom-0 right-[-100px] w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px]" />
        </div>

        {/* Top bar */}
        <div className="w-full flex justify-between px-6 py-4 bg-background/80 backdrop-blur-md mb-auto relative z-20">
          {fromSettings ? (
            <button onClick={() => router.back()} className="flex items-center gap-1.5 text-blue-500 hover:text-blue-400 transition-colors text-sm font-medium">
              <ChevronLeft size={20} strokeWidth={2.5} className="-ml-1" />
              Settings
            </button>
          ) : <div />}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">Professional Edition</span>
          </div>
        </div>

        {/* Hero */}
        <motion.div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto px-6 py-6 my-auto w-full"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>

          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-24 h-24 rounded-[1.5rem] overflow-hidden mb-8 shadow-2xl border border-border/50">
            <Image unoptimized src="/icon-192.png" alt="Referee Pro" width={192} height={192} className="w-full h-full object-cover" priority />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-muted-foreground mb-3">Welcome to</p>
            <h1 className="text-[42px] font-black tracking-tight text-foreground leading-none mb-4" style={{ fontFamily: 'var(--font-bebas), Oswald, sans-serif' }}>
              REFEREE PRO
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
              The professional platform for match officials — from kickoff configuration to final whistle reports.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mt-8">
            {['Real-time Engine', 'Cloud Sync', 'PDF Reports', 'Tournaments'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full border border-border/60 bg-foreground/5 text-[10px] font-semibold text-muted-foreground tracking-wide">
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* CTAs */}
        <motion.div className="relative z-10 w-full max-w-sm px-6 mt-auto"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <div className="flex gap-3">
            <button
              onClick={handleComplete}
              className="flex-1 py-4 rounded-2xl bg-foreground/5 text-foreground hover:bg-foreground/10 text-sm font-bold tracking-wide transition-all border border-border/50">
              Skip
            </button>
            <button
              onClick={() => setPhase('guide')}
              className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 text-white text-sm font-black tracking-wide shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-[0.98] transition-all">
              Get Started
              <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── GUIDE PHASE ───────────────────────────────────────────── */
  const current = GUIDE_STEPS[guideStep];
  const isLast = guideStep === GUIDE_STEPS.length - 1;

  return (
    <div className="h-[100dvh] bg-background flex flex-col relative overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-3">
          {fromSettings && (
            <button onClick={() => router.back()} className="flex items-center text-blue-500 hover:text-blue-400 -ml-1 transition-colors">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
          )}
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-border/50 shadow-sm">
            <Image unoptimized src="/icon-192.png" alt="Referee Pro" width={192} height={192} className="w-full h-full object-cover" priority />
          </div>
          <span className="text-xs font-black tracking-[0.2em] uppercase text-foreground/80">Referee Pro</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-5 mb-5 mt-4 shrink-0">
        <div className="flex gap-1">
          {GUIDE_STEPS.map((_, i) => (
            <button key={i} onClick={() => setGuideStep(i)} className="flex-1 h-[4px] rounded-full overflow-hidden bg-muted">
              <motion.div animate={{ scaleX: i <= guideStep ? 1 : 0 }} initial={false}
                style={{ originX: 0 }} transition={{ duration: 0.4 }}
                className="h-full bg-blue-500 rounded-full" />
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-2.5">
          <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Step {guideStep + 1} of {GUIDE_STEPS.length}</span>
          <span className="text-[10px] text-muted-foreground font-medium">{Math.round(((guideStep + 1) / GUIDE_STEPS.length) * 100)}% complete</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-4 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div key={guideStep}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="space-y-6">

            {/* Step number + headline */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-0.5 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-sm">
                <span className="text-sm font-black text-blue-600 dark:text-blue-400 tracking-wider">{current.num}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-black text-foreground leading-tight tracking-tight">{current.title}</h1>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{current.body}</p>
              </div>
            </div>

            {/* Interactive preview */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Live Preview</span>
              </div>
              <current.Demo />
            </div>

            {/* Feature list */}
            <div className="space-y-3 pt-2">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">What you can do</p>
              {current.features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 bg-card/30 p-3 rounded-xl border border-border/40">
                  <div className="w-8 h-8 rounded-xl bg-background border border-border/50 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-[13px] font-medium text-foreground/80 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 px-5 pb-8 pt-4 border-t border-border/40 shrink-0 bg-background">
        <div className="flex gap-3">
          <button
            onClick={handleComplete}
            className="flex-1 py-4 rounded-2xl bg-foreground/5 text-foreground hover:bg-foreground/10 text-sm font-bold tracking-wide transition-all border border-border/50">
            Skip
          </button>
          <button
            onClick={isLast ? handleComplete : () => setGuideStep(s => s + 1)}
            className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 text-white text-sm font-black tracking-wide shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-[0.98] transition-all">
            {isLast ? (
              <><span>Enter Dashboard</span><ArrowRight size={15} /></>
            ) : (
              <><span>Continue</span><ChevronRight size={15} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
