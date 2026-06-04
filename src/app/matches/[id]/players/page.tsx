'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import { Select } from '@/components/ui/Select';

export default function PlayersPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [match, setMatch] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editJersey, setEditJersey] = useState('');
  const [newName, setNewName] = useState('');
  const [newJersey, setNewJersey] = useState('');
  const [newTeam, setNewTeam] = useState('team_a');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);
      const res = await fetch(`/api/matches/${id}`);
      const d = await res.json();
      setMatch(d.match);
      setPlayers(d.players || []);
      setTimerRunning(d.timer?.isRunning ?? false);
    });
  }, [params]);

  const addPlayer = async () => {
    if (!newName) return;
    try {
      const res = await fetch(`/api/matches/${id}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team: newTeam, name: newName, jerseyNo: newJersey ? parseInt(newJersey) : undefined }),
      });
      const p = await res.json();
      setPlayers(ps => [...ps, p]);
      setNewName(''); setNewJersey('');
      toast('Player added');
    } catch { toast('Failed', 'error'); }
  };

  const saveEdit = async (playerId: string) => {
    try {
      const res = await fetch(`/api/players/${playerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, jerseyNo: editJersey ? parseInt(editJersey) : undefined }),
      });
      const p = await res.json();
      setPlayers(ps => ps.map(x => x.id === playerId ? p : x));
      setEditId(null);
      toast('Updated');
    } catch { toast('Failed', 'error'); }
  };

  const deletePlayer = async (playerId: string) => {
    try {
      const res = await fetch(`/api/players/${playerId}`, { method: 'DELETE' });
      if (!res.ok) { toast('Cannot delete — player has events', 'error'); return; }
      setPlayers(ps => ps.filter(p => p.id !== playerId));
      toast('Deleted');
    } catch { toast('Failed', 'error'); }
  };

  if (!match) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" /></div>;

  const renderTeam = (team: string) => {
    const teamName = team === 'team_a' ? match.teamA : match.teamB;
    const color = team === 'team_a' ? match.teamAColor : match.teamBColor;
    const ps = players.filter(p => p.team === team);
    return (
      <div className="flex-1">
        <p className="font-bold mb-3 text-sm" style={{ color }}>{teamName}</p>
        <div className="space-y-2">
          {ps.map(p => (
            <div key={p.id} className="glass rounded-xl px-3 py-2 flex items-center gap-2">
              {editId === p.id ? (
                <>
                  <input type="number" value={editJersey} onChange={e => setEditJersey(e.target.value)}
                    className="w-10 bg-transparent text-center text-xs outline-none border border-white/20 rounded px-1" placeholder="#" />
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none" />
                  <button onClick={() => saveEdit(p.id)} className="text-primary"><Check size={14} /></button>
                  <button onClick={() => setEditId(null)} className="text-white/40"><X size={14} /></button>
                </>
              ) : (
                <>
                  <span className="text-white/30 text-xs w-6">#{p.jerseyNo ?? '—'}</span>
                  <span className="flex-1 text-sm">{p.name}</span>
                  {!timerRunning && (
                    <>
                      <button onClick={() => { setEditId(p.id); setEditName(p.name); setEditJersey(p.jerseyNo?.toString() ?? ''); }} className="text-white/40 hover:text-white p-1"><Edit2 size={12} /></button>
                      <button onClick={() => deletePlayer(p.id)} className="text-white/40 hover:text-red-card p-1"><Trash2 size={12} /></button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Squad Management</h1>
        {timerRunning && (
          <div className="glass rounded-xl p-3 text-yellow-card text-sm mb-4 border border-yellow-card/20">
            ⚠️ Pause the timer to edit the roster
          </div>
        )}

        <div className="flex gap-4 mb-6">
          {renderTeam('team_a')}
          <div className="w-px bg-white/10" />
          {renderTeam('team_b')}
        </div>

        {!timerRunning && (
          <Card className="p-4">
            <p className="text-sm font-semibold mb-3">Add Player</p>
            <div className="flex gap-2 flex-wrap">
              <select value={newTeam} onChange={e => setNewTeam(e.target.value)}
                className="glass rounded-xl px-3 py-2 text-sm min-h-[44px] outline-none">
                <option value="team_a">{match.teamA}</option>
                <option value="team_b">{match.teamB}</option>
              </select>
              <input type="number" value={newJersey} onChange={e => setNewJersey(e.target.value)}
                className="w-16 glass rounded-xl px-2 py-2 text-sm text-center min-h-[44px] outline-none" placeholder="#" />
              <input value={newName} onChange={e => setNewName(e.target.value)}
                className="flex-1 glass rounded-xl px-3 py-2 text-sm min-h-[44px] outline-none" placeholder="Player name" />
              <Button size="sm" onClick={addPlayer} disabled={!newName}><Plus size={14} /></Button>
            </div>
          </Card>
        )}
      </motion.div>
    </AppLayout>
  );
}
