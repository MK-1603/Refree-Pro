'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { MatchCard } from '@/components/match/MatchCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { Plus, Swords, Download, Upload } from 'lucide-react';
import { matchService } from '@/services/matchService';
import { backupService } from '@/services/backupService';

const tabs = ['all', 'scheduled', 'live', 'completed'];

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const router = useRouter();

  useEffect(() => {
    matchService.getMatches().then(d => {
      setMatches(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this match?')) {
      await matchService.deleteMatch(id);
      setMatches(matches.filter(m => m.id !== id));
    }
  };

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
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => backupService.exportBackup()} title="Export Backup">
              <Download size={16} />
            </Button>
            <label className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80" title="Import Backup">
              <Upload size={16} />
              <input type="file" className="hidden" accept=".refereepro,.json" onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  try {
                    await backupService.importBackup(e.target.files[0]);
                    const d = await matchService.getMatches();
                    setMatches(Array.isArray(d) ? d : []);
                    alert('Backup imported successfully');
                  } catch (err) {
                    alert('Failed to import backup');
                  }
                }
              }} />
            </label>
            <Button size="sm" onClick={() => router.push('/matches/create/details')}>
              <Plus size={16} /> Schedule Match
            </Button>
          </div>
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
            <p className="text-sm mt-1 mb-4">Tap Schedule Match to get started</p>
            <Button onClick={() => router.push('/matches/create/details')}>
              <Plus size={16} /> Schedule Match
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {live.length > 0 && (
              <section>
                <h2 className="text-xs text-live font-semibold tracking-widest mb-3 flex items-center gap-2">
                  <span className="live-dot" /> LIVE
                </h2>
                <div className="space-y-3">{live.map(m => <MatchCard key={m.id} {...m} onDelete={(e) => handleDelete(m.id, e)} />)}</div>
              </section>
            )}
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-xs text-muted font-semibold tracking-widest mb-3">UPCOMING</h2>
                <div className="space-y-3">{upcoming.map(m => <MatchCard key={m.id} {...m} onDelete={(e) => handleDelete(m.id, e)} />)}</div>
              </section>
            )}
            {recent.length > 0 && (
              <section>
                <h2 className="text-xs text-muted font-semibold tracking-widest mb-3">RECENT</h2>
                <div className="space-y-3">{recent.map(m => <MatchCard key={m.id} {...m} onDelete={(e) => handleDelete(m.id, e)} />)}</div>
              </section>
            )}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
