'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  teamA: string;
  teamB: string;
  players: { name: string; jerseyNo?: number; team: string }[];
  currentMinute: number;
  onSave: (data: { team: string; playerName: string; jerseyNo?: number; goalType: string; minute: number }) => Promise<void>;
}

export function GoalModal({ open, onClose, teamA, teamB, players, currentMinute, onSave }: GoalModalProps) {
  const [team, setTeam] = useState('team_a');
  const [playerName, setPlayerName] = useState('');
  const [jerseyNo, setJerseyNo] = useState('');
  const [goalType, setGoalType] = useState('normal');
  const [minute, setMinute] = useState(currentMinute);
  const [loading, setLoading] = useState(false);



  const handleSave = async () => {
    if (!playerName) return;
    setLoading(true);
    try {
      await onSave({ team, playerName, jerseyNo: jerseyNo ? parseInt(jerseyNo) : undefined, goalType, minute });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="⚽ Record Goal" position="bottom">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {[{ id: 'team_a', label: teamA }, { id: 'team_b', label: teamB }].map((t) => (
            <button key={t.id} onClick={() => setTeam(t.id)}
              className={cn('py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]', team === t.id ? 'bg-primary text-white' : 'glass text-muted hover:text-foreground')}>
              {t.label}
            </button>
          ))}
        </div>

        <Input label="Player Name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Enter player name" />

        <Input label="Jersey No (optional)" type="number" value={jerseyNo} onChange={(e) => setJerseyNo(e.target.value)} placeholder="—" />

        <div>
          <label className="text-xs text-muted mb-1.5 block">Goal Type</label>
          <div className="grid grid-cols-3 gap-2">
            {['normal', 'penalty', 'own_goal'].map((t) => (
              <button key={t} onClick={() => setGoalType(t)}
                className={cn('py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px]', goalType === t ? 'bg-primary text-white' : 'glass text-muted hover:text-foreground')}>
                {t === 'own_goal' ? 'Own Goal' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <Input label="Minute" type="number" value={minute} onChange={(e) => setMinute(parseInt(e.target.value) || 0)} />

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} loading={loading} disabled={!playerName}>
            Record Goal
          </Button>
        </div>
      </div>
    </Modal>
  );
}
