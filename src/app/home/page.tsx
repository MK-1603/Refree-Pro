'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Zap, Lock, BarChart3, Shield } from 'lucide-react';

const FootballModel = dynamic(() => import('@/components/3d/FootballModel').then(m => ({ default: m.FootballModel })), { ssr: false });

const features = [
  { icon: Zap, title: 'Fast Match Management', desc: 'Real-time goal, card, and sub tracking with instant DB sync.' },
  { icon: Lock, title: 'Zero Data Loss', desc: 'Every event saved immediately. Auto-recover from any interruption.' },
  { icon: BarChart3, title: 'Auto Reports', desc: 'Generate professional PDF reports and poster graphics instantly.' },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="min-h-screen flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col items-center md:items-start justify-center px-8 md:px-16 py-16 md:py-0 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield size={16} />
              </div>
              <span className="text-sm text-muted tracking-widest font-medium">REFEREE PRO</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
              Match Day.<br />
              <span className="text-primary">Perfected.</span>
            </h1>
            <p className="text-muted text-lg max-w-md mb-8 leading-relaxed">
              Professional football referee and tournament management. Built for the pitch, trusted on matchday.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="xl" onClick={() => router.push('/dashboard')} className="shadow-xl shadow-primary/20">
                ENTER COMMAND CENTER →
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex-1 flex items-center justify-center py-12 md:py-0 order-1 md:order-2 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 rounded-full bg-primary/8 blur-[80px]" />
          </div>
          <FootballModel size={320} />
        </div>
      </section>

      {/* Features */}
      <section className="px-8 md:px-16 py-16 border-t border-border/50">
        <h2 className="text-2xl font-bold mb-8 text-center text-foreground/80">Why Referee Pro</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.map((f) => (
            <Card key={f.title} hover className="p-6">
              <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center mb-4">
                <f.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 text-center text-muted/50 text-sm border-t border-border/50">
        <p>Referee Pro v1.0 — Built for the pitch</p>
      </footer>
    </div>
  );
}
