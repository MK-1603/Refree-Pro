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
      <div className="fixed bottom-24 md:bottom-6 right-4 z-100 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className="glass rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg min-w-60 max-w-sm"
            >
              {t.type === 'success' && <CheckCircle size={16} className="text-primary shrink-0" />}
              {t.type === 'error' && <XCircle size={16} className="text-red-card shrink-0" />}
              {t.type === 'info' && <AlertCircle size={16} className="text-muted shrink-0" />}
              <span className="text-sm flex-1">{t.message}</span>
              <button onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))}>
                <X size={14} className="text-muted hover:text-foreground" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
