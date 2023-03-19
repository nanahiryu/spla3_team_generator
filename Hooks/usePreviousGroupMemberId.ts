import { Dispatch, SetStateAction } from "react";
import { supabase } from "../utils/supabase";
import { RankStateType } from "../types/RankCard";

export const usePreviousGroupMemberSet = (
  groupId: string,
  setRankStateList: Dispatch<SetStateAction<RankStateType[]>>
) => {
  const fetchPreviousGroupMembers = async () => {
    try {
      // team_log_setから最新のuuidを取得
      const { data: data1, error: error1 } = await supabase
        .from("team_log_set")
        .select("uuid")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false })
        .limit(1);
      if (error1) throw error1;
      // team_member_logからmember_idのリストを取得
      const { data: data2, error: error2 } = await supabase
        .from("team_member_log")
        .select("member_id")
        .eq("team_set_id", data1![0].uuid);
      if (error2) throw error2;
      // group_members_with_ranksからmember_idのリストに含まれるuser_nameを取得
      const { data: data3, error: error3 } = await supabase
        .from("group_members_with_ranks")
        .select()
        .in(
          "uuid",
          data2!.map((member) => member.member_id)
        );
      if (error3) throw error3;
      setRankStateList((prev) => {
        return prev.map((rankState) => {
          return {
            ...rankState,
            userList: data3!
              .filter((member) => member.rank_id === rankState.uuid)
              .map((member) => member.user_name ?? ""),
          };
        });
      });
      return;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      } else {
        return Error("unknown error");
      }
    }
  };

  return { fetchPreviousGroupMembers };
};
