'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCreateMatch } from '../CreateMatchContext';
import { CreateMatchStepper } from '../CreateMatchStepper';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const formats = ['3v3', '5v5', '7v7', '9v9', '11v11'];
const formatCounts: Record<string, number> = { '3v3': 3, '5v5': 5, '7v7': 7, '9v9': 9, '11v11': 11 };
const colors = ['#0F8A5F', '#E74C3C', '#3498DB', '#F39C12', '#9B59B6', '#1ABC9C'];

export default function TeamsPage() {
  const { state, update } = useCreateMatch();
  const router = useRouter();

  const setFormat = (fmt: string) => {
    const count = formatCounts[fmt];
    // Keep the empty player slots in state so the match engine still knows how many players there are,
    // but we won't force the user to fill out their names right now!
    const newPlayers = [
      ...Array(count).fill(null).map((_, i) => ({ name: '', team: 'team_a', jerseyNo: i + 1 })),
      ...Array(count).fill(null).map((_, i) => ({ name: '', team: 'team_b', jerseyNo: i + 1 })),
    ];
    update({ squadFormat: fmt, players: newPlayers });
  };

  const valid = state.teamA && state.teamB && state.squadFormat;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/matches/create/details')} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors border border-border/50 text-foreground shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Create Match</h1>
            <p className="text-primary font-medium text-sm tracking-wider uppercase">Step 2 of 4 — Teams</p>
          </div>
        </div>
        
        <CreateMatchStepper current={1} />

        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'teamA', colorKey: 'teamAColor', color: state.teamAColor, name: state.teamA, label: 'Team A' },
            { key: 'teamB', colorKey: 'teamBColor', color: state.teamBColor, name: state.teamB, label: 'Team B' },
          ].map(({ key, colorKey, color, name, label }) => (
            <div 
              key={key} 
              className="bg-background border border-border/50 rounded-2xl p-4 relative overflow-hidden transition-all duration-300"
            >
              {/* Subtle background glow based on team color */}
              <div 
                className="absolute inset-0 opacity-10 blur-2xl transition-colors duration-500" 
                style={{ backgroundColor: color }} 
              />
              
              <div className="relative z-10">
                <input 
                  value={name}
                  onChange={(e) => update({ [key]: e.target.value } as any)}
                  className="w-full bg-transparent text-xl font-bold outline-none mb-4 placeholder-muted transition-colors"
                  style={{ color: name ? color : 'var(--color-foreground)' }} 
                  placeholder={label} 
                />
                
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((c) => (
                    <button 
                      key={c} 
                      onClick={() => update({ [colorKey]: c } as any)}
                      className={cn(
                        'w-7 h-7 rounded-full transition-all duration-300 outline-none', 
                        color === c ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110 shadow-[0_0_10px_rgba(150,150,150,0.3)]' : 'hover:scale-110 opacity-70 hover:opacity-100'
                      )}
                      style={{ background: c }} 
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-xs text-muted font-bold uppercase tracking-widest block">Squad Format *</label>
          <div className="grid grid-cols-5 gap-2">
            {formats.map((f) => (
              <button 
                key={f} 
                onClick={() => setFormat(f)}
                className={cn(
                  'py-3 rounded-xl text-sm font-bold transition-all duration-300 outline-none',
                  state.squadFormat === f 
                    ? 'bg-primary/10 border border-primary text-primary shadow-[0_0_15px_rgba(0,230,118,0.3)]' 
                    : 'bg-background border border-border/50 text-muted hover:border-foreground/30 hover:text-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button variant="ghost" className="w-1/3" onClick={() => router.back()}>← Back</Button>
          <Button className="flex-1" disabled={!valid} onClick={() => router.push('/matches/create/config')}>
            {valid ? 'Next Step' : 'Select Format'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
