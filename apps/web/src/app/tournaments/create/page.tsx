'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { MapPin, Trophy, Calendar, ChevronLeft, Check, ArrowRight, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tournamentService } from '@/services/tournamentService';

const STEPS = [
  { id: 1, label: 'Info',  desc: 'Name & venue' },
  { id: 2, label: 'Dates', desc: 'Start & end' },
];

function TournamentStepper({ current }: { current: number }) {
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-foreground/10">
            <div className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              i < current  ? 'w-full bg-foreground' :
              i === current ? 'w-1/2 bg-foreground/50' : 'w-0',
            )} />
          </div>
        ))}
      </div>
      <div className="flex justify-around">
        {STEPS.map((step, i) => {
          const done   = i < current;
          const active = i === current;
          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300',
                done   ? 'bg-foreground text-background' :
                active ? 'bg-foreground text-background ring-[3px] ring-foreground/20' :
                         'bg-foreground/8 text-muted-foreground border border-border/40',
              )}>
                {done ? <Check size={11} strokeWidth={3} /> : step.id}
              </div>
              <div className="text-center">
                <p className={cn('text-[9px] font-black uppercase tracking-widest', active ? 'text-foreground' : done ? 'text-foreground/50' : 'text-muted-foreground/60')}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CreateTournamentPage() {
  const [step, setStep]           = useState(0);
  const [name, setName]           = useState('');
  const [venue, setVenue]         = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [loading, setLoading]     = useState(false);
  const { toast } = useToast();
  const router    = useRouter();

  const todayStr = new Date().toISOString().split('T')[0];

  const isPastStart    = startDate && startDate < todayStr;
  const isEndBeforeStart = startDate && endDate && endDate < startDate;

  const step1Valid = name.trim() && venue.trim();
  const step2Valid = startDate && endDate && !isPastStart && !isEndBeforeStart;

  const handleCreate = async () => {
    if (!step2Valid) return;
    setLoading(true);
    try {
      const t = await tournamentService.createTournament({ name: name.trim(), venue: venue.trim(), startDate, endDate });
      toast('Tournament created! 🎉');
      router.push(`/tournaments/${t.id}`);
    } catch {
      toast('Failed to create tournament', 'error');
      setLoading(false);
    }
  };

  /* Quick date helpers */
  const DURATION_PRESETS = [
    { label: '1 Week',   days: 7 },
    { label: '2 Weeks',  days: 14 },
    { label: '1 Month',  days: 30 },
  ];

  const applyDuration = (days: number) => {
    if (!startDate) return;
    const start = new Date(startDate);
    start.setDate(start.getDate() + days);
    setEndDate(start.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-lg flex flex-col bg-background">

      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-5 pb-4 border-b border-border/10 bg-background/95 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => step === 0 ? router.back() : setStep(0)}
            className="w-9 h-9 rounded-full border border-border/40 bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 active:scale-95 transition-all"
          >
            <ChevronLeft size={18} strokeWidth={2.5} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-black text-foreground tracking-tight">New Tournament</h1>
            <p className="text-[11px] text-muted-foreground font-medium">
              Step {step + 1} of 2 — {STEPS[step].desc}
            </p>
          </div>
        </div>
        <TournamentStepper current={step} />
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">

          {/* STEP 1 — Info */}
          {step === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="px-4 py-6 space-y-6"
            >
              {/* Hero */}
              <div className="flex flex-col items-center text-center py-4 gap-3">
                <div className="w-16 h-16 rounded-2xl bg-foreground/8 border border-border/30 flex items-center justify-center shadow-sm">
                  <Trophy size={28} className="text-foreground" />
                </div>
                <div>
                  <h2 className="text-[20px] font-black text-foreground tracking-tight">Create Tournament</h2>
                  <p className="text-[12px] text-muted-foreground mt-0.5 font-medium">Set up your tournament's basic info</p>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Tournament Name *</p>
                  <Input
                    icon={<Trophy size={14} />}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Summer Cup 2026"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Venue / Location *</p>
                  <Input
                    icon={<MapPin size={14} />}
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    placeholder="e.g. National Stadium"
                  />
                </div>

                {/* Quick tips */}
                <div className="rounded-xl bg-foreground/4 border border-border/20 p-4 space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tips</p>
                  {[
                    'You can assign matches to this tournament after creation.',
                    'Standings auto-update after every completed match.',
                    'PDF reports are available for all tournament matches.',
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-1.5 shrink-0" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Dates */}
          {step === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="px-4 py-6 space-y-6"
            >
              {/* Preview pill */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-foreground/5 border border-border/25">
                <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center shrink-0">
                  <Trophy size={18} className="text-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-black text-foreground truncate">{name}</p>
                  <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <MapPin size={10} /> {venue}
                  </p>
                </div>
              </div>

              {/* Date fields */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Start Date *</p>
                  <Input
                    icon={<Calendar size={14} />}
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={e => {
                      setStartDate(e.target.value);
                      if (endDate && e.target.value > endDate) setEndDate(e.target.value);
                    }}
                    error={isPastStart ? 'Cannot be in the past' : undefined}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">End Date *</p>
                  <Input
                    icon={<Calendar size={14} />}
                    type="date"
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    error={isEndBeforeStart ? 'Must be after start date' : undefined}
                  />

                  {/* Duration presets */}
                  {startDate && (
                    <div className="flex gap-2 mt-1">
                      <p className="text-[10px] text-muted-foreground font-bold self-center">Quick:</p>
                      {DURATION_PRESETS.map(({ label, days }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => applyDuration(days)}
                          className={cn(
                            'px-3 py-1 rounded-full text-[10px] font-bold border transition-all',
                            endDate && (() => {
                              const expected = new Date(startDate);
                              expected.setDate(expected.getDate() + days);
                              return expected.toISOString().split('T')[0] === endDate;
                            })()
                              ? 'bg-foreground text-background border-foreground'
                              : 'border-border/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {startDate && endDate && !isPastStart && !isEndBeforeStart && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-foreground/5 border border-border/20 p-4 flex items-center justify-between"
                >
                  <p className="text-[12px] text-muted-foreground font-medium">Tournament duration</p>
                  <p className="text-[13px] font-black text-foreground">
                    {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1} days
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 px-4 pt-3 pb-8 border-t border-border/10 bg-background/95 backdrop-blur-xl flex gap-3">
        <Button
          variant="ghost"
          className="w-[30%] h-12 text-muted-foreground hover:bg-foreground/5 font-semibold"
          onClick={() => step === 0 ? router.back() : setStep(0)}
          disabled={loading}
        >
          {step === 0 ? 'Cancel' : '← Back'}
        </Button>

        {step === 0 ? (
          <button
            disabled={!step1Valid}
            onClick={() => step1Valid && setStep(1)}
            className={cn(
              'flex-1 h-12 rounded-xl text-[15px] font-black tracking-wide transition-all duration-200 flex items-center justify-center gap-2',
              step1Valid
                ? 'bg-foreground text-background hover:opacity-90 active:scale-[0.98]'
                : 'bg-foreground/10 text-muted-foreground cursor-not-allowed',
            )}
          >
            Next — Dates <ArrowRight size={16} />
          </button>
        ) : (
          <button
            disabled={!step2Valid || loading}
            onClick={handleCreate}
            className={cn(
              'flex-1 h-12 rounded-xl text-[15px] font-black tracking-wide transition-all duration-200 flex items-center justify-center gap-2',
              step2Valid && !loading
                ? 'bg-foreground text-background hover:opacity-90 active:scale-[0.98]'
                : 'bg-foreground/10 text-muted-foreground cursor-not-allowed',
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Creating...
              </span>
            ) : (
              <><Rocket size={15} /> Launch Tournament</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
