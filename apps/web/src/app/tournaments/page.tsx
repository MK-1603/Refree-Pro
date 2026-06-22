'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { TournamentCard } from '@/components/tournament/TournamentCard';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useRouter } from 'next/navigation';
import { Plus, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/tournaments').then(r => r.json()).then(d => {
      setTournaments(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = tournaments.filter(t => tab === 'active' ? t.status === 'active' : t.status !== 'active');

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Tournaments</h1>
          <Button size="sm" onClick={() => router.push('/tournaments/create')}>
            <Plus size={16} /> Create
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {(['active', 'completed'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-4 py-2 rounded-xl text-sm font-medium capitalize min-h-[36px] transition-all',
                tab === t ? 'bg-primary text-white' : 'glass text-muted hover:text-foreground')}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <Trophy size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">No {tab} tournaments</p>
            <p className="text-sm mt-1 mb-4">Create one to get started</p>
            <Button onClick={() => router.push('/tournaments/create')}><Plus size={16} /> Create Tournament</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(t => (
              <TournamentCard key={t.id} {...t} played={0} total={0} startDate={t.startDate} endDate={t.endDate} />
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
