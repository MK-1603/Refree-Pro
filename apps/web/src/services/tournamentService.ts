import { db, Tournament } from '../database/db';
import { v4 as uuidv4 } from 'uuid';

export const tournamentService = {
  async getTournaments() {
    return db.tournaments.orderBy('createdAt').reverse().toArray();
  },

  async createTournament(data: any) {
    const id = uuidv4();
    const tournament: Tournament = {
      id,
      name: data.name.trim(),
      venue: data.venue.trim(),
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'active',
      createdAt: Date.now(),
    };

    await db.tournaments.add(tournament);
    return tournament;
  },

  async getTournament(id: string) {
    const tournament = await db.tournaments.get(id);
    if (!tournament) throw new Error('Not found');

    const matches = await db.matches.where('tournamentId').equals(id).toArray();
    
    // Fetch all events for all matches to calculate standings and scorers
    const allEvents = await Promise.all(
      matches.map(m => db.events.where('matchId').equals(m.id).toArray())
    );
    const scorers = allEvents.flat().filter(e => e.eventType === 'goal');

    return { tournament, matches, scorers };
  },

  async getStandings(tournamentId: string) {
    const matches = await db.matches.where('tournamentId').equals(tournamentId).toArray();
    const standings: Record<string, any> = {};

    matches.forEach(m => {
      if (m.status === 'completed') {
        const teamA = m.teamA;
        const teamB = m.teamB;

        if (!standings[teamA]) standings[teamA] = { teamName: teamA, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
        if (!standings[teamB]) standings[teamB] = { teamName: teamB, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };

        const scoreA = m.scoreA || 0;
        const scoreB = m.scoreB || 0;

        standings[teamA].played++;
        standings[teamB].played++;
        standings[teamA].goalsFor += scoreA;
        standings[teamA].goalsAgainst += scoreB;
        standings[teamB].goalsFor += scoreB;
        standings[teamB].goalsAgainst += scoreA;

        if (scoreA > scoreB) {
          standings[teamA].won++;
          standings[teamA].points += 3;
          standings[teamB].lost++;
        } else if (scoreB > scoreA) {
          standings[teamB].won++;
          standings[teamB].points += 3;
          standings[teamA].lost++;
        } else {
          standings[teamA].drawn++;
          standings[teamB].drawn++;
          standings[teamA].points += 1;
          standings[teamB].points += 1;
        }
      }
    });

    return Object.values(standings).map(s => ({
      ...s,
      goalDifference: s.goalsFor - s.goalsAgainst
    })).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
  },

  async updateTournament(id: string, updates: Partial<Tournament>) {
    await db.tournaments.update(id, updates);
    return db.tournaments.get(id);
  },

  async deleteTournament(id: string) {
    await db.transaction('rw', db.tournaments, db.matches, db.players, db.events, db.timers, async () => {
      await db.tournaments.delete(id);
      
      const matches = await db.matches.where('tournamentId').equals(id).toArray();
      const matchIds = matches.map(m => m.id);
      
      for (const matchId of matchIds) {
        await db.matches.delete(matchId);
        await db.players.where('matchId').equals(matchId).delete();
        await db.events.where('matchId').equals(matchId).delete();
        await db.timers.delete(matchId);
      }
    });
    return { success: true };
  }
};
