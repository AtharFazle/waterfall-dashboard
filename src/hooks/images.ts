
'use client'
import { deleteImages, getImages, storeImage, swapOrdering, toggleImagesActive, updateImage } from "@/service/image";
import { useMutation, useQuery } from "@tanstack/react-query";

const key = 'images';

export const useGetIMages = () => {
  const query = useQuery({
    queryKey: [key],
    queryFn: getImages,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return query;
};


export const useStoreImages = () => {
  const mutation = useMutation({
    mutationKey: [key],
    mutationFn: storeImage,
  });

  return mutation;
};

export const useSwapOrdering = () => {
  const mutation = useMutation({
    mutationKey: [key],
    mutationFn: swapOrdering,
  });

  return mutation;
};

export const useUpdateImage = () => {
  const mutation = useMutation({
    mutationKey: [key],
    mutationFn: updateImage,
  });

  return mutation;
};

export const useToggleImagesActive = () => {
  const mutation = useMutation({
    mutationKey: [key],
    mutationFn: toggleImagesActive,
  });

  return mutation;
};

export const useDeleteImage = () => {
  const mutation = useMutation({
    mutationKey: [key],
    mutationFn: deleteImages,
  });

  return mutation;
};
