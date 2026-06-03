/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { MatchCard } from '@/components/match/MatchCard';
import { TournamentCard } from '@/components/tournament/TournamentCard';
import { Plus, FileText, History, Trophy, Swords } from 'lucide-react';

export default function DashboardPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateStr, setDateStr] = useState('');
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch('/api/matches').then(r => r.json()),
      fetch('/api/tournaments').then(r => r.json()),
    ]).then(([m, t]) => {
      setMatches(Array.isArray(m) ? m : []);
      setTournaments(Array.isArray(t) ? t : []);
      setLoading(false);
    }).catch(() => setLoading(false));
    setDateStr(new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
  }, []);

  const liveMatches = matches.filter((m) => m.status === 'live');
  const today = new Date().toISOString().split('T')[0];
  const todayMatches = matches.filter((m) => m.matchDate === today);
  const recent = matches.filter((m) => m.status === 'completed').slice(0, 5);
  const activeTournaments = tournaments.filter((t) => t.status === 'active');

  const quickActions = [
    { icon: Plus, label: 'Create Match', href: '/matches/create/details', accent: true },
    { icon: Trophy, label: 'Create Tournament', href: '/tournaments/create' },
    { icon: FileText, label: 'Generate Report', href: '/reports' },
    { icon: History, label: 'View History', href: '/history' },
  ];

  return (
    <AppLayout>
      <div className="p-3 md:p-6 max-w-5xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Header / Live Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-xs font-medium text-muted uppercase tracking-wider">{dateStr}</p>
          </div>
          
          {liveMatches.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-xl p-4 border border-live/30 shadow-lg shadow-live/5 bg-gradient-to-r from-live/5 to-transparent">
              <div className="absolute top-0 left-0 w-1 h-full bg-live" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="live-dot w-1.5 h-1.5" />
                    <span className="font-bold text-live text-[10px] tracking-widest uppercase">Live Now</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{liveMatches[0].teamA} <span className="text-muted mx-1">v</span> {liveMatches[0].teamB}</h3>
                </div>
                <Button size="sm" onClick={() => router.push(`/matches/${liveMatches[0].id}/live`)} className="h-8 text-xs px-3 shadow-md shadow-live/10">
                  RESUME
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Stats Grid - 3 Columns on Mobile */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="flex flex-col items-center justify-center p-3 text-center">
            <p className="text-2xl font-bold text-primary tracking-tight mb-0.5">{todayMatches.length}</p>
            <p className="text-[10px] font-medium text-muted uppercase tracking-wide leading-tight">Today's<br/>Matches</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-3 text-center">
            <p className="text-2xl font-bold text-foreground tracking-tight mb-0.5">{activeTournaments.length}</p>
            <p className="text-[10px] font-medium text-muted uppercase tracking-wide leading-tight">Active<br/>Tourneys</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-3 text-center">
            <p className="text-2xl font-bold text-foreground tracking-tight mb-0.5">{matches.filter(m => m.status === 'scheduled').length}</p>
            <p className="text-[10px] font-medium text-muted uppercase tracking-wide leading-tight">Upcoming<br/>Matches</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-[11px] text-muted font-bold tracking-widest uppercase mb-2 px-1">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <Card key={a.label} hover onClick={() => router.push(a.href)}
                className={`p-3 flex items-center gap-3 ${a.accent ? 'border-primary/20 shadow-sm shadow-primary/10' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.accent ? 'bg-primary text-white' : 'bg-foreground/5 text-muted border border-border/50'}`}>
                  <a.icon size={16} />
                </div>
                <span className={`text-xs font-semibold tracking-wide truncate ${a.accent ? 'text-foreground' : 'text-muted'}`}>{a.label}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        {loading ? (
          <div className="space-y-2">
            <h2 className="text-[11px] text-muted font-bold tracking-widest uppercase mb-2 px-1">Recent Activity</h2>
            <SkeletonCard /><SkeletonCard />
          </div>
        ) : matches.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12 border-dashed border-border bg-transparent shadow-none">
            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-3 border border-border">
              <Swords size={20} className="text-muted" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">No Matches Yet</h3>
            <p className="text-xs text-muted max-w-[200px] text-center mb-4 leading-relaxed">Start by creating your first match or tournament.</p>
            <Button size="sm" onClick={() => router.push('/matches/create/details')} className="h-9">
              <Plus size={16} className="mr-1.5" />
              Create Match
            </Button>
          </Card>
        ) : (
          <div className="space-y-6 pb-4">
            {recent.length > 0 && (
              <div>
                <h2 className="text-[11px] text-muted font-bold tracking-widest uppercase mb-2 px-1">Recent Matches</h2>
                <div className="space-y-2">
                  {recent.map((m) => (
                    <MatchCard key={m.id} {...m} matchDate={m.matchDate} matchTime={m.matchTime} />
                  ))}
                </div>
              </div>
            )}

            {activeTournaments.length > 0 && (
              <div>
                <h2 className="text-[11px] text-muted font-bold tracking-widest uppercase mb-2 px-1">Active Tournaments</h2>
                <div className="space-y-2">
                  {activeTournaments.slice(0, 3).map((t) => (
                    <TournamentCard key={t.id} {...t} played={0} total={0}
                      startDate={t.startDate} endDate={t.endDate} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
