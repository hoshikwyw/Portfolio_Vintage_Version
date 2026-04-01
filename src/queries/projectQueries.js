import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

const getProjects = async () => {
      const { data, error } = await supabase.from('Projects').select('*');
      if (error) throw new Error(error.message);
      return data;
    };

export const useFetchProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: getProjects
    })
}
