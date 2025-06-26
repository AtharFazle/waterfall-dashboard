import { getDashboardData } from "@/service/sensor";
import { useQuery } from "@tanstack/react-query";

const key = 'sensor';

export const useGetDashboardData = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [key],
    queryFn: getDashboardData,
    refetchInterval: 10000, // 10 detik = 10000ms
    refetchIntervalInBackground: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, error };
};

