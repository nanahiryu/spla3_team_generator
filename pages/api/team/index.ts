import type { NextApiRequest, NextApiResponse } from "next";
import { Player } from "../../../types/RankCard";
import { ReqTeamGrouping } from "../../../types/request/Team";
import { RespTeamGrouping } from "../../../types/response/Team";
import { supabase } from "../../../utils/supabase";

const teamApi = (
  request: NextApiRequest,
  response: NextApiResponse<RespTeamGrouping>
) => {
  const bravoMembers: Player[] = [];
  const alphaMembers: Player[] = [];
  // insertUserを定義
  const insertUser = async (newName: string) => {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: newName,
        },
      ])
      .select();
    return { data, error };
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
  const getNewMembers = async (members: ReqTeamGrouping) => {
    const newMembers = members.RankMembers.map((rank) => {
      rank.userList.map((user) => {
        if (user.playerId === "") {
          insertUser(user.playerName)
            .then((res) => {
              if (res.data && res.data.length > 0) {
                console.log("inserted user:", res.data[0].uuid);
                return {
                  playerId: res.data[0].uuid,
                  playerName: user.playerName,
                };
              }
            })
            .catch((err) => {
              response.status(500).json({ error: err.message });
            });
        }
      });
    });
    console.log("new members:", newMembers);
    return newMembers;
  };

  // requestからbodyを取得
  const members: ReqTeamGrouping = request.body;
  // uuid === ""の時usersテーブルにレコード追加
  getNewMembers(members).then((res) => {
    console.log("test:", res);
  });

  // team_logから過去最大8回分のデータを取得
  fetchTeamMemberLogLimit8().then((res) => {
    if (res.error) {
      response.status(500).json({ error: res.error.message });
      return;
    }
    if (res.data && res.data.length > 0) {
      console.log("team member log:", res.data);
    }
  });

  members.RankMembers.forEach((rank) => {
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
  response.status(200).json({ bravo: bravoMembers, alpha: alphaMembers });
};

export default teamApi;
