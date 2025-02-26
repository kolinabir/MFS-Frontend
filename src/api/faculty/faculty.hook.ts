import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const getFaculties = async () => {
  return await axios.get("https://digital-sig.vercel.app/faculties");
};

export const useGetFaculties = () => {
  const facultiesData = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
    select: (data) => {
      return data.data.data;
    },
    gcTime: 5000,
  });
  return facultiesData;
};
