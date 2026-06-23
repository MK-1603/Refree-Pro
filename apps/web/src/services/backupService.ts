import { db } from '../database/db';

export const backupService = {
  async exportBackup() {
    const matches = await db.matches.toArray();
    const players = await db.players.toArray();
    const events = await db.events.toArray();
    const timers = await db.timers.toArray();

    const backupData = {
      version: 1,
      exportDate: new Date().toISOString(),
      data: { matches, players, events, timers }
    };

    const blob = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `referee_pro_backup_${new Date().toISOString().split('T')[0]}.refereepro`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  async importBackup(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const backup = JSON.parse(text);
          
          if (!backup.data || !backup.data.matches) {
            throw new Error('Invalid backup file format');
          }

          const { matches, players, events, timers } = backup.data;

          await db.transaction('rw', db.matches, db.players, db.events, db.timers, async () => {
            if (matches && matches.length > 0) await db.matches.bulkPut(matches);
            if (players && players.length > 0) await db.players.bulkPut(players);
            if (events && events.length > 0) await db.events.bulkPut(events);
            if (timers && timers.length > 0) await db.timers.bulkPut(timers);
          });
          
          resolve({ success: true });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
};
