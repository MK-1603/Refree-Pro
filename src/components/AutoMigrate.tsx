'use client';
import { useEffect } from 'react';

export function AutoMigrate() {
  useEffect(() => {
    // Run migration once per session to ensure tables exist
    const key = 'referee_pro_migrated';
    if (sessionStorage.getItem(key)) return;
    fetch('/api/migrate')
      .then(r => r.json())
      .then(d => {
        if (d.success) sessionStorage.setItem(key, '1');
      })
      .catch(() => {});
  }, []);

  return null;
}
