import { PostgrestResponse } from "@supabase/supabase-js";
import { resolve } from "path";
import React, { useEffect, useState } from "react";
import { TeamData } from "../pages/generator/[groupId]";
import { Player } from "../types/RankCard";
import { RankMembers, ReqTeamGrouping } from "../types/request/Team";
import { RespTeamGrouping } from "../types/response/Team";
import { supabase } from "../utils/supabase";

type GenerateTeamProps = {
  setTeamData: React.Dispatch<React.SetStateAction<TeamData | undefined>>;
  groupId: string | string[] | undefined;
};

type TeamName = {
  uuid: string;
  name: string;
}

export const useGenerateTeam = ({
  setTeamData,
  groupId,
}: GenerateTeamProps) => {
  const [teams, setTeams] = useState<RespTeamGrouping>();
  const [newMembers, setNewMembers] = useState<RankMembers[]>([]);
  const [prevMatchingData, setPrevMatchingData] =
    useState<{ uuid: string; team_log_id: string }[]>();
  const [newTeam, setNewTeam] = useState<RespTeamGrouping>();
  const [teamsNameData, setTeamsNameData] = useState<TeamName[]>();
  useEffect(() => {
    const getTeamsName = async () => {
      const res = await supabase
        .from("teams")
        .select("*");
      if (res.data) {
        setTeamsNameData(res.data);
      }
    };
    getTeamsName();
  }, [teams]);
  // insertUserを定義
  const insertUser = (
    newName: string
  ): Promise<
    PostgrestResponse<{
      name: string;
      uuid: string;
    }>
  > => {
    return new Promise((resolve) => {
      supabase
        .from("users")
        .insert([
          {
            name: newName,
          },
        ])
        .select()
        .then((res) => {
          resolve(res);
        });
    });
  };

  // ランダムな整数を返す
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  // insertGroupMembersを定義
  const insertGroupMembers = (
    newMemberUuid: string,
    groupId: string
  ): Promise<
    PostgrestResponse<{
      group_id: string;
      user_id: string;
      uuid: string;
    }>
  > => {
    return new Promise((resolve) => {
      supabase
        .from("group_members")
        .insert([
          {
            user_id: newMemberUuid,
            group_id: groupId,
          },
        ])
        .select()
        .then((res) => {
          resolve(res);
        });
    });
  };

  // insertTeamLogSetを定義
  const insertTeamLogSet = (): Promise<
    PostgrestResponse<{
      uuid: string;
      created_at: string;
    }>
  > => {
    return new Promise((resolve) => {
      supabase
        .from("team_log_set")
        .insert({ created_at: new Date().toISOString().toLocaleString() })
        .select()
        .then((res) => {
          resolve(res);
        });
    });
  };

  const insertTeamLog = (
    teamId: string,
    teamSetId: string
  ): Promise<
    PostgrestResponse<{
      team_id: string;
      team_set_id: string;
      uuid: string;
    }>
  > => {
    return new Promise((resolve) => {
      supabase
        .from("team_log")
        .insert({ team_id: teamId, team_set_id: teamSetId })
        .select()
        .then((res) => {
          resolve(res);
        });
    });
  };

  const insertTeamMemberLog = (
    memberId: string,
    teamLogId: string
  ): Promise<
    PostgrestResponse<{
      uuid: string;
      member_id: string;
      team_log_id: string;
    }>
  > => {
    return new Promise((resolve) => {
      supabase
        .from("team_member_log")
        .insert({ member_id: memberId, team_log_id: teamLogId })
        .select()
        .then((res) => {
          resolve(res);
        });
    });
  };

  const createNewMembers = async (newName: string, groupId: string) => {
    const res = await insertUser(newName);
    if (res.data) {
      const res2 = await insertGroupMembers(res.data[0].uuid, groupId);
      return (res2.data ?? [])[0].user_id;
    }
  };

  // 過去のマッチングデータから被りポイントを集計
  const matchingCounter = (
    prevMatchingData: { uuid: string; team_log_id: string }[]
  ) => {
    const teamBinder: { [key: string]: string[] } = {};
    prevMatchingData.forEach((data) => {
      // team_log_idが同じものを配列にまとめる
      if (teamBinder[data.team_log_id]) {
        teamBinder[data.team_log_id].push(data.uuid);
      } else {
        teamBinder[data.team_log_id] = [data.uuid];
      }
    });
    const counter: { [key: string]: { [key: string]: number } } = {};
    // counterに被りポイントを集計
    Object.keys(teamBinder).forEach((key) => {
      teamBinder[key].forEach((uuid) => {
        teamBinder[key].forEach((uuid2) => {
          if (uuid === uuid2) {
            return;
          }
          if (counter[uuid]) {
            if (counter[uuid][uuid2]) {
              counter[uuid][uuid2] += 1;
            } else {
              counter[uuid][uuid2] = 1;
            }
          } else {
            counter[uuid] = {};
            counter[uuid][uuid2] = 1;
          }
        });
      });
    });
    return counter;
  };

  // fetchTeamMemberLogLimit8を定義
  const fetchTeamMemberLogLimit8 = async () => {
    // team_log_setから過去最大8回分のデータを取得
    const { data: teamLogSetData, error: teamLogSetDataErr } = await supabase
      .from("team_log_set")
      .select("uuid")
      .order("created_at", { ascending: false })
      .limit(8);
    if (teamLogSetDataErr) {
      return { data: null, error: teamLogSetDataErr };
    }
    // team_logから過去最大8回分のデータを取得
    const { data: teamLogData, error: teamLogDataErr } = await supabase
      .from("team_log")
      .select(`uuid`)
      .in(
        "team_set_id",
        (teamLogSetData ?? []).map((set) => set.uuid)
      );
    if (teamLogDataErr) {
      return { data: null, error: teamLogDataErr };
    }
    // team_member_logから過去最大8回分のデータを取得
    const { data: teamMemberLogData, error: teamMemberLogDataErr } =
      await supabase
        .from("team_member_log")
        .select(`uuid, team_log_id`)
        .in(
          "team_log_id",
          (teamLogData ?? []).map((log) => log.uuid)
        );
    if (teamMemberLogDataErr) {
      return { data: null, error: teamMemberLogDataErr };
    }
    return { data: teamMemberLogData, error: null };
  };

  const getNewTeamData = (ReqTeamGrouping: ReqTeamGrouping) => {
    // userテーブルにレコード追加
    // newMembersにデータを入れる
    setNewMembers(
      ReqTeamGrouping.RankMembers.map((rank) => {
        return {
          rankId: rank.rankId,
          rankName: rank.rankName,
          userList: rank.userList.map((player) => {
            if (player.playerId === "" && typeof groupId === "string") {
              createNewMembers(player.playerName, groupId).then((uuid) => {
                if (uuid) {
                  player.playerId = uuid;
                }
              });
            }
            return { playerId: player.playerId, playerName: player.playerName };
          }),
        };
      })
    );
    console.log("new member", newMembers);

    // 過去のデータを取得
    fetchTeamMemberLogLimit8().then((res) => {
      console.log("res", res);
      if (res.error) {
        console.log(res.error);
        return;
      }
      setPrevMatchingData(res.data);
    });
    console.log("prev data", prevMatchingData);

    // 被り排除のロジック
    const bravoMembers: Player[] = [];
    const alphaMembers: Player[] = [];
    // 初回(prevMathingData.length === 0)
    if (prevMatchingData?.length === 0) {
      newMembers.forEach((rank) => {
        rank.userList.forEach((user) => {
          // uuid
          if (bravoMembers.length <= alphaMembers.length) {
            bravoMembers.push({
              playerId: user.playerId,
              playerName: user.playerName,
            });
          } else {
            alphaMembers.push({
              playerId: user.playerId,
              playerName: user.playerName,
            });
          }
        });
      });
    } else if (prevMatchingData) {
      // 2回目以降
      // prevMatchingDataの集計
      const counter = matchingCounter(prevMatchingData);
      // 集計結果からチームを決定
      newMembers.forEach((rank) => {
        let tempUserList = rank.userList;
        if (alphaMembers.length === 0) {
          const randInt = getRandomInt(tempUserList.length);
          alphaMembers.push({
            playerId: tempUserList[randInt].playerId,
            playerName: tempUserList[randInt].playerName,
          });
          tempUserList.splice(randInt, 1);
        }
        while (tempUserList.length > 0) {
          let minKP = 1000;
          let indexForSplice = 0;
          let minKPUUID = "";
          let minKPUserName = "";
          if (bravoMembers.length <= alphaMembers.length) {
            // bravoMembersに入れる
            tempUserList.forEach((user, i) => {
              let KP = 0;
              bravoMembers.forEach((bravo) => {
                KP += counter[user.playerId][bravo.playerId];
              });
              if (KP < minKP) {
                minKP = KP;
                indexForSplice = i;
                minKPUUID = user.playerId;
                minKPUserName = user.playerName;
              }
            });
            bravoMembers.push({
              playerId: minKPUUID,
              playerName: minKPUserName,
            });
            tempUserList.splice(indexForSplice, 1);
          } else {
            tempUserList.forEach((user, i) => {
              let KP = 0;
              alphaMembers.forEach((alpha) => {
                KP += counter[user.playerId][alpha.playerId];
              });
              if (KP < minKP) {
                minKP = KP;
                indexForSplice = i;
                minKPUUID = user.playerId;
                minKPUserName = user.playerName;
              }
            });
            alphaMembers.push({
              playerId: minKPUUID,
              playerName: minKPUserName,
            });
            tempUserList.splice(indexForSplice, 1);
          }
        }
      });
    }
    // team_log_set, team_log, team_member_logにレコード追加
    insertTeamLogSet().then((res) => {
      if (res.error) {
        console.log(res.error);
        return;
      }
      const { uuid: teamLogSetId } = res.data[0];
      insertTeamLog({ team_set_id: teamLogSetId, team_id:  }).then((res) => {
        if (res.error) {
          console.log(res.error);
          return;
        }
        const teamLogId = res.data;
        insertTeamMemberLog(teamLogId).then((res) => {
          if (res.error) {
            console.log(res.error);
            return;
          }
        });
      });
    });

    // newTeamにデータを入れる
    setNewTeam({ alpha: alphaMembers, bravo: bravoMembers, error: null });
    return { alpha: alphaMembers, bravo: bravoMembers, error: null };
  };

  return {
    getNewTeamData,
    newTeam,
  };
};
