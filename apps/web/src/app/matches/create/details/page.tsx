'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateMatch } from '../CreateMatchContext';
import { CreateMatchStepper } from '../CreateMatchStepper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { MapPin, Calendar, Clock, User, Trophy, ChevronLeft, AlertTriangle, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DetailsPage() {
  const { state, update } = useCreateMatch();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [existingMatches, setExistingMatches] = useState<any[]>([]);
  const router = useRouter();

  const getOffsetDateStr = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  const todayStr       = getOffsetDateStr(0);
  const tomorrowStr    = getOffsetDateStr(1);
  const dayAfterStr    = getOffsetDateStr(2);

  const pageLoadTimeRef = useRef<string | null>(null);
  if (!pageLoadTimeRef.current) {
    pageLoadTimeRef.current = new Date().toTimeString().slice(0, 5);
  }
  const pageLoadTime = pageLoadTimeRef.current;

  useEffect(() => {
    fetch('/api/tournaments').then(r => r.json()).then(d => {
      setTournaments(Array.isArray(d) ? d : []);
      const urlParams = new URLSearchParams(window.location.search);
      const queryTourneyId = urlParams.get('tournamentId');
      if (queryTourneyId) update({ tournamentId: queryTourneyId });
    });

    fetch('/api/matches').then(r => r.json()).then(d => {
      const fetched = Array.isArray(d) ? d : [];
      setExistingMatches(fetched);
      if (!state.matchNumber) {
        const highest = fetched.reduce((max: number, m: any) => Math.max(max, m.matchNumber || 0), 0);
        update({ matchNumber: String(highest + 1) });
      }
    });

    let initialDate = state.matchDate;
    if (!initialDate || initialDate < todayStr) {
      initialDate = todayStr;
      update({ matchDate: todayStr });
    }
    if (!state.matchTime) {
      update({ matchTime: pageLoadTime });
    } else if (initialDate === todayStr && state.matchTime < pageLoadTime) {
      update({ matchTime: pageLoadTime });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setQuickDate = (dateStr: string) => {
    update({ matchDate: dateStr });
    if (dateStr === todayStr && state.matchTime && state.matchTime < pageLoadTime) {
      update({ matchTime: pageLoadTime });
    }
  };

  const isPastDate  = state.matchDate && state.matchDate < todayStr;
  const dateError   = isPastDate ? 'Date cannot be in the past' : undefined;
  const isPastTime  = state.matchDate === todayStr && state.matchTime && state.matchTime < pageLoadTime;
  const timeError   = isPastTime ? 'Time cannot be in the past' : undefined;
  const isConflict  = !!(state.matchDate && state.matchTime && state.venue &&
    existingMatches.some(m => {
      const dbDate  = m.matchDate;
      const dbTime  = m.matchTime?.slice(0, 5);
      const dbVenue = m.venue?.toLowerCase().trim();
      return dbDate === state.matchDate && dbTime === state.matchTime && dbVenue === state.venue?.toLowerCase().trim();
    }));

  const valid = state.venue && state.matchNumber && state.matchDate && state.matchTime &&
    !dateError && !timeError && !isConflict;

  const QUICK_DATES = [
    { label: 'Today',     dateStr: todayStr },
    { label: 'Tomorrow',  dateStr: tomorrowStr },
    { label: 'Day After', dateStr: dayAfterStr },
  ];

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-lg flex flex-col bg-background">

      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-5 pb-4 border-b border-border/10 bg-background/95 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.push('/matches')}
            className="w-9 h-9 rounded-full border border-border/40 bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 active:scale-95 transition-all"
          >
            <ChevronLeft size={18} className="text-foreground" strokeWidth={2.5} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-black text-foreground tracking-tight">New Match</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Step 1 of 4 — Match Details</p>
          </div>
        </div>
        <CreateMatchStepper current={0} />
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-5 space-y-6">

        {/* Tournament */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Tournament (Optional)</p>
          <Select
            value={state.tournamentId || ''}
            onChange={(val) => update({ tournamentId: val })}
            options={[
              { value: '', label: '— No Tournament —' },
              ...tournaments.map(t => ({ value: t.id, label: t.name })),
            ]}
            icon={<Trophy size={14} />}
          />
        </div>

        {/* Venue & Number */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Venue & Match Number</p>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <Input
                icon={<MapPin size={14} />}
                value={state.venue}
                onChange={e => update({ venue: e.target.value })}
                placeholder="Venue name..."
              />
            </div>
            <Input
              icon={<Hash size={14} />}
              type="number"
              value={state.matchNumber}
              onChange={e => update({ matchNumber: e.target.value })}
              placeholder="No."
            />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Match Date</p>
          <Input
            icon={<Calendar size={14} />}
            type="date"
            min={todayStr}
            value={state.matchDate || ''}
            onChange={e => {
              const val = e.target.value;
              update({ matchDate: val });
              if (val === todayStr && state.matchTime && state.matchTime < pageLoadTime) {
                update({ matchTime: pageLoadTime });
              }
            }}
            error={dateError}
          />
          {/* Quick chips */}
          <div className="flex gap-2">
            {QUICK_DATES.map(({ label, dateStr }) => (
              <button
                key={dateStr}
                type="button"
                onClick={() => setQuickDate(dateStr)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 select-none',
                  state.matchDate === dateStr
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent border-border/50 text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Time & Referee */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Kickoff Time & Referee</p>
          <div className="grid grid-cols-2 gap-2.5">
            <Input
              icon={<Clock size={14} />}
              type="time"
              min={state.matchDate === todayStr ? pageLoadTime : undefined}
              value={state.matchTime || ''}
              onChange={e => update({ matchTime: e.target.value })}
              error={timeError}
            />
            <Input
              icon={<User size={14} />}
              value={state.refereeName}
              onChange={e => update({ refereeName: e.target.value })}
              placeholder="Optional..."
            />
          </div>
        </div>

        {/* Conflict warning */}
        {isConflict && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/8 border border-red-500/25">
            <AlertTriangle size={15} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-[12px] text-red-500 font-semibold leading-relaxed">
              This time slot at the selected venue is already booked. Change venue, date, or time.
            </p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 px-4 pt-3 pb-8 border-t border-border/10 bg-background/95 backdrop-blur-xl flex gap-3">
        <Button
          variant="ghost"
          className="w-[30%] h-12 text-muted-foreground hover:bg-foreground/5 font-semibold"
          onClick={() => router.push('/matches')}
        >
          Cancel
        </Button>
        <button
          disabled={!valid}
          onClick={() => valid && router.push('/matches/create/teams')}
          className={cn(
            'flex-1 h-12 rounded-xl text-[15px] font-black tracking-wide transition-all duration-200',
            valid
              ? 'bg-foreground text-background hover:opacity-90 active:scale-[0.98]'
              : 'bg-foreground/10 text-muted-foreground cursor-not-allowed'
          )}
        >
          {valid ? 'Next — Teams →' : 'Fill Required Fields'}
        </button>
      </div>
    </div>
  );
}
