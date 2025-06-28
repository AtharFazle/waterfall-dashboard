"use client"

import { apiClient } from "@/lib/axios";
import { Sensor } from "@/types/sensor";

export const getDashboardData = async () => {
  const response = await apiClient.get<Sensor>('/sensor-logs/latest');

  // console.log(response?.data,'adad');

  return response.data;
};
