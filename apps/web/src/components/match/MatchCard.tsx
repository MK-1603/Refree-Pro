import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Calendar, MapPin } from 'lucide-react';

interface MatchCardProps {
  id: string;
  matchNumber: number;
  teamA: string;
  teamB: string;
  teamAColor?: string;
  teamBColor?: string;
  scoreA?: number;
  scoreB?: number;
  status: string;
  venue: string;
  matchDate: string;
  matchTime: string;
  onDelete?: (e: React.MouseEvent) => void;
}

export function MatchCard({ id, matchNumber, teamA, teamB, teamAColor, teamBColor, scoreA, scoreB, status, venue, matchDate, matchTime, onDelete }: MatchCardProps) {
  let displayStatus = status;
  if (status === 'scheduled' && matchDate && matchTime) {
    try {
      const scheduledDate = new Date(`${matchDate}T${matchTime}`);
      const now = new Date();
      if (scheduledDate <= now) {
        displayStatus = 'kickoff';
      }
    } catch {}
  }

  return (
    <Link href={`/matches/${id}`}>
      <Card hover className="group">
        <div className="flex items-center justify-between mb-3 relative">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-mono">MATCH {matchNumber}</span>
            <Badge status={displayStatus} />
          </div>
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-muted hover:text-red-500 transition-colors p-1 z-10"
              title="Delete Match"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: teamAColor || '#3b82f6' }} />
            <span className="font-bold text-sm text-foreground truncate">{teamA}</span>
          </div>
          {(status !== 'scheduled') && (
            <span className="score-digit text-2xl text-foreground px-2 shrink-0">{scoreA ?? 0} - {scoreB ?? 0}</span>
          )}
          {status === 'scheduled' && <span className="text-muted text-sm px-2 shrink-0">vs</span>}
          <div className="flex items-center justify-end gap-1.5 flex-1 min-w-0">
            <span className="font-bold text-sm text-foreground truncate text-right">{teamB}</span>
            <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: teamBColor || '#ef4444' }} />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted">
          <span className="flex items-center gap-1"><MapPin size={11} />{venue}</span>
          <span className="flex items-center gap-1"><Calendar size={11} />{matchDate} {matchTime}</span>
        </div>
      </Card>
    </Link>
  );
}
