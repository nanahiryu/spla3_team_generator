import { Player } from "../RankCard";

export type RespTeamGrouping = {
  bravo?: Player[];
  alpha?: Player[];
  error?: string | null;
};
