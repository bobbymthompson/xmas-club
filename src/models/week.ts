
import { Scorecard } from "./scorecard";

export interface Week {
  week: number;
  dueDate: Date;
  scorecards: Array<Scorecard>;
  totalNumberOfPicks: number;
  winner: string;
  tieBreakerTotalScore: number;
}