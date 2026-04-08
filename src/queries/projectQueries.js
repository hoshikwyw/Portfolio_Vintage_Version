import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

const getProjects = async () => {
    // Use the view that joins projects + tags + cover image
    const { data, error } = await supabase
        .from('projects_with_details')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
};

export const useFetchProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    });
};
