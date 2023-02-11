import { PostgrestError } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Member,
  MemberLog,
  Player,
  rankAndPlayer,
} from "../../../types/RankCard";
import { ReqTeamGrouping } from "../../../types/request/Team";
import {
  RespErrorString,
  RespTeamGrouping,
} from "../../../types/response/Team";
import { supabase } from "../../../utils/supabase";

const createTeamApi = async (
  req: NextApiRequest,
  res: NextApiResponse<RespTeamGrouping | RespErrorString>
) => {
  const bravoMembers: Member[] = [];
  const alphaMembers: Member[] = [];
  const reqTeamGroupings: ReqTeamGrouping = req.body;
  const groupId: string = reqTeamGroupings.groupId;

  try {
    // user登録&rank登録
    let newMembers: rankAndPlayer[] = [];
    // 取得したデータをnewMembersに追加
    reqTeamGroupings.RankMembers.forEach((rankMember) => {
      rankMember.userList.forEach((userName) => {
        newMembers.push({
          rankId: rankMember.rankId,
          rankName: rankMember.rankName,
          memberId: "",
          Player: {
            playerId: "",
            playerName: userName,
          },
        });
      });
    });

    // user登録
    let nextMembers: rankAndPlayer[] = [];
    for (let member of newMembers) {
      // user登録
      const { data: data1, error: error1 } = await supabase
        .from("users")
        .insert({ name: member.Player.playerName })
        .select();
      if (error1) {
        throw error1;
      }
      console.log(data1[0]);
      nextMembers.push({
        ...member,
        Player: { ...member.Player, playerId: data1![0].uuid },
      });
    }
    newMembers = nextMembers;

    nextMembers = [];
    for (let member of newMembers) {
      // group_members登録
      const { data: data2, error: error2 } = await supabase
        .from("group_members")
        .insert({
          user_id: member.Player.playerId,
          group_id: groupId,
        })
        .select();
      if (error2) {
        console.log(error2);
        throw error2;
      }
      if (!data2) {
        throw { error: "group members can't be registered" };
      }
      nextMembers.push({ ...member, memberId: data2![0].uuid });
    }
    newMembers = nextMembers;

    // member_rank登録
    const { error: error3 } = await supabase.from("member_rank").insert(
      newMembers.map((newMember) => ({
        member_id: newMember.memberId,
        rank_id: newMember.rankId,
      }))
    );
    if (error3) {
      throw error3;
    }

    // team分け(一旦ロジック放置してます)
    newMembers.forEach((user) => {
      if (bravoMembers.length <= alphaMembers.length) {
        bravoMembers.push({
          memberId: user.memberId,
          playerId: user.Player.playerId,
          playerName: user.Player.playerName,
        });
      } else {
        alphaMembers.push({
          memberId: user.memberId,
          playerId: user.Player.playerId,
          playerName: user.Player.playerName,
        });
      }
    });

    // DBにteam_logを保存する処理
    // team_log_set
    const { data: data4, error: error4 } = await supabase
      .from("team_log_set")
      .insert({})
      .select();
    if (error4) {
      throw error4;
    }
    // team_member_log
    const membersLog: MemberLog[] = [];
    bravoMembers.forEach((member) => {
      membersLog.push({
        member_id: member.memberId,
        team_id: 1,
        team_set_id: data4![0].uuid,
      });
    });
    alphaMembers.forEach((member) => {
      membersLog.push({
        member_id: member.memberId,
        team_id: 0,
        team_set_id: data4![0].uuid,
      });
    });
    const { data: data5, error: error5 } = await supabase
      .from("team_member_log")
      .insert(membersLog);
    if (error5) {
      throw error5;
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
  }

  res.status(200).json({ bravo: bravoMembers, alpha: alphaMembers });
};

export default createTeamApi;
