export type RankStateType = {
  uuid: string;
  rankName: string;
  rankColor: string;
  userList: string[];
};

export type Player = {
  playerId: string;
  playerName: string;
};

export type Member = Player & {
  memberId: string;
};

export type rankAndPlayer = {
  rankId: string;
  rankName: string;
  memberId: string;
  Player: Player;
};

export type MemberLog = {
  member_id: string;
  team_id: number;
  team_set_id: string;
};
