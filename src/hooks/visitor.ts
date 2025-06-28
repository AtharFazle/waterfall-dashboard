import { checkInVisitor, checkOutVisitor, getVisitorData, getVisitorDataDaily, getVisitorDataHourly } from "@/service/visitor";
import { useMutation, useQuery } from "@tanstack/react-query";

export const visitorKey = "visitor";

export const useGetVisitorData = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [visitorKey],
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
    queryKey: [visitorKey,'/hourly'],
    queryFn: getVisitorDataHourly,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, error };
}

export const useGetVisitorDataDaily = () => {
  const query = useQuery({
    queryKey: [visitorKey,'/daily'],
    queryFn: getVisitorDataDaily,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return query;
}


export const useCheckInVisitor = () => {
  const mutation = useMutation({
    mutationKey: [visitorKey],
    mutationFn: checkInVisitor,
  })

  return mutation
}

export const useCheckOutVisitor = () => {
  const mutation = useMutation({
    mutationKey: [visitorKey],
    mutationFn: checkOutVisitor,
  })

  return mutation
}