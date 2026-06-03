'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';

export default function AbandonedPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [match, setMatch] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      setId(id);
      const res = await fetch(`/api/matches/${id}`);
      const d = await res.json();
      setMatch(d.match);

      await fetch(`/api/matches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'abandoned' }),
      });
    });
  }, [params]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="w-16 h-16 bg-red-card/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-card" />
        </div>
        <h1 className="text-3xl font-bold text-center text-red-card mb-2">MATCH ABANDONED</h1>
        {match && (
          <Card className="my-6">
            <p className="text-center text-white/60 text-sm">
              {match.teamA} {match.scoreA ?? 0} – {match.scoreB ?? 0} {match.teamB}
            </p>
            <p className="text-center text-white/30 text-xs mt-1">Abandoned at: {new Date().toLocaleTimeString()}</p>
          </Card>
        )}
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => router.push(`/matches/${id}/report`)}>
            Generate Report
          </Button>
          <Button className="flex-1" onClick={() => router.push('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
