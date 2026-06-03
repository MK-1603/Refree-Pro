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
}

export function MatchCard({ id, matchNumber, teamA, teamB, teamAColor, teamBColor, scoreA, scoreB, status, venue, matchDate, matchTime }: MatchCardProps) {
  return (
    <Link href={`/matches/${id}`}>
      <Card hover className="group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted font-mono">MATCH #{matchNumber}</span>
          <Badge status={status} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-sm flex-1 truncate" style={{ color: teamAColor }}>{teamA}</span>
          {(status !== 'scheduled') && (
            <span className="score-digit text-2xl text-foreground px-2">{scoreA ?? 0} - {scoreB ?? 0}</span>
          )}
          {status === 'scheduled' && <span className="text-muted text-sm px-2">vs</span>}
          <span className="font-bold text-sm flex-1 truncate text-right" style={{ color: teamBColor }}>{teamB}</span>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted">
          <span className="flex items-center gap-1"><MapPin size={11} />{venue}</span>
          <span className="flex items-center gap-1"><Calendar size={11} />{matchDate} {matchTime}</span>
        </div>
      </Card>
    </Link>
  );
}
