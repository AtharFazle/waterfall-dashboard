import { apiClient } from "@/lib/axios";


export const login = async ({ email, password }: { email: string; password: string }) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
};

export const logout = async () => {
    const response = await apiClient.post('/logout');
    return response.data;
};