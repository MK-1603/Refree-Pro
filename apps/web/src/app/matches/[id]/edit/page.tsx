'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Stepper } from '@/components/ui/Stepper';
import { useToast } from '@/components/ui/Toast';
import { MapPin, Hash, Calendar, Clock, User } from 'lucide-react';
import { matchService } from '@/services/matchService';

export default function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [match, setMatch] = useState<any>(null);
  const [venue, setVenue] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [refereeName, setRefereeName] = useState('');
  const [matchDuration, setMatchDuration] = useState(45);
  const [breakDuration, setBreakDuration] = useState(15);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);
      try {
        const d = await matchService.getMatchFull(id);
        const m = d.match;
        setMatch(m);
        setVenue(m.venue); setMatchDate(m.matchDate); setMatchTime(m.matchTime);
        setRefereeName(m.refereeName ?? ''); setMatchDuration(m.matchDuration); setBreakDuration(m.breakDuration);
      } catch {
        toast('Match not found', 'error');
      }
    });
  }, [params]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await matchService.updateMatch(id, { 
        venue, 
        matchDate, 
        matchTime, 
        refereeName: refereeName || null, 
        matchDuration, 
        breakDuration 
      });
      toast('Match updated!');
      router.push(`/matches/${id}`);
    } catch { toast('Failed', 'error'); setLoading(false); }
  };

  if (!match) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" /></div>;

  const timeLocked = match.isLocked || match.status === 'completed';

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-2">Edit Match {match.matchNumber}</h1>
        <p className="text-white/40 text-sm mb-6">{match.teamA} vs {match.teamB}</p>

        {timeLocked && (
          <div className="mb-6 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            Time & Date settings are locked because the match is completed or locked.
          </div>
        )}

        <div className="space-y-4">
          <Input label="Venue" icon={<MapPin size={15} />} value={venue} onChange={e => setVenue(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Match Date" icon={<Calendar size={15} />} type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} disabled={timeLocked} className={timeLocked ? 'opacity-50' : ''} />
            <Input label="Match Time" icon={<Clock size={15} />} type="time" value={matchTime} onChange={e => setMatchTime(e.target.value)} disabled={timeLocked} className={timeLocked ? 'opacity-50' : ''} />
          </div>
          <Input label="Referee Name" icon={<User size={15} />} value={refereeName} onChange={e => setRefereeName(e.target.value)} />

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div><p className="font-semibold text-sm">Match Duration</p><p className="text-xs text-white/40">Minutes per half</p></div>
              {timeLocked ? <span className="font-bold">{matchDuration}</span> : <Stepper value={matchDuration} onChange={setMatchDuration} min={1} max={120} />}
            </div>
            <div className="flex items-center justify-between">
              <div><p className="font-semibold text-sm">Break Duration</p><p className="text-xs text-white/40">Half-time break</p></div>
              {timeLocked ? <span className="font-bold">{breakDuration}</span> : <Stepper value={breakDuration} onChange={setBreakDuration} min={1} max={60} />}
            </div>
          </Card>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="ghost" onClick={() => router.push(`/matches/${id}`)}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} loading={loading}>Save Changes</Button>
        </div>
      </motion.div>
    </div>
  );
}
