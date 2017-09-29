
export interface Score {
  $key: string;
  total: number;
  weeklyScores: WeeklyScore[];
  sortedScores: number[]
}

export interface WeeklyScore {
  $key: string;
  week: number;
  score: number;
  total: number;
}