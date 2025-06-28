"use client"

import { apiClient } from "@/lib/axios";
import { CheckInVisitor, Visitor, VisitorHourly } from "@/types/visitor";

// interface Store

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

export const checkInVisitor = async (data:CheckInVisitor) => {
  const formattedData = {
    ticker_number: Math.floor(Math.random() * 10000),
    name: data.name,
    amount: data.amount,
   check_in_time: formatDateToMySQL(new Date()),
  }
  const response = await apiClient.post(`/visitor-logs`, formattedData);
  return response.data;
};
export const checkOutVisitor = async (visitorId: number) => {
  const response = await apiClient.post(`/visitor-logs/checkout-time/${visitorId}`);
  return response.data;
};


function formatDateToMySQL(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() is 0-based
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}