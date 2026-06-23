'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MatchCard } from '@/components/match/MatchCard';
import { StandingsTable } from '@/components/tournament/StandingsTable';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit, FileText, MapPin, Calendar, Trash2, Trophy, ListOrdered, Swords, GitMerge, BarChart3, Settings2 } from 'lucide-react';
import { tournamentService } from '@/services/tournamentService';

export default function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [data, setData] = useState<any>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);
      try {
        const data = await tournamentService.getTournament(id);
        const standings = await tournamentService.getStandings(id);
        setData(data);
        setStandings(standings);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    });
  }, [params]);

  if (loading) return <AppLayout><div className="p-8 max-w-5xl mx-auto space-y-4"><SkeletonCard /><SkeletonCard /></div></AppLayout>;
  if (!data?.tournament) return <AppLayout><div className="p-20 text-center text-muted/50 font-bold tracking-widest uppercase">Tournament not found</div></AppLayout>;

  const { tournament, matches, scorers } = data;
  const fixtures = matches.filter((m: any) => m.status !== 'completed' && m.status !== 'full_time');
  const results = matches.filter((m: any) => m.status === 'completed' || m.status === 'full_time');

  const scorerMap: Record<string, { name: string; goals: number; team: string }> = {};
  (scorers || []).filter((g: any) => !g.isUndone).forEach((g: any) => {
    if (!scorerMap[g.playerName]) scorerMap[g.playerName] = { name: g.playerName, goals: 0, team: g.team };
    scorerMap[g.playerName].goals++;
  });
  const topScorers = Object.values(scorerMap).sort((a, b) => b.goals - a.goals);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings2 },
    { id: 'fixtures', label: 'Fixtures', icon: Swords },
    { id: 'standings', label: 'Standings', icon: ListOrdered },
    { id: 'knockouts', label: 'Knockouts', icon: GitMerge },
    { id: 'stats', label: 'Statistics', icon: BarChart3 }
  ];

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen pb-24">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.push('/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 border border-border/50 text-foreground transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div>
              <h1 className="text-2xl font-black text-foreground">Tournament Hub</h1>
              <p className="text-xs text-muted font-bold tracking-widest uppercase">{tournament.startDate} • {tournament.venue}</p>
            </div>
          </div>

          {/* Premium Hero Card */}
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-2xl bg-gradient-to-br from-background via-[#0B0C10] to-background mb-6 p-6 md:p-8">
            <div className="absolute top-0 right-0 w-[60%] h-[200px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="max-w-[70%]">
                <div className="flex items-center gap-3 mb-3">
                  <Badge status={tournament.status} />
                  <span className="bg-foreground/10 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-muted-foreground border border-border/50">
                    <MapPin size={10} className="inline mr-1" /> {tournament.venue}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">{tournament.name}</h2>
                <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                  <Calendar size={14} /> {tournament.startDate} to {tournament.endDate}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="secondary" onClick={() => router.push(`/tournaments/${id}/edit`)} className="bg-white/5 border-white/10 hover:bg-white/10 w-10 h-10 p-0 rounded-full">
                  <Edit size={16} />
                </Button>
                <Button size="sm" onClick={() => setShowDeleteModal(true)} className="bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 w-10 h-10 p-0 rounded-full">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
              {[{ label: 'Total Matches', v: matches.length }, { label: 'Completed', v: results.length }, { label: 'Goals Scored', v: (scorers || []).filter((g: any) => !g.isUndone).length }, { label: 'Active Teams', v: standings.length }].map(({ label, v }) => (
                <div key={label} className="text-center md:text-left">
                  <p className="text-2xl md:text-3xl font-black text-white">{v}</p>
                  <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide border-b border-border/50">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-all font-semibold text-sm ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'}`}>
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
                
                {tab === 'overview' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 border-border bg-foreground/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full" />
                      <p className="text-xs text-muted font-bold tracking-widest uppercase mb-4">Command Center</p>
                      <div className="space-y-3 relative z-10">
                        <Button className="w-full justify-start h-12 text-sm" onClick={() => router.push(`/matches/create/details?tournamentId=${id}`)}>
                          <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center mr-3"><Plus size={16} /></div> Schedule Match
                        </Button>
                        <Button variant="secondary" className="w-full justify-start h-12 text-sm bg-background border-border" onClick={() => router.push(`/tournaments/${id}/report`)}>
                          <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center mr-3"><FileText size={16} /></div> Export PDF Report
                        </Button>
                      </div>
                    </Card>
                    <Card className="p-6 border-border bg-foreground/5">
                      <p className="text-xs text-muted font-bold tracking-widest uppercase mb-4">Tournament Progress</p>
                      <div className="flex items-end gap-3 mb-2">
                        <span className="text-5xl font-black text-foreground">{results.length}</span>
                        <span className="text-xl text-muted font-bold mb-1">/ {matches.length}</span>
                      </div>
                      <p className="text-sm text-muted font-medium mb-4">Matches completed</p>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border/50">
                        <div className="h-full bg-primary" style={{ width: `${matches.length ? (results.length / matches.length) * 100 : 0}%` }} />
                      </div>
                    </Card>
                  </div>
                )}

                {tab === 'fixtures' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs text-muted font-bold tracking-widest uppercase mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500/50" /> Upcoming</h3>
                      {fixtures.length === 0 ? (
                        <div className="text-center py-12 glass rounded-2xl border border-dashed border-border/50">
                          <Swords size={32} className="mx-auto mb-3 text-muted/30" />
                          <p className="text-muted text-sm font-medium mb-4">No upcoming fixtures</p>
                          <Button size="sm" onClick={() => router.push(`/matches/create/details?tournamentId=${id}`)}>Schedule Match</Button>
                        </div>
                      ) : (
                        <div className="space-y-3">{fixtures.map((m: any) => <MatchCard key={m.id} {...m} />)}</div>
                      )}
                    </div>
                    
                    {results.length > 0 && (
                      <div>
                        <h3 className="text-xs text-muted font-bold tracking-widest uppercase mb-4 mt-8 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-500/50" /> Results</h3>
                        <div className="space-y-3 opacity-80">{results.map((m: any) => <MatchCard key={m.id} {...m} />)}</div>
                      </div>
                    )}
                  </div>
                )}

                {tab === 'standings' && (
                  standings.length === 0 ? (
                    <div className="text-center py-16 text-muted/50 font-medium">No standings data available yet.</div>
                  ) : (
                    <div className="glass rounded-2xl border border-border overflow-hidden shadow-lg">
                      <StandingsTable standings={standings.map(s => ({
                        teamName: s.teamName, played: s.played ?? 0, won: s.won ?? 0, drawn: s.drawn ?? 0, lost: s.lost ?? 0,
                        goalsFor: s.goalsFor ?? 0, goalsAgainst: s.goalsAgainst ?? 0, goalDifference: s.goalDifference ?? 0, points: s.points ?? 0,
                      }))} />
                    </div>
                  )
                )}

                {tab === 'knockouts' && (
                  <div className="glass rounded-2xl border border-border p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <GitMerge size={48} className="text-muted/30 mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-2">Knockout Brackets</h3>
                    <p className="text-sm text-muted max-w-sm mb-6">Knockout phase bracket generation will be available once the group stages conclude.</p>
                    <Button variant="secondary" disabled>Generate Bracket (Coming Soon)</Button>
                  </div>
                )}

                {tab === 'stats' && (
                  <div className="space-y-6">
                    <h3 className="text-xs text-muted font-bold tracking-widest uppercase mb-2">Golden Boot Race</h3>
                    {topScorers.length === 0 ? (
                      <div className="text-center py-12 text-muted/50 font-medium">No goals recorded yet.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topScorers.map((s, i) => (
                          <div key={s.name} className="glass rounded-xl p-4 flex items-center gap-4 border border-border hover:border-primary/50 transition-colors">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : i === 1 ? 'bg-gray-400/20 text-gray-400 border border-gray-400/50' : i === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/50' : 'bg-foreground/5 text-muted'}`}>
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-foreground">{s.name}</p>
                              <p className="text-xs text-muted">{s.team}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-foreground/5 px-3 py-1.5 rounded-lg">
                              <span className="text-lg font-black text-primary">{s.goals}</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-muted">Goals</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Delete Confirmation Modal */}
          <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="DELETE TOURNAMENT">
            <p className="text-muted text-sm mb-6 text-center">
              Are you sure you want to delete this tournament? This will permanently wipe all associated matches, standings, and historical data.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 border border-border" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={async () => {
                try {
                  await tournamentService.deleteTournament(id);
                  router.push('/tournaments');
                } catch (e) { alert('Failed to delete tournament'); }
              }}>
                Confirm Deletion
              </Button>
            </div>
          </Modal>

        </motion.div>
      </div>
    </AppLayout>
  );
}
