
export interface WeeklyScorecard {
  nickname: string;
  score: number;
  rank: number;
}

export interface DownloadedScorecardResults {
  Errors: string[];
  Results: Scorecard[];
}

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
  complete: boolean;
  correct: boolean;
  incorrect: boolean;
}

export interface QueuedEmailInfo {
  FromEmail: string
  User: string
  Attachments: Attachment[]
}

export interface Attachment {
  Name: string;
  IsValid: boolean;
  InvalidDetails: string;
}