import { Player, RankStateType } from "../RankCard";

export type ReqTeamGrouping = {
  RankMembers: RankMembers[];
  groupId: string;
};

export type RankMembers = {
  rankId: string;
  rankName: string;
  userList: string[];
};
