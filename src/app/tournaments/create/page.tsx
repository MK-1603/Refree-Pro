'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { MapPin, Trophy, Calendar, Sparkles } from 'lucide-react';

export default function CreateTournamentPage() {
  const [name, setName] = useState('');
  const [venue, setVenue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCreate = async () => {
    if (!name || !venue || !startDate || !endDate) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, venue, startDate, endDate }),
      });
      if (!res.ok) throw new Error();
      const t = await res.json();
      toast('Tournament created successfully! 🎉');
      router.push(`/tournaments/${t.id}`);
    } catch { toast('Failed to create tournament', 'error'); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Premium Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0F8A5F]/10 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex-1 p-4 md:p-8 max-w-lg mx-auto w-full flex flex-col justify-center py-12">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Create Tournament</h1>
            <p className="text-primary font-medium text-sm tracking-wider uppercase">New Event</p>
          </div>

          <div className="space-y-5 pt-2">
            <Input 
              label="Tournament Name *" 
              icon={<Trophy size={16} />} 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Summer Cup 2026" 
            />

            <Input 
              label="Venue / Location *" 
              icon={<MapPin size={16} />} 
              value={venue}
              onChange={(e) => setVenue(e.target.value)} 
              placeholder="e.g. National Stadium" 
            />

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Start Date *" 
                icon={<Calendar size={16} />} 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)} 
              />
              <Input 
                label="End Date *" 
                icon={<Calendar size={16} />} 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="ghost" 
              className="w-1/3" 
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              disabled={!name || !venue || !startDate || !endDate} 
              loading={loading}
              onClick={handleCreate}
            >
              {(!name || !venue || !startDate || !endDate) ? 'Fill Required Fields' : 'Initialize Tournament'}
            </Button>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
}
