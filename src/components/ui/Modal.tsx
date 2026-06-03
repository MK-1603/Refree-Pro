'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  position?: 'center' | 'bottom';
}

export function Modal({ open, onClose, title, children, className, position = 'center' }: ModalProps) {
  const isBottom = position === 'bottom';
  
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={isBottom ? { opacity: 0, y: '100%' } : { opacity: 0, y: 60, scale: 0.95 }}
            animate={isBottom ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isBottom ? { opacity: 0, y: '100%' } : { opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'z-50 w-full max-w-md glass p-6 shadow-2xl shadow-black/50',
              isBottom 
                ? 'fixed bottom-0 left-1/2 -translate-x-1/2 rounded-t-3xl rounded-b-none pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]' 
                : 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl',
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">{title}</h2>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-foreground/10 transition-colors">
                  <X size={18} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
