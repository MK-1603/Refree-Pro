'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  icon,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("flex flex-col gap-1.5 w-full relative", className)} ref={containerRef}>
      {label && <label className="text-xs text-muted font-bold uppercase tracking-widest select-none">{label}</label>}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full bg-background border border-border rounded-xl px-4 py-3.5 text-left text-sm outline-none transition-all flex items-center justify-between cursor-pointer select-none",
            icon && "pl-11",
            isOpen ? "border-primary shadow-[0_0_12px_rgba(37,99,235,0.1)]" : "focus:border-primary/50"
          )}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}
            <span className={cn(selectedOption ? "text-foreground font-medium" : "text-muted")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={cn("text-muted transition-transform duration-200", isOpen && "rotate-180")}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="absolute z-50 left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto"
            >
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted text-center">No options available</div>
              ) : (
                options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between cursor-pointer select-none",
                        isSelected 
                          ? "bg-primary/10 text-primary font-semibold" 
                          : "text-foreground hover:bg-foreground/5"
                      )}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={14} className="text-primary" />}
                    </button>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
