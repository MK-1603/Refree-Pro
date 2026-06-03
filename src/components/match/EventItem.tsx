interface EventItemProps {
  minute: number;
  type: 'goal' | 'yellow' | 'red' | 'sub';
  description: string;
  teamColor?: string;
  isUndone?: boolean;
}

const icons: Record<string, string> = { goal: '⚽', yellow: '🟨', red: '🟥', sub: '🔄' };

export function EventItem({ minute, type, description, teamColor, isUndone }: EventItemProps) {
  return (
    <div className={`flex items-center gap-3 py-2 px-1 ${isUndone ? 'opacity-40' : ''}`}>
      <span className="text-xs font-mono text-muted w-8 shrink-0">{minute}&apos;</span>
      <span className="text-base shrink-0">{icons[type]}</span>
      <span className={`text-sm flex-1 ${isUndone ? 'line-through' : ''}`}>{description}</span>
      {teamColor && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: teamColor }} />}
    </div>
  );
}
