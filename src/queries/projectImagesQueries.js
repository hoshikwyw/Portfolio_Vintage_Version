import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

const getProjectImages = async () => {
    const { data, error } = await supabase
        .from('project_images')
        .select(`
            id,
            image_url,
            is_cover,
            show_in_gallery,
            sort_order,
            project_id,
            projects ( id, title, demo_url )
        `)
        .eq('show_in_gallery', true)
        .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
};

export const useFetchProjectImages = () => {
    return useQuery({
        queryKey: ['project_images'],
        queryFn: getProjectImages,
    });
};
