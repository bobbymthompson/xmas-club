
export interface Scorecard {
  uid: string;
  week: number;
  nickname: string;
  tieBreakerScore: number;
  picks: Array<Pick>;
  score: number;
  rank: number;
}

export interface Pick {
  team1: string;
  team2: string;
  spread: string;
  selectedPick: string;
  pickType: string;
  isOverUnder: boolean;
  homeTeam: string;
}