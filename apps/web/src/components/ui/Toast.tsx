'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContext = createContext<{ toast: (msg: string, type?: Toast['type']) => void }>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-6 right-4 md:right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-zinc-900/80 dark:bg-zinc-100/90 backdrop-blur-xl border border-white/10 dark:border-black/10 rounded-full px-5 py-3 flex items-center gap-3.5 shadow-2xl shadow-black/20 pointer-events-auto min-w-[280px]"
            >
              {t.type === 'success' && <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0"><CheckCircle size={14} className="text-emerald-500 dark:text-emerald-600" /></div>}
              {t.type === 'error' && <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0"><XCircle size={14} className="text-red-500 dark:text-red-600" /></div>}
              {t.type === 'info' && <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0"><AlertCircle size={14} className="text-blue-500 dark:text-blue-600" /></div>}
              
              <span className="text-[14px] font-medium text-white dark:text-zinc-900 flex-1 truncate tracking-wide">{t.message}</span>
              
              <button onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))} className="w-6 h-6 rounded-full hover:bg-white/10 dark:hover:bg-black/10 flex items-center justify-center transition-colors">
                <X size={14} className="text-zinc-400 dark:text-zinc-500" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
