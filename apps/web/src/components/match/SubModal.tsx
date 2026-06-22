'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface SubModalProps {
  open: boolean;
  onClose: () => void;
  teamA: string;
  teamB: string;
  players: { name: string; jerseyNo?: number; team: string }[];
  currentMinute: number;
  elapsedMs?: number | null;
  onSave: (data: { team: string; playerOut: string; playerIn: string; minute: number; elapsedMs?: number | null }) => Promise<void>;
}

export function SubModal({ open, onClose, teamA, teamB, players, currentMinute, elapsedMs, onSave }: SubModalProps) {
  const [team, setTeam] = useState('team_a');
  const [playerOut, setPlayerOut] = useState('');
  const [playerIn, setPlayerIn] = useState('');
  const [minute, setMinute] = useState(currentMinute);
  const [loading, setLoading] = useState(false);



  const handleSave = async () => {
    if (!playerOut || !playerIn) return;
    setLoading(true);
    try {
      await onSave({ team, playerOut, playerIn, minute, elapsedMs });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="🔄 Substitution" position="bottom">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {[{ id: 'team_a', label: teamA }, { id: 'team_b', label: teamB }].map((t) => (
            <button key={t.id} onClick={() => setTeam(t.id)}
              className={cn('py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]', team === t.id ? 'bg-primary text-white' : 'glass text-muted hover:text-foreground')}>
              {t.label}
            </button>
          ))}
        </div>

        <Input label="Player Out" value={playerOut} onChange={(e) => setPlayerOut(e.target.value)} placeholder="Enter player name" />

        <Input label="Player In" value={playerIn} onChange={(e) => setPlayerIn(e.target.value)} placeholder="Enter new player name" />
        <Input label="Minute" type="number" value={minute} onChange={(e) => setMinute(parseInt(e.target.value) || 0)} />

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} loading={loading} disabled={!playerOut || !playerIn}>
            Record Sub
          </Button>
        </div>
      </div>
    </Modal>
  );
}
