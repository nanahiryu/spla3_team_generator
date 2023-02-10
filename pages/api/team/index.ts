import type { NextApiRequest, NextApiResponse } from "next";
import { Player } from "../../../types/RankCard";
import { ReqTeamGrouping } from "../../../types/request/Team";
import { RespTeamGrouping } from "../../../types/response/Team";

const teamApi = (
  req: NextApiRequest,
  res: NextApiResponse<RespTeamGrouping>
) => {
  const bravoMembers: Player[] = [];
  const alphaMembers: Player[] = [];
  const members: ReqTeamGrouping = req.body;
  console.log(members);
  let playerId = 0;
  members.RankMembers.forEach((rankMember) => {
    rankMember.userList.forEach((user) => {
      if (bravoMembers.length <= alphaMembers.length) {
        bravoMembers.push({ playerId: playerId, playerName: user });
      } else {
        alphaMembers.push({ playerId: playerId, playerName: user });
      }
      playerId++;
    });
  });
  res.status(200).json({ bravo: bravoMembers, alpha: alphaMembers });
};

export default teamApi;
