import { RankStateType } from "../types/RankCard";
import { supabase } from "../utils/supabase";

export const useRanks = (
  setRankStateList: React.Dispatch<React.SetStateAction<RankStateType[]>>
) => {
  const fetchRanks = async () => {
    const { data, error } = await supabase.from("ranks").select();
    return { data: data, error: error };
  };
  const fetchRankStateList = async () => {
    const { data, error } = await fetchRanks();
    if (error) throw error;
    if (data) {
      const newRankStateList = data.map((rank) => {
        return {
          uuid: rank.uuid,
          rankName: rank.name,
          rankColor: rank.rank_color,
          userList: ["", ""],
        };
      });
      setRankStateList(newRankStateList);
    }
  };
  return { fetchRanks, fetchRankStateList };
};
