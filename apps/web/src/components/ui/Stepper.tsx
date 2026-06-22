'use client';
import { Button } from './Button';
import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function Stepper({ value, onChange, min = 0, max = 999, step = 1 }: StepperProps) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" size="icon" onClick={() => onChange(Math.max(min, value - step))}>
        <Minus size={16} />
      </Button>
      <span className="text-2xl font-bold w-12 text-center tabular-nums">{value}</span>
      <Button variant="secondary" size="icon" onClick={() => onChange(Math.min(max, value + step))}>
        <Plus size={16} />
      </Button>
    </div>
  );
}
