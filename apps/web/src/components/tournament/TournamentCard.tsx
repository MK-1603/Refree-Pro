import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Calendar, MapPin } from 'lucide-react';

interface TournamentCardProps {
  id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  status: string;
  played: number;
  total: number;
  onDelete?: (e: React.MouseEvent) => void;
}

export function TournamentCard({ id, name, venue, startDate, endDate, status, played, total, onDelete }: TournamentCardProps) {
  return (
    <Link href={`/tournaments/${id}`}>
      <Card hover>
        <div className="flex items-start justify-between mb-3 relative">
          <h3 className="font-bold text-base">{name}</h3>
          <div className="flex items-center gap-2">
            <Badge status={status} />
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-muted hover:text-red-500 transition-colors p-1 z-10"
                title="Delete Tournament"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted mb-3">
          <span className="flex items-center gap-1"><MapPin size={11} />{venue}</span>
          <span className="flex items-center gap-1"><Calendar size={11} />{startDate} – {endDate}</span>
        </div>
        <ProgressBar value={played} max={total || 1} />
        <p className="text-xs text-muted mt-1.5">{played} / {total} matches played</p>
      </Card>
    </Link>
  );
}
