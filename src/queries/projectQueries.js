import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

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

// Fetch project by ID
export const fetchProjectById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching project:", err.message);
    return null;
  }
};
