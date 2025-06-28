
'use client'
import { login, logout } from "@/service/auth";
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

export const useLogout = () => {
  const mutation = useMutation({
    mutationKey: [key],
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      window.location.href = '/';
    },
  });

  return mutation;
};

export const isLogin = () => {
  return !!localStorage.getItem('accessToken');
};
