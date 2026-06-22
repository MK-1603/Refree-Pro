'use client';
import { useRouter } from 'next/navigation';
import { useCreateMatch } from '../CreateMatchContext';
import { CreateMatchStepper } from '../CreateMatchStepper';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const formats = ['3v3', '5v5', '7v7', '9v9', '11v11'];
const formatCounts: Record<string, number> = { '3v3': 3, '5v5': 5, '7v7': 7, '9v9': 9, '11v11': 11 };

const COLORS = [
  { hex: '#E74C3C', name: 'Red' },
  { hex: '#3498DB', name: 'Blue' },
  { hex: '#2C3E50', name: 'Navy' },
  { hex: '#60A5FA', name: 'Sky' },
  { hex: '#F1C40F', name: 'Yellow' },
  { hex: '#E67E22', name: 'Orange' },
  { hex: '#27AE60', name: 'Green' },
  { hex: '#8E44AD', name: 'Purple' },
  { hex: '#FF8DA1', name: 'Pink' },
  { hex: '#78281F', name: 'Maroon' },
  { hex: '#117A65', name: 'Teal' },
  { hex: '#D4AF37', name: 'Gold' },
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#1A1D20', name: 'Black' },
  { hex: '#566573', name: 'Grey' },
];

const JerseyIcon = ({ color }: { color: string }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={color}
    stroke="var(--color-foreground)" strokeWidth="1.2" strokeOpacity="0.15"
    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-300"
  >
    <path d="M6 3L8 5C9 4 10 3.5 12 3.5C14 3.5 15 4 16 5L18 3C19 3 20 4 20 5V10H17V21H7V10H4V5C4 4 5 3 6 3Z" />
  </svg>
);

function TeamCard({
  label, teamKey, colorKey, name, color,
}: {
  label: string; teamKey: string; colorKey: string; name: string; color: string;
}) {
  const { update } = useCreateMatch();
  const isWhite = color === '#FFFFFF';
  const isBlack = color === '#1A1D20';
  const textBg  = isWhite ? '#1A1D20' : isBlack ? '#FFFFFF' : 'transparent';
  const textClr = isWhite || isBlack ? (isWhite ? '#FFFFFF' : '#000000') : color;

  return (
    <div className="rounded-2xl border border-border/30 bg-card/40 overflow-hidden">
      {/* Color strip */}
      <div className="h-1" style={{ backgroundColor: color }} />

      <div className="p-4 space-y-4">
        {/* Team name row */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-background/60 border border-border/30 flex items-center justify-center shrink-0">
            <JerseyIcon color={color} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
            <input
              value={name}
              onChange={e => update({ [teamKey]: e.target.value.toUpperCase() } as any)}
              placeholder={`${label} name...`}
              className="w-full text-[15px] font-black outline-none bg-transparent border-none placeholder-muted-foreground/30 uppercase tracking-wide"
              style={{ color: name ? textClr : undefined, backgroundColor: name ? textBg : 'transparent', borderRadius: name && (isWhite || isBlack) ? 4 : 0, padding: name && (isWhite || isBlack) ? '2px 6px' : 0 }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/20" />

        {/* Color picker */}
        <div>
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2.5">Kit Color</p>
          <div className="grid grid-cols-8 gap-2 items-center">
            {COLORS.map(c => (
              <button
                key={c.hex}
                onClick={() => update({ [colorKey]: c.hex } as any)}
                title={c.name}
                className={cn(
                  'w-6 h-6 rounded-full transition-all duration-200 outline-none cursor-pointer border border-white/10',
                  color === c.hex
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110'
                    : 'hover:scale-110 opacity-70 hover:opacity-100'
                )}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamsPage() {
  const { state, update } = useCreateMatch();
  const router = useRouter();

  const setFormat = (fmt: string) => {
    const count = formatCounts[fmt];
    const newPlayers = [
      ...Array(count).fill(null).map((_, i) => ({ name: '', team: 'team_a', jerseyNo: i + 1 })),
      ...Array(count).fill(null).map((_, i) => ({ name: '', team: 'team_b', jerseyNo: i + 1 })),
    ];
    update({ squadFormat: fmt, players: newPlayers });
  };

  const valid = state.teamA && state.teamB && state.squadFormat;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-lg flex flex-col bg-background">

      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-5 pb-4 border-b border-border/10 bg-background/95 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.push('/matches/create/details')}
            className="w-9 h-9 rounded-full border border-border/40 bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 active:scale-95 transition-all"
          >
            <ChevronLeft size={18} strokeWidth={2.5} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-black text-foreground tracking-tight">New Match</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Step 2 of 4 — Teams & Kits</p>
          </div>
        </div>
        <CreateMatchStepper current={1} />
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-5 space-y-5">
        <TeamCard
          label="Team A" teamKey="teamA" colorKey="teamAColor"
          name={state.teamA} color={state.teamAColor}
        />
        <TeamCard
          label="Team B" teamKey="teamB" colorKey="teamBColor"
          name={state.teamB} color={state.teamBColor}
        />

        {/* Squad format */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.12em]">Squad Format *</p>
          <div className="grid grid-cols-5 gap-2">
            {formats.map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={cn(
                  'py-3 rounded-xl text-[12px] font-black transition-all duration-200 outline-none cursor-pointer border',
                  state.squadFormat === f
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-foreground/5 border-border/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-foreground/8'
                )}
              >
                {f}
              </button>
            ))}
          </div>
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
          disabled={!valid}
          onClick={() => valid && router.push('/matches/create/config')}
          className={cn(
            'flex-1 h-12 rounded-xl text-[15px] font-black tracking-wide transition-all duration-200',
            valid
              ? 'bg-foreground text-background hover:opacity-90 active:scale-[0.98]'
              : 'bg-foreground/10 text-muted-foreground cursor-not-allowed'
          )}
        >
          {valid ? 'Next — Config →' : 'Select Format'}
        </button>
      </div>
    </div>
  );
}
