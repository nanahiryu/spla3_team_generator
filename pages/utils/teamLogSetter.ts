import { Member, MemberLog } from "../../types/RankCard";
import { supabase } from "../../utils/supabase";

export const setTeamLog = (bravoMembers: Member[], alphaMembers: Member[]) => {
  // team_log_set
  return new Promise(async (resolve, reject) => {
    const { data: data4, error: error4 } = await supabase
      .from("team_log_set")
      .insert({})
      .select();
    if (error4) {
      reject(error4);
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
      reject(error5);
    }
    resolve(membersLog);
  });
};
