'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { MatchCard } from '@/components/match/MatchCard';
import { TournamentCard } from '@/components/tournament/TournamentCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { matchService } from '@/services/matchService';

const tabs = ['matches', 'tournaments'];

export default function HistoryPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('matches');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([matchService.getMatches(), fetch('/api/tournaments').then(r => r.json()).catch(() => [])])
      .then(([m, t]) => {
        setMatches(Array.isArray(m) ? m.filter((x: any) => x.status === 'completed') : []);
        setTournaments(Array.isArray(t) ? t : []);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const filteredMatches = matches.filter(m =>
    !search || m.teamA.toLowerCase().includes(search.toLowerCase()) || m.teamB.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">History</h1>

        <div className="flex gap-2 mb-4">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-4 py-2 rounded-xl text-sm font-medium capitalize min-h-[36px] transition-all',
                tab === t ? 'bg-primary text-white' : 'glass text-muted hover:text-foreground')}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'matches' && (
          <Input icon={<Search size={15} />} value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by team..." className="mb-4" />
        )}

        {loading ? (
          <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>
        ) : tab === 'matches' ? (
          filteredMatches.length === 0
            ? <p className="text-center text-muted py-8">No completed matches yet</p>
            : <div className="space-y-3">{filteredMatches.map(m => <MatchCard key={m.id} {...m} />)}</div>
        ) : (
          tournaments.length === 0
            ? <p className="text-center text-muted py-8">No tournaments yet</p>
            : <div className="space-y-3">{tournaments.map(t => <TournamentCard key={t.id} {...t} played={0} total={0} startDate={t.startDate} endDate={t.endDate} />)}</div>
        )}
      </motion.div>
    </AppLayout>
  );
}
