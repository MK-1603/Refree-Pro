/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Plus, FileText, History, Trophy, Swords, Share2, Activity, Play } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { matchService } from '@/services/matchService';
import { tournamentService } from '@/services/tournamentService';

export default function DashboardPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      matchService.getMatches(),
      tournamentService.getTournaments(),
    ]).then(([m, t]) => {
      setMatches(Array.isArray(m) ? m : []);
      setTournaments(Array.isArray(t) ? t : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled');
  const completedMatches = matches.filter((m) => m.status === 'completed' || m.status === 'full_time');
  const recentReports = completedMatches.slice(0, 3);
  const activeTournaments = tournaments.filter((t) => t.status === 'active');

  const handleDeleteMatch = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this match?')) {
      await matchService.deleteMatch(id);
      setMatches(matches.filter(m => m.id !== id));
    }
  };

  const handleDeleteTournament = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this tournament? All associated matches will also be deleted.')) {
      await tournamentService.deleteTournament(id);
      setTournaments(tournaments.filter(t => t.id !== id));
      const m = await matchService.getMatches();
      setMatches(Array.isArray(m) ? m : []);
    }
  };

  const quickActions = [
    { icon: Plus, label: 'Schedule Match', href: '/matches/create/details', accent: true },
    { icon: Trophy, label: 'New Tournament', href: '/tournaments/create' },
    { icon: FileText, label: 'View Reports', action: () => {
      if (completedMatches.length > 0) setShowReportModal(true);
      else alert("No completed matches available for reports.");
    }},
    { icon: Share2, label: 'Generate Poster', action: () => {
      if (completedMatches.length > 0) setShowPosterModal(true);
      else alert("No completed matches available to generate a poster.");
    }},
  ];

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
        
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-2 border-b border-border/30">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Command Center</h1>
          </div>
          <div className="flex items-center gap-2 bg-foreground/5 px-3 py-1.5 rounded-full border border-border/50">
            <Activity size={14} className="text-primary" />
            <span className="text-xs font-bold">{matches.length} Total Matches</span>
          </div>
        </div>
        
        {/* Active Matches (Live) */}
        {liveMatches.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl p-5 border border-live/30 shadow-[0_0_30px_rgba(239,68,68,0.15)] bg-gradient-to-r from-live/10 to-[#0A0A0A]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-live" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-live/20 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="live-dot w-2 h-2" />
                  <span className="font-black text-live text-xs tracking-widest uppercase animate-pulse">Live Match</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {liveMatches[0].teamA} <span className="text-muted/50 mx-2 text-sm font-normal">vs</span> {liveMatches[0].teamB}
                </h3>
                <p className="text-xs text-muted mt-1">{liveMatches[0].venue} • Match {liveMatches[0].matchNumber}</p>
              </div>
              <Button onClick={() => router.push(`/matches/${liveMatches[0].id}/live`)} className="shadow-lg shadow-live/20">
                <Play size={16} className="mr-2 fill-current" />
                Resume Engine
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quick Actions V2 Grid */}
        <div>
          <h2 className="text-xs text-muted font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/50" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((a) => (
              <Card key={a.label} hover onClick={a.action ? a.action : () => router.push(a.href!)}
                className={`p-4 flex flex-col items-center justify-center gap-3 text-center transition-all ${a.accent ? 'border-foreground/15 bg-foreground/5' : 'bg-foreground/5 hover:bg-foreground/10'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.accent ? 'bg-foreground text-background' : 'bg-background border border-border/50 text-foreground shadow-sm'}`}>
                  <a.icon size={20} />
                </div>
                <span className="text-xs font-bold tracking-wide text-foreground">{a.label}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Dynamic Content Grid */}
        {loading ? (
          <div className="space-y-2"><SkeletonCard /><SkeletonCard /></div>
        ) : matches.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 border-dashed border-border bg-transparent shadow-none">
            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4 border border-border">
              <Swords size={28} className="text-muted" />
            </div>
            <h3 className="text-lg font-black text-foreground mb-2">No Matches Scheduled</h3>
            <p className="text-sm text-muted max-w-[250px] text-center mb-6 leading-relaxed">The pitch is empty. Initialize your first match to activate the engine.</p>
            <Button onClick={() => router.push('/matches/create/details')} className="px-6">
              <Plus size={18} className="mr-2" />
              Initialize Match
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Upcoming & Active Tournaments */}
            <div className="space-y-6">
              {upcomingMatches.length > 0 && (
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <h2 className="text-xs text-muted font-bold tracking-widest uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500/50" /> Upcoming Matches
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {upcomingMatches.slice(0, 3).map((m) => (
                      <MatchCard key={m.id} {...m} matchDate={m.matchDate} matchTime={m.matchTime} onDelete={(e) => handleDeleteMatch(m.id, e)} />
                    ))}
                  </div>
                </div>
              )}

              {activeTournaments.length > 0 && (
                <div>
                  <h2 className="text-xs text-muted font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500/50" /> Tournament Overview
                  </h2>
                  <div className="space-y-3">
                    {activeTournaments.slice(0, 2).map((t) => (
                      <TournamentCard key={t.id} {...t} played={0} total={0} startDate={t.startDate} endDate={t.endDate} onDelete={(e) => handleDeleteTournament(t.id, e)} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Recent Reports */}
            <div className="space-y-6">
              {recentReports.length > 0 && (
                <div>
                  <h2 className="text-xs text-muted font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500/50" /> Recent Reports
                  </h2>
                  <div className="space-y-3">
                    {recentReports.map((m) => (
                      <Card key={m.id} hover onClick={() => router.push(`/matches/${m.id}/report`)} className="p-4 flex items-center justify-between border-l-2 border-l-border/50">
                        <div>
                          <p className="text-xs text-muted mb-1">{m.matchDate} • {m.venue}</p>
                          <p className="font-bold text-sm text-foreground">{m.teamA} <span className="text-primary mx-1">{m.scoreA} - {m.scoreB}</span> {m.teamB}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-foreground/5 hover:bg-foreground/10">
                          <FileText size={14} className="text-muted-foreground" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      <Modal open={showPosterModal} onClose={() => setShowPosterModal(false)} title="Generate Poster">
        <div className="space-y-4">
          <p className="text-sm text-muted">Select a completed match to generate a poster:</p>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
            {completedMatches.map(m => (
              <Button key={m.id} variant="secondary" className="w-full justify-start text-left h-auto py-3" onClick={() => router.push(`/matches/${m.id}/poster`)}>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{m.teamA} vs {m.teamB}</span>
                    <span className="text-primary font-bold">{m.scoreA} - {m.scoreB}</span>
                  </div>
                  <span className="text-xs text-muted">{m.matchDate} • {m.venue}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={showReportModal} onClose={() => setShowReportModal(false)} title="View Report">
        <div className="space-y-4">
          <p className="text-sm text-muted">Select a completed match to view its report:</p>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
            {completedMatches.map(m => (
              <Button key={m.id} variant="secondary" className="w-full justify-start text-left h-auto py-3" onClick={() => router.push(`/matches/${m.id}/report`)}>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{m.teamA} vs {m.teamB}</span>
                    <span className="text-primary font-bold">{m.scoreA} - {m.scoreB}</span>
                  </div>
                  <span className="text-xs text-muted">{m.matchDate} • {m.venue}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
