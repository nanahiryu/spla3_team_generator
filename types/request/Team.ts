import { Player, RankStateType } from "../RankCard";

export type ReqTeamGrouping = {
  RankMembers: RankMembers[];
};

export type RankMembers = {
  rankId: string;
  rankName: string;
  userList: Player[];
};
