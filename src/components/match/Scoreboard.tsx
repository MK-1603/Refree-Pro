'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface ScoreboardProps {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  teamAColor?: string;
  teamBColor?: string;
  compact?: boolean;
}

function AnimatedScore({ value }: { value: number }) {
  const [anim, setAnim] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value) {
      setAnim(true);
      prev.current = value;
      setTimeout(() => setAnim(false), 200);
    }
  }, [value]);
  return (
    <motion.span
      animate={anim ? { scale: [1, 1.12, 1] } : {}}
      transition={{ duration: 0.2 }}
      className="score-digit"
    >
      {value}
    </motion.span>
  );
}

export function Scoreboard({ teamA, teamB, scoreA, scoreB, teamAColor = '#0F8A5F', teamBColor = '#E74C3C', compact }: ScoreboardProps) {
  return (
    <div className={`w-full flex items-center justify-between gap-4 ${compact ? 'py-3' : 'py-6'}`}>
      <div className="flex-1 text-right">
        <p className={`font-bold truncate ${compact ? 'text-sm' : 'text-xl'}`} style={{ color: teamAColor }}>{teamA}</p>
      </div>
      <div className={`flex items-center gap-2 font-score text-foreground ${compact ? 'text-4xl' : 'text-7xl'}`}>
        <AnimatedScore value={scoreA} />
        <span className="text-muted/50">-</span>
        <AnimatedScore value={scoreB} />
      </div>
      <div className="flex-1 text-left">
        <p className={`font-bold truncate ${compact ? 'text-sm' : 'text-xl'}`} style={{ color: teamBColor }}>{teamB}</p>
      </div>
    </div>
  );
}
