import { MatchTimer } from '@/lib/timer';
import { Edit2 } from 'lucide-react';

interface EventItemProps {
  minute: number;
  elapsedMs?: number | null;
  type: 'goal' | 'yellow' | 'red' | 'sub';
  playerName: string;
  teamSide?: 'home' | 'away';
  isUndone?: boolean;
  onClick?: () => void;
}

export function EventItem({ minute, elapsedMs, type, playerName, teamSide = 'home', isUndone, onClick }: EventItemProps) {
  const timeDisplay = elapsedMs !== null && elapsedMs !== undefined
    ? MatchTimer.formatDisplay(elapsedMs)
    : `${minute}'`;

  return (
    <div 
      onClick={onClick}
      className={`grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-2 px-2 relative group ${
        isUndone ? 'opacity-40 line-through' : ''
      } ${onClick ? 'cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.08] rounded-[10px] transition-colors' : ''}`}
    >
      {/* Home Side */}
      <div className="flex justify-end items-center gap-2 text-right">
        {teamSide === 'home' && (
          <>
            <span className="text-sm font-medium truncate">{playerName}</span>
            <span className="text-xs text-muted tabular-nums">{timeDisplay}</span>
          </>
        )}
      </div>

      {/* Center Icon */}
      <div className="flex justify-center items-center w-6 shrink-0">
        {type === 'goal' && <span className="text-base">⚽</span>}
        {type === 'red' && <div className="w-3 h-4 bg-red-500 rounded-[2px]" />}
        {type === 'yellow' && <div className="w-3 h-4 bg-yellow-400 rounded-[2px]" />}
        {type === 'sub' && <span className="text-base">🔄</span>}
      </div>

      {/* Away Side */}
      <div className="flex justify-start items-center gap-2 text-left">
        {teamSide === 'away' && (
          <>
            <span className="text-xs text-muted tabular-nums">{timeDisplay}</span>
            <span className="text-sm font-medium truncate">{playerName}</span>
          </>
        )}
      </div>

      {/* Edit Icon Overlay (Visible on hover if onClick is provided) */}
      {onClick && !isUndone && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-1.5 rounded-md bg-white/10 text-white/60 hover:text-white hover:bg-white/20">
            <Edit2 size={13} />
          </div>
        </div>
      )}
    </div>
  );
}
