import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

const getProjectImages = async () => {
    const { data, error } = await supabase.from('PrjImages').select('*');
    if (error) throw new Error(error.message);
    return data;
};

export const useFetchProjectImages = () => {
    return useQuery({
        queryKey: ['projectImgs'],
        queryFn: getProjectImages
    })
}
