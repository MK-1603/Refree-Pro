import { MatchTimer } from '@/lib/timer';

interface EventItemProps {
  minute: number;
  elapsedMs?: number | null;
  type: 'goal' | 'yellow' | 'red' | 'sub';
  description: string;
  teamColor?: string;
  isUndone?: boolean;
}

const icons: Record<string, string> = { goal: '⚽', yellow: '🟨', red: '🟥', sub: '🔄' };

export function EventItem({ minute, elapsedMs, type, description, teamColor, isUndone }: EventItemProps) {
  const timeDisplay = elapsedMs !== null && elapsedMs !== undefined
    ? MatchTimer.formatDisplay(elapsedMs)
    : `${minute}'`;

  return (
    <div className={`flex items-center gap-3 py-2 px-1 ${isUndone ? 'opacity-40' : ''}`}>
      <span className="text-xs font-mono text-muted w-16 shrink-0 tabular-nums">{timeDisplay}</span>
      <span className="text-base shrink-0">{icons[type]}</span>
      <span className={`text-sm flex-1 ${isUndone ? 'line-through' : ''}`}>{description}</span>
      {teamColor && <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ background: teamColor }} />}
    </div>
  );
}
