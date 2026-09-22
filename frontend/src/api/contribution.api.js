import api from "./axios";

export const getContributions = async (page = 1, limit = 6) => {
  const { data } = await api.get(`/contribution?page=${page}&limit=${limit}`);
  return data;
};

export const getContribution = async (contributionId) => {
  const { data } = await api.get(`/contribution/${contributionId}`);
  return data;
};

export const submitContribution = async (formData) => {
  const { data } = await api.post("/contribution", formData);
  return data;
};