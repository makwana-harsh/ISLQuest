import api from "./axios";

export const getMyProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

export const updateMyProfile = async (formData) => {
  const response = await api.put("/profile", formData);
  return response.data;
};