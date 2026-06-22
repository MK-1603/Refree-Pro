'use client';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useCreateMatch } from '../CreateMatchContext';
import { CreateMatchStepper } from '../CreateMatchStepper';
import { Button } from '@/components/ui/Button';
import { Timer, Coffee, Zap, Plus, Minus, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

function Stepper({ value, min, max, step = 5, onChange }: {
  value: number; min: number; max: number; step?: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-foreground/5 border border-border/30 rounded-full p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-8 h-8 rounded-full flex items-center justify-center text-foreground bg-background border border-border/30 hover:bg-foreground/10 active:scale-90 transition-all"
      >
        <Minus size={13} strokeWidth={2.5} />
      </button>
      <span className="text-[16px] font-black w-10 text-center tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-8 h-8 rounded-full flex items-center justify-center text-foreground bg-background border border-border/30 hover:bg-foreground/10 active:scale-90 transition-all"
      >
        <Plus size={13} strokeWidth={2.5} />
      </button>
      <span className="text-[10px] font-bold text-muted-foreground pr-1">min</span>
    </div>
  );
}

function SettingRow({
  icon, iconBg, title, subtitle, children,
}: {
  icon: React.ReactNode; iconBg: string; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
          {icon}
        </div>
        <div>
          <p className="text-[14px] font-bold text-foreground leading-tight">{title}</p>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function ConfigPage() {
  const { state, update } = useCreateMatch();
  const router = useRouter();

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-lg flex flex-col bg-background">

      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-5 pb-4 border-b border-border/10 bg-background/95 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.push('/matches/create/teams')}
            className="w-9 h-9 rounded-full border border-border/40 bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 active:scale-95 transition-all"
          >
            <ChevronLeft size={18} strokeWidth={2.5} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-black text-foreground tracking-tight">New Match</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Step 3 of 4 — Match Config</p>
          </div>
        </div>
        <CreateMatchStepper current={2} />
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-5 space-y-3">

        {/* Settings card */}
        <div className="rounded-2xl border border-border/30 bg-card/40 overflow-hidden divide-y divide-border/20">
          <div className="px-4 py-3 bg-foreground/3">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Match Settings</p>
          </div>

          <div className="px-4 py-4">
            <SettingRow
              icon={<Timer size={17} className="text-white" />}
              iconBg="bg-blue-600"
              title="Match Duration"
              subtitle="Duration of each half"
            >
              <Stepper
                value={state.matchDuration} min={1} max={120} step={5}
                onChange={v => update({ matchDuration: v })}
              />
            </SettingRow>
          </div>

          <div className="px-4 py-4">
            <SettingRow
              icon={<Coffee size={17} className="text-white" />}
              iconBg="bg-amber-600"
              title="Break Duration"
              subtitle="Half-time break length"
            >
              <Stepper
                value={state.breakDuration} min={1} max={60} step={5}
                onChange={v => update({ breakDuration: v })}
              />
            </SettingRow>
          </div>

          <div className="px-4 py-4 space-y-3">
            <SettingRow
              icon={<Zap size={17} className="text-white" />}
              iconBg="bg-violet-600"
              title="Extra Time"
              subtitle="Enable if draw at full time"
            >
              {/* iOS toggle */}
              <button
                type="button"
                onClick={() => update({ extraTime: state.extraTime === null ? 15 : null })}
                className={cn(
                  'w-12 h-7 rounded-full relative border border-transparent transition-colors duration-300 outline-none cursor-pointer shrink-0',
                  state.extraTime !== null ? 'bg-foreground' : 'bg-foreground/15'
                )}
              >
                <span className={cn(
                  'w-[22px] h-[22px] rounded-full absolute top-[2px] shadow transition-all duration-300 ease-out',
                  state.extraTime !== null ? 'right-[2px] bg-background' : 'left-[2px] bg-foreground/50'
                )} />
              </button>
            </SettingRow>

            <AnimatePresence initial={false}>
              {state.extraTime !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between bg-foreground/5 rounded-xl p-3 border border-border/20">
                    <p className="text-[13px] font-semibold text-foreground/80">Extra time duration:</p>
                    <Stepper
                      value={state.extraTime ?? 15} min={1} max={60} step={5}
                      onChange={v => update({ extraTime: v })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Summary pill */}
        <div className="rounded-xl bg-foreground/5 border border-border/20 px-4 py-3 flex items-center justify-between">
          <p className="text-[12px] text-muted-foreground font-medium">Total match time</p>
          <p className="text-[13px] font-black text-foreground">
            {state.matchDuration * 2 + state.breakDuration + (state.extraTime ? state.extraTime * 2 : 0)} min est.
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 px-4 pt-3 pb-8 border-t border-border/10 bg-background/95 backdrop-blur-xl flex gap-3">
        <Button
          variant="ghost"
          className="w-[30%] h-12 text-muted-foreground hover:bg-foreground/5 font-semibold"
          onClick={() => router.back()}
        >
          ← Back
        </Button>
        <button
          onClick={() => router.push('/matches/create/review')}
          className="flex-1 h-12 rounded-xl bg-foreground text-background text-[15px] font-black tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        >
          Next — Review →
        </button>
      </div>
    </div>
  );
}
