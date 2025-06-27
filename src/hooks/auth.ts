
'use client'
import { login } from "@/service/auth";
import { useMutation, useQuery } from "@tanstack/react-query";

const key = 'auth';

export const useLogin = () => {
  const mutation = useMutation({
    mutationKey: [key],
    mutationFn: login,
    // Hapus onSuccess dari sini karena tidak bisa akses component state
  });

  return mutation;
};
