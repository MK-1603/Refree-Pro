'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCreateMatch } from '../CreateMatchContext';
import { CreateMatchStepper } from '../CreateMatchStepper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MapPin, Hash, Calendar, Clock, User, Trophy } from 'lucide-react';

export default function DetailsPage() {
  const { state, update } = useCreateMatch();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/tournaments').then(r => r.json()).then(d => setTournaments(Array.isArray(d) ? d : []));
    // Set some defaults if empty so the user doesn't get stuck
    if (!state.matchDate) update({ matchDate: new Date().toISOString().split('T')[0] });
    if (!state.matchNumber) update({ matchNumber: '1' });
  }, []);

  const valid = state.venue && state.matchNumber && state.matchDate && state.matchTime;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/matches')} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors border border-border/50 text-foreground shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Create Match</h1>
            <p className="text-primary font-medium text-sm tracking-wider uppercase">Step 1 of 4 — Details</p>
          </div>
        </div>
        
        <CreateMatchStepper current={0} />

        <div className="space-y-5 pt-2">
          <div>
            <label className="text-xs text-muted font-bold uppercase tracking-widest mb-2 block">Tournament <span className="text-muted/70 lowercase font-normal">(optional)</span></label>
            <div className="relative">
              <Trophy size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <select
                value={state.tournamentId}
                onChange={(e) => update({ tournamentId: e.target.value })}
                className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 text-foreground text-sm outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="">No Tournament</option>
                {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <Input label="Venue *" icon={<MapPin size={16} />} value={state.venue}
            onChange={(e) => update({ venue: e.target.value })} placeholder="Enter venue name..." />

          <Input label="Match Number *" icon={<Hash size={16} />} type="number" value={state.matchNumber}
            onChange={(e) => update({ matchNumber: e.target.value })} placeholder="e.g. 1" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Match Date *" icon={<Calendar size={16} />} type="date" value={state.matchDate || ''}
              onChange={(e) => update({ matchDate: e.target.value })} />
            <Input label="Match Time *" icon={<Clock size={16} />} type="time" value={state.matchTime || ''}
              onChange={(e) => update({ matchTime: e.target.value })} />
          </div>

          <Input label="Referee Name" icon={<User size={16} />} value={state.refereeName}
            onChange={(e) => update({ refereeName: e.target.value })} placeholder="Optional referee name" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="w-1/3" onClick={() => router.push('/matches')}>Cancel</Button>
          <Button className="flex-1" disabled={!valid} onClick={() => router.push('/matches/create/teams')}>
            {valid ? 'Next Step' : 'Fill Required Fields'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
