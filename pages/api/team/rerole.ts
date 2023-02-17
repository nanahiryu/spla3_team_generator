import type { NextApiRequest, NextApiResponse } from "next";
import { Member, Player, rankAndPlayer } from "../../../types/RankCard";
import {
  RespErrorString,
  RespTeamGrouping,
} from "../../../types/response/Team";
import { supabase } from "../../../utils/supabase";
import { setTeamLog } from "../../../utils/team/setTeamLog";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const reroleTeamApi = async (
  req: NextApiRequest,
  res: NextApiResponse<RespTeamGrouping | RespErrorString>
) => {
  let alphaMembers: Member[] = [];
  let bravoMembers: Member[] = [];
  const groupId: string = req.query.groupId as string;
  console.log("rerole api is called");
  try {
    console.log("try now");
    // 過去のteam分けを取得
    const { data: data1, error: error1 } = await supabase
      .from("team_log_set")
      .select("uuid")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (error1) {
      throw error1;
    }
    console.log("data1: ", data1);
    let teamSetUUIDs: string[] = [];
    data1.forEach((teamSet) => {
      teamSetUUIDs.push(teamSet.uuid);
    });
    const { data: data2, error: error2 } = await supabase
      .from("team_member_log")
      .select()
      .in("team_set_id", teamSetUUIDs);
    if (error2) {
      throw error2;
    }
    console.log("data2: ", data2);
    // 被りポイントの計算
    const KPcounter: { [uuid: string]: { [uuid: string]: number } } = {};
    teamSetUUIDs.forEach((teamSetUUID) => {
      const tempBravoMemberLog = data2
        .filter((memberLog) => {
          teamSetUUID === memberLog.team_set_id && memberLog.team_id === 0;
        })
        .map((memberLog) => memberLog.member_id);
      tempBravoMemberLog.forEach((memberId) => {
        tempBravoMemberLog.forEach((memberId2) => {
          if (memberId !== memberId2) {
            if (KPcounter[memberId] === undefined) {
              KPcounter[memberId] = {};
            }
            if (KPcounter[memberId][memberId2] === undefined) {
              KPcounter[memberId][memberId2] = 1;
            }
            KPcounter[memberId][memberId2]++;
          }
        });
      });
      const tempAlphaMemberLog = data2
        .filter((memberLog) => {
          teamSetUUID === memberLog.team_set_id && memberLog.team_id === 1;
        })
        .map((memberLog) => memberLog.member_id);
      tempAlphaMemberLog.forEach((memberId) => {
        tempAlphaMemberLog.forEach((memberId2) => {
          if (memberId !== memberId2) {
            if (KPcounter[memberId] === undefined) {
              KPcounter[memberId] = {};
            }
            if (KPcounter[memberId][memberId2] === undefined) {
              KPcounter[memberId][memberId2] = 1;
            }
            KPcounter[memberId][memberId2]++;
          }
        });
      });
    });
    const { data: data3, error: error3 } = await supabase
      .from("team_member_log")
      .select("member_id")
      .eq("team_set_id", teamSetUUIDs[0]);
    if (error3) {
      console.log("error3: ", error3);
      throw error3;
    }
    console.log("data3: ", data3);
    // 直近のメンバーを取得
    let latestMembers: rankAndPlayer[] = [];
    const { data: data4, error: error4 } = await supabase
      .from("group_members_with_ranks")
      .select("*")
      .in(
        "uuid",
        data3.map((member) => member.member_id)
      );
    if (error4) {
      console.log("error4: ", error4);
      throw error4;
    }
    console.log("data4: ", data4);
    latestMembers = data4.map((member) => {
      if (
        member.uuid &&
        member.rank_id &&
        member.rank_name &&
        member.user_id &&
        member.user_name
      ) {
        return {
          rankId: member.rank_id,
          rankName: member.rank_name,
          memberId: member.uuid,
          Player: {
            playerId: member.user_id,
            playerName: member.user_name,
          },
        };
      } else {
        throw new Error("rank or user data is undefined");
      }
    });
    // 一人目をランダムにalphaに入れる
    const XMemberList = latestMembers.filter(
      (member) => member.rankName === "X"
    );
    const firstMember = XMemberList[getRandomInt(XMemberList.length)];
    latestMembers = latestMembers.filter(
      (member) => member.memberId !== firstMember.memberId
    );
    alphaMembers.push({
      playerId: firstMember.Player.playerId,
      playerName: firstMember.Player.playerName,
      memberId: firstMember.memberId,
    });
    // 被りポイントを均すようにteam分け
    console.log("start get new team");
    const rankNameList = ["X", "S", "A", "B"];
    rankNameList.forEach((rankName) => {
      let tempMembers = latestMembers.filter(
        (member) => member.rankName === rankName
      );
      const loop_num = tempMembers.length;
      for (let i = 0; i < loop_num; i++) {
        console.log("rank: ", rankName, i, tempMembers.length);
        let maxKP = -100;
        let maxMember: rankAndPlayer | undefined;
        let minKP = 100;
        let minMember: rankAndPlayer | undefined;
        if (alphaMembers.length < bravoMembers.length) {
          tempMembers.forEach((member) => {
            // KPが高ければalphaに入り安いイメージ
            let KP = 0;
            console.log("member: ", member);
            alphaMembers.forEach((alphaMember) => {
              if (
                Object.keys(KPcounter).includes(member.memberId) &&
                Object.keys(KPcounter[member.memberId]).includes(
                  alphaMember.memberId
                )
              ) {
                KP -= KPcounter[member.memberId][alphaMember.memberId];
              }
            });
            bravoMembers.forEach((bravoMember) => {
              if (
                Object.keys(KPcounter).includes(member.memberId) &&
                Object.keys(KPcounter[member.memberId]).includes(
                  bravoMember.memberId
                )
              ) {
                KP += KPcounter[member.memberId][bravoMember.memberId];
              }
            });
            // maxKP更新
            if (maxKP < KP) {
              maxKP = KP;
              maxMember = member;
            }
          });
          if (maxMember !== undefined) {
            alphaMembers.push({
              playerId: maxMember.Player.playerId,
              playerName: maxMember.Player.playerName,
              memberId: maxMember.memberId,
            });
            console.log("player name: ", maxMember.Player.playerName);
            tempMembers = tempMembers.filter(
              (member) => member.memberId !== maxMember!.memberId
            );
            console.log("tempMembers: ", tempMembers);
          }
        } else {
          tempMembers.forEach((member) => {
            // KPが高ければalphaに入り安いイメージ
            let KP = 0;
            alphaMembers.forEach((alphaMember) => {
              if (
                Object.keys(KPcounter).includes(member.memberId) &&
                Object.keys(KPcounter[member.memberId]).includes(
                  alphaMember.memberId
                )
              ) {
                KP -= KPcounter[member.memberId][alphaMember.memberId];
              }
            });
            bravoMembers.forEach((bravoMember) => {
              if (
                Object.keys(KPcounter).includes(member.memberId) &&
                Object.keys(KPcounter[member.memberId]).includes(
                  bravoMember.memberId
                )
              ) {
                KP += KPcounter[member.memberId][bravoMember.memberId];
              }
            });
            // minKP更新
            if (minKP > KP) {
              minKP = KP;
              minMember = member;
            }
          });
          if (minMember !== undefined) {
            bravoMembers.push({
              playerId: minMember.Player.playerId,
              playerName: minMember.Player.playerName,
              memberId: minMember.memberId,
            });
            console.log("player name: ", minMember.Player.playerName);
            tempMembers = tempMembers.filter(
              (member) => member.memberId !== minMember!.memberId
            );
            console.log("tempMembers: ", tempMembers);
          }
        }
      }
    });
    console.log("end get new team");

    // team分けをDBに登録
    await setTeamLog(bravoMembers, alphaMembers, groupId);
    // team分けをレスポンス
  } catch (error) {
    if (error instanceof Error) {
      console.log("error: ", error.message);
      res.status(500).json({ error: error.message });
      return;
    }
  }

  res.status(200).json({ bravo: bravoMembers, alpha: alphaMembers });
};

export default reroleTeamApi;
