
export interface GameResult {
  status: string;
  winner: string;
  homeTeam: string;
  team1: { name: string, score: number }
  team2: { name: string, score: number }
}