import { supabase } from "../utils/supabase";

export const useCreateGroup = () => {
  const createGroup = async (groupName: string) => {
    const { data, error } = await supabase
      .from("groups")
      .insert([{ name: groupName }])
      .select();
    return { data: data, error: error };
  };
  return { createGroup };
};
