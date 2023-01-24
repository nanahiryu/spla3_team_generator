export type RankStateType = {
  uuid: string;
  rankName: string;
  rankColor: string;
  userList: Player[];
};

export type Player = {
  playerId: string;
  playerName: string;
};
