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
}

export function TournamentCard({ id, name, venue, startDate, endDate, status, played, total }: TournamentCardProps) {
  return (
    <Link href={`/tournaments/${id}`}>
      <Card hover>
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-base">{name}</h3>
          <Badge status={status} />
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
