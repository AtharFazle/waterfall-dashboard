import { getWeatherData } from "@/service/cuaca";
import { useQuery } from "@tanstack/react-query";

const key = "cuaca";

export const useGetWeatherData = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [key],
    queryFn: getWeatherData,
    // refetchInterval: 1000000,
    // refetchIntervalInBackground: true,
    staleTime: 10000000,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, error };
};