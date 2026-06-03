'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { MatchCard } from '@/components/match/MatchCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { Plus, Swords } from 'lucide-react';

const tabs = ['all', 'scheduled', 'live', 'completed'];

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/matches').then(r => r.json()).then(d => {
      setMatches(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? matches : matches.filter(m => m.status === tab);
  const live = filtered.filter(m => m.status === 'live');
  const upcoming = filtered.filter(m => m.status === 'scheduled');
  const recent = filtered.filter(m => m.status === 'completed');

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="p-4 md:p-8 max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Match Hub</h1>
          <Button size="sm" onClick={() => router.push('/matches/create/details')}>
            <Plus size={16} /> New Match
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap min-h-[36px] transition-all',
                tab === t ? 'bg-primary text-white' : 'glass text-muted hover:text-foreground')}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <Swords size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">No {tab !== 'all' ? tab : ''} matches</p>
            <p className="text-sm mt-1 mb-4">Tap New Match to get started</p>
            <Button onClick={() => router.push('/matches/create/details')}>
              <Plus size={16} /> Create Match
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {live.length > 0 && (
              <section>
                <h2 className="text-xs text-live font-semibold tracking-widest mb-3 flex items-center gap-2">
                  <span className="live-dot" /> LIVE
                </h2>
                <div className="space-y-3">{live.map(m => <MatchCard key={m.id} {...m} />)}</div>
              </section>
            )}
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-xs text-muted font-semibold tracking-widest mb-3">UPCOMING</h2>
                <div className="space-y-3">{upcoming.map(m => <MatchCard key={m.id} {...m} />)}</div>
              </section>
            )}
            {recent.length > 0 && (
              <section>
                <h2 className="text-xs text-muted font-semibold tracking-widest mb-3">RECENT</h2>
                <div className="space-y-3">{recent.map(m => <MatchCard key={m.id} {...m} />)}</div>
              </section>
            )}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
