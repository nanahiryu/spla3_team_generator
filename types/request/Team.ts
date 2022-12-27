import { Player, RankStateType } from "../RankCard";

export type ReqTeamGrouping = {
  RankMembers: RankMembers[];
};

export type RankMembers = {
  rankId: number;
  rankName: string;
  userList: string[];
};
