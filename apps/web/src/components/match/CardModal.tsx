'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface CardModalProps {
  open: boolean;
  onClose: () => void;
  cardType: 'yellow' | 'red';
  teamA: string;
  teamB: string;
  players: { name: string; jerseyNo?: number; team: string }[];
  currentMinute: number;
  elapsedMs?: number | null;
  onSave: (data: { team: string; playerName: string; jerseyNo?: number; cardType: string; minute: number; elapsedMs?: number | null }) => Promise<void>;
}

export function CardModal({ open, onClose, cardType, teamA, teamB, players, currentMinute, elapsedMs, onSave }: CardModalProps) {
  const [team, setTeam] = useState('team_a');
  const [playerName, setPlayerName] = useState('');
  const [jerseyNo, setJerseyNo] = useState('');
  const [minute, setMinute] = useState(currentMinute);
  const [loading, setLoading] = useState(false);


  const isYellow = cardType === 'yellow';

  const handleSave = async () => {
    if (!playerName) return;
    setLoading(true);
    try {
      await onSave({ team, playerName, jerseyNo: jerseyNo ? parseInt(jerseyNo) : undefined, cardType, minute, elapsedMs });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isYellow ? '🟨 Yellow Card' : '🟥 Red Card'} position="bottom"
      className={isYellow ? 'border-yellow-card/30' : 'border-red-card/30'}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {[{ id: 'team_a', label: teamA }, { id: 'team_b', label: teamB }].map((t) => (
            <button key={t.id} onClick={() => setTeam(t.id)}
              className={cn('py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]', team === t.id ? (isYellow ? 'bg-yellow-card text-black' : 'bg-red-card text-white') : 'glass text-muted hover:text-foreground')}>
              {t.label}
            </button>
          ))}
        </div>

        <Input label="Player Name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Enter player name" />

        <Input label="Jersey No (optional)" type="number" value={jerseyNo} onChange={(e) => setJerseyNo(e.target.value)} placeholder="—" />
        <Input label="Minute" type="number" value={minute} onChange={(e) => setMinute(parseInt(e.target.value) || 0)} />

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className={cn('flex-1', isYellow ? 'bg-yellow-card text-black hover:bg-yellow-card/90' : 'bg-red-card hover:bg-red-card/90')}
            onClick={handleSave} loading={loading} disabled={!playerName}>
            Issue Card
          </Button>
        </div>
      </div>
    </Modal>
  );
}
