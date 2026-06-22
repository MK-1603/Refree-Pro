interface Standing {
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted border-b border-border/50">
            <th className="text-left py-2 px-2 font-medium w-8">#</th>
            <th className="text-left py-2 px-2 font-medium">Team</th>
            <th className="text-center py-2 px-1 font-medium">P</th>
            <th className="text-center py-2 px-1 font-medium">W</th>
            <th className="text-center py-2 px-1 font-medium">D</th>
            <th className="text-center py-2 px-1 font-medium">L</th>
            <th className="text-center py-2 px-1 font-medium">GF</th>
            <th className="text-center py-2 px-1 font-medium">GA</th>
            <th className="text-center py-2 px-1 font-medium">GD</th>
            <th className="text-center py-2 px-1 font-medium font-bold">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr key={s.teamName} className={`border-b border-border/50 transition-colors ${i === 0 ? 'bg-yellow-500/10' : i === 1 ? 'bg-foreground/5' : ''}`}>
              <td className="py-3 px-2 text-muted font-mono">{i + 1}</td>
              <td className="py-3 px-2 font-semibold">{s.teamName}</td>
              <td className="py-3 px-1 text-center text-foreground/70">{s.played}</td>
              <td className="py-3 px-1 text-center text-primary">{s.won}</td>
              <td className="py-3 px-1 text-center text-muted">{s.drawn}</td>
              <td className="py-3 px-1 text-center text-red-card/80">{s.lost}</td>
              <td className="py-3 px-1 text-center text-muted">{s.goalsFor}</td>
              <td className="py-3 px-1 text-center text-muted">{s.goalsAgainst}</td>
              <td className="py-3 px-1 text-center text-muted">{s.goalDifference}</td>
              <td className="py-3 px-1 text-center font-bold text-foreground">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
