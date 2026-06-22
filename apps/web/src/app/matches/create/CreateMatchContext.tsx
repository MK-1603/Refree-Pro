'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Player { name: string; jerseyNo?: number; team: string; }

export interface CreateMatchState {
  tournamentId: string;
  venue: string;
  matchNumber: string;
  matchDate: string;
  matchTime: string;
  refereeName: string;
  teamA: string;
  teamB: string;
  teamAColor: string;
  teamBColor: string;
  squadFormat: string;
  players: Player[];
  matchDuration: number;
  breakDuration: number;
  extraTime: number | null;
}

const STORAGE_KEY = 'referee_pro_create_match';

const defaultState: CreateMatchState = {
  tournamentId: '',
  venue: '',
  matchNumber: '',
  matchDate: new Date().toISOString().split('T')[0],
  matchTime: '14:00',
  refereeName: '',
  teamA: '',
  teamB: '',
  teamAColor: '#0F8A5F',
  teamBColor: '#E74C3C',
  squadFormat: '',
  players: [],
  matchDuration: 45,
  breakDuration: 15,
  extraTime: null,
};

const Ctx = createContext<{
  state: CreateMatchState;
  update: (p: Partial<CreateMatchState>) => void;
  reset: () => void;
}>({ state: defaultState, update: () => {}, reset: () => {} });

export function CreateMatchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CreateMatchState>(defaultState);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState({ ...defaultState, ...JSON.parse(saved) });
      }
    } catch {}
  }, []);

  const update = (p: Partial<CreateMatchState>) => {
    setState(s => {
      const next = { ...s, ...p };
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const reset = () => {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
    setState(defaultState);
  };

  return <Ctx.Provider value={{ state, update, reset }}>{children}</Ctx.Provider>;
}

export const useCreateMatch = () => useContext(Ctx);
