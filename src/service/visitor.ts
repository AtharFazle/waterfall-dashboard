"use client"

import { apiClient } from "@/lib/axios";
import { Visitor, VisitorHourly } from "@/types/visitor";

export const getVisitorData = async () => {
  const response = await apiClient.get<Visitor[]>('/visitor-logs/daily-in');

  // console.log(response?.data,'adad');

  return response.data;
};

export const getVisitorDataDaily = async () => {
  const response = await apiClient.get<Visitor[]>('/visitor-logs/daily');

  return response.data;
}

export const getVisitorDataHourly = async () => {
  const response = await apiClient.get<VisitorHourly[]>('/visitor-logs/hourly');

  // console.log(response?.data,'adad');

  return response.data;
};
