'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { MapPin, Trophy, Calendar } from 'lucide-react';

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

  const valid = name && venue && startDate && endDate;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-lg flex flex-col justify-between overflow-hidden bg-background border-x border-border/5">
      {/* Header (Sticky / Apple style) */}
      <div className="bg-background/85 backdrop-blur-md border-b border-border/10 px-4 py-3.5 flex flex-col gap-0.5 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-1.5 -ml-1">
          <button onClick={() => router.back()} className="flex items-center gap-0.5 text-[#007AFF] hover:opacity-75 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            <span className="text-sm font-semibold">Back</span>
          </button>
          <span className="text-muted/20 font-light select-none">|</span>
          <h1 className="text-base font-bold text-foreground select-none">Create Tournament</h1>
        </div>
        <p className="text-[10px] font-bold text-primary tracking-widest uppercase ml-1 select-none">NEW EVENT</p>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <div className="space-y-4 pt-1">
          <Input 
            label="Tournament Name" 
            icon={<Trophy size={16} />} 
            value={name}
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. Summer Cup 2026" 
          />

          <Input 
            label="Venue / Location" 
            icon={<MapPin size={16} />} 
            value={venue}
            onChange={(e) => setVenue(e.target.value)} 
            placeholder="e.g. National Stadium" 
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input 
                label="Start Date" 
                icon={<Calendar size={16} />} 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
            <div>
              <Input 
                label="End Date" 
                icon={<Calendar size={16} />} 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Footer */}
      <div className="bg-background/85 backdrop-blur-md border-t border-border/10 px-4 py-3.5 flex gap-3 sticky bottom-0 z-40 shrink-0">
        <Button 
          variant="ghost" 
          className="w-1/3" 
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1" 
          disabled={!valid} 
          loading={loading}
          onClick={handleCreate}
        >
          {!valid ? 'Fill Required Fields' : 'Initialize Tournament'}
        </Button>
      </div>
    </div>
  );
}
