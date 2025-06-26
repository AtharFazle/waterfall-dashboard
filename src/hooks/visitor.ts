import { getDashboardData } from "@/service/sensor";
import { getVisitorData, getVisitorDataHourly } from "@/service/visitor";
import { useQuery } from "@tanstack/react-query";

const key = "visitor";

export const useGetVisitorData = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [key],
    queryFn: getVisitorData,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, error };
};


export const useGetVisitorDataHourly = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [key,'/hourly'],
    queryFn: getVisitorDataHourly,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, error };
}
