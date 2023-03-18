import { Dispatch, SetStateAction } from "react";
import { supabase } from "../utils/supabase";

export const useGroupName = (
  groupId: string,
  setGroupName: Dispatch<SetStateAction<string | undefined>>
) => {
  const fetchGroupName = async () => {
    try {
      const { data, error } = await supabase
        .from("groups")
        .select("name")
        .eq("uuid", groupId)
        .single();
      if (error) throw error;
      if (data.name) setGroupName(data.name);
    } catch (error) {
      if (error instanceof Error) {
        return error;
      } else {
        return Error("unknown error");
      }
    }
  };

  return { fetchGroupName };
};
