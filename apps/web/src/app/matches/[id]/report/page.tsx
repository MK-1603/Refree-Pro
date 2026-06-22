'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Button } from '@/components/ui/Button';
import { FileText, Download, Target, Activity, ShieldAlert, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MatchTimer } from '@/lib/timer';

export default function MatchReportPage({ params }: { params: Promise<{ id: string }> }) {
  const [match, setMatch] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      const [mr, er] = await Promise.all([fetch(`/api/matches/${id}`), fetch(`/api/matches/${id}/events`)]);
      const d = await mr.json();
      setMatch(d.match);
      setEvents(await er.json());
      setDataLoading(false);
    });
  }, [params]);

  const generatePDF = async () => {
    if (!match) return;
    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const { width, height } = page.getSize();
      const accent = rgb(0.145, 0.388, 0.922);
      let y = height - 50;

      const draw = (text: string, x: number, yPos: number, size: number = 11, f = font, color = rgb(0, 0, 0)) => {
        page.drawText(text, { x, y: yPos, size, font: f, color });
      };

      page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.04, 0.04, 0.04) });
      draw('MATCH REPORT — REFEREE PRO', 50, height - 35, 16, bold, rgb(1, 1, 1));
      draw(`Generated ${new Date().toLocaleDateString()}`, 50, height - 55, 9, font, rgb(0.5, 0.5, 0.5));
      y = height - 100;

      draw(`${match.venue}  |  ${match.matchDate}  |  ${match.matchTime}`, 50, y, 10, font, rgb(0.3, 0.3, 0.3));
      y -= 20;
      if (match.refereeName) { draw(`Referee: ${match.refereeName}`, 50, y, 10, font, rgb(0.3, 0.3, 0.3)); y -= 20; }

      page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: accent });
      y -= 30;
      draw(`${match.teamA}`, 50, y, 20, bold, rgb(0, 0, 0));
      draw(`${match.scoreA ?? 0}  –  ${match.scoreB ?? 0}`, width / 2 - 30, y, 24, bold, accent);
      draw(`${match.teamB}`, width - 50 - match.teamB.length * 12, y, 20, bold, rgb(0, 0, 0));
      y -= 40;
      page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: accent });
      y -= 25;

      const activeEvents = events.filter(e => !e.isUndone);
      const goals = activeEvents.filter(e => e.eventType === 'goal');
      if (goals.length > 0) {
        draw('GOALS', 50, y, 11, bold, accent); y -= 18;
        draw("Time     Player                    Team              Type", 50, y, 9, font, rgb(0.4, 0.4, 0.4)); y -= 14;
        page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) }); y -= 12;
        for (const g of goals) {
          const timeText = g.elapsedMs !== null && g.elapsedMs !== undefined ? MatchTimer.formatDisplay(g.elapsedMs) : `${g.minute}'`;
          draw(timeText, 50, y, 10, font); draw(g.playerName.slice(0, 25), 95, y, 10, font);
          draw(g.team === 'team_a' ? match.teamA : match.teamB, 300, y, 10, font);
          draw(g.goalType, 450, y, 10, font); y -= 14;
          if (y < 80) break;
        }
        y -= 10;
      }

      const cards = activeEvents.filter(e => e.eventType === 'card');
      if (cards.length > 0) {
        draw('CARDS', 50, y, 11, bold, rgb(0.9, 0.2, 0.2)); y -= 18;
        for (const c of cards) {
          const timeText = c.elapsedMs !== null && c.elapsedMs !== undefined ? MatchTimer.formatDisplay(c.elapsedMs) : `${c.minute}'`;
          draw(`${timeText} ${c.cardType === 'yellow' ? '[Y]' : '[R]'} ${c.playerName} — ${c.team === 'team_a' ? match.teamA : match.teamB}`, 50, y, 10, font);
          y -= 14; if (y < 80) break;
        }
        y -= 10;
      }

      const subs = activeEvents.filter(e => e.eventType === 'sub');
      if (subs.length > 0) {
        draw('SUBSTITUTIONS', 50, y, 11, bold, rgb(0.2, 0.5, 0.9)); y -= 18;
        for (const s of subs) {
          const timeText = s.elapsedMs !== null && s.elapsedMs !== undefined ? MatchTimer.formatDisplay(s.elapsedMs) : `${s.minute}'`;
          draw(`${timeText} ${s.playerOut} → ${s.playerIn} (${s.team === 'team_a' ? match.teamA : match.teamB})`, 50, y, 10, font);
          y -= 14; if (y < 80) break;
        }
      }

      page.drawLine({ start: { x: 50, y: 40 }, end: { x: width - 50, y: 40 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
      draw('Referee Pro v2.0 — Official Match Record', 50, 25, 9, font, rgb(0.6, 0.6, 0.6));

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `match-report-${match.matchNumber}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } finally { setLoading(false); }
  };

  if (dataLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" /></div>;
  if (!match) return <div className="min-h-screen flex items-center justify-center text-muted">Match not found</div>;

  const activeEvents = events.filter(e => !e.isUndone);
  const goals = activeEvents.filter(e => e.eventType === 'goal');
  const cards = activeEvents.filter(e => e.eventType === 'card');
  const subs = activeEvents.filter(e => e.eventType === 'sub');

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8 max-w-4xl mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 border border-border/50 text-foreground transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <Button onClick={generatePDF} loading={loading} className="shadow-lg shadow-primary/20">
            <Download size={16} className="mr-2" /> Export PDF
          </Button>
        </div>

        {/* Title */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-black text-foreground">Official Match Report</h1>
          <p className="text-sm text-muted font-bold tracking-widest uppercase mt-2">{match.matchDate} • {match.venue}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Score Banner */}
            <div className="glass rounded-3xl p-6 md:p-8 border border-border bg-gradient-to-br from-background to-foreground/5">
              <div className="flex justify-between items-center text-center">
                <div className="w-1/3">
                  <h3 className="text-lg md:text-2xl font-black">{match.teamA}</h3>
                  <div className="w-8 h-2 rounded-full mx-auto mt-2" style={{ backgroundColor: match.teamAColor }} />
                </div>
                <div className="w-1/3">
                  <div className="text-4xl md:text-6xl font-black text-primary tracking-tight">
                    {match.scoreA} - {match.scoreB}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-2">Final Score</p>
                </div>
                <div className="w-1/3">
                  <h3 className="text-lg md:text-2xl font-black">{match.teamB}</h3>
                  <div className="w-8 h-2 rounded-full mx-auto mt-2" style={{ backgroundColor: match.teamBColor }} />
                </div>
              </div>
            </div>

            {/* Goals Log */}
            <div className="glass rounded-2xl p-6 border border-border">
              <h3 className="text-xs font-bold tracking-widest uppercase text-muted mb-6 flex items-center gap-2">
                <Target size={14} className="text-primary" /> Goal Log
              </h3>
              {goals.length === 0 ? <p className="text-muted italic text-sm text-center py-4">No goals recorded</p> : (
                <div className="space-y-4">
                  {goals.map(g => (
                    <div key={g.id} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-primary font-bold text-sm bg-primary/10 px-2 py-1 rounded">
                          {g.elapsedMs !== null ? MatchTimer.formatDisplay(g.elapsedMs) : `${g.minute}'`}
                        </span>
                        <div>
                          <p className="font-bold text-sm">{g.playerName} <span className="text-xs text-muted font-normal ml-2">{g.goalType !== 'normal' && `(${g.goalType})`}</span></p>
                          <p className="text-[10px] uppercase tracking-widest text-muted">{g.team === 'team_a' ? match.teamA : match.teamB}</p>
                        </div>
                      </div>
                      <span className="text-lg">⚽</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discipline Log */}
            <div className="glass rounded-2xl p-6 border border-border">
              <h3 className="text-xs font-bold tracking-widest uppercase text-muted mb-6 flex items-center gap-2">
                <ShieldAlert size={14} className="text-yellow-500" /> Discipline Record
              </h3>
              {cards.length === 0 ? <p className="text-muted italic text-sm text-center py-4">No cards issued</p> : (
                <div className="space-y-4">
                  {cards.map(c => (
                    <div key={c.id} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-muted font-bold text-sm">
                          {c.elapsedMs !== null ? MatchTimer.formatDisplay(c.elapsedMs) : `${c.minute}'`}
                        </span>
                        <div>
                          <p className="font-bold text-sm">{c.playerName}</p>
                          <p className="text-[10px] uppercase tracking-widest text-muted">{c.team === 'team_a' ? match.teamA : match.teamB}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-5 rounded-[3px] shadow-sm ${c.cardType === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Side Column */}
          <div className="space-y-6">
            
            {/* Match Information */}
            <div className="glass rounded-2xl p-6 border border-border bg-foreground/5">
              <h3 className="text-xs font-bold tracking-widest uppercase text-muted mb-6">Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Match Number</p>
                  <p className="font-mono font-bold">{match.matchNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Referee</p>
                  <p className="font-bold">{match.refereeName || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Duration</p>
                  <p className="font-bold">{match.matchDuration} min halves</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Format</p>
                  <p className="font-bold">{match.squadFormat}</p>
                </div>
              </div>
            </div>

            {/* Statistics Summary */}
            <div className="glass rounded-2xl p-6 border border-border">
              <h3 className="text-xs font-bold tracking-widest uppercase text-muted mb-6 flex items-center gap-2">
                <Activity size={14} className="text-blue-400" /> Key Stats
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span style={{ color: match.teamAColor }}>{goals.filter(g => g.team === 'team_a').length}</span>
                    <span className="text-muted tracking-widest uppercase">Goals</span>
                    <span style={{ color: match.teamBColor }}>{goals.filter(g => g.team === 'team_b').length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-yellow-500">{cards.filter(c => c.cardType === 'yellow' && c.team === 'team_a').length}</span>
                    <span className="text-muted tracking-widest uppercase">Yellow Cards</span>
                    <span className="text-yellow-500">{cards.filter(c => c.cardType === 'yellow' && c.team === 'team_b').length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-red-500">{cards.filter(c => c.cardType === 'red' && c.team === 'team_a').length}</span>
                    <span className="text-muted tracking-widest uppercase">Red Cards</span>
                    <span className="text-red-500">{cards.filter(c => c.cardType === 'red' && c.team === 'team_b').length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-foreground">{subs.filter(s => s.team === 'team_a').length}</span>
                    <span className="text-muted tracking-widest uppercase">Subs</span>
                    <span className="text-foreground">{subs.filter(s => s.team === 'team_b').length}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}
