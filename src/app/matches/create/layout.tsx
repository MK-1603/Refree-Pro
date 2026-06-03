'use client';
import { CreateMatchProvider } from './CreateMatchContext';

export default function CreateMatchLayout({ children }: { children: React.ReactNode }) {
  return <CreateMatchProvider>{children}</CreateMatchProvider>;
}
