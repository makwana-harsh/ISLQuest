import api from "./axios";

export const getDictionarySigns = async ({page = 1,limit = 20,search = ""}) => {
  const response = await api.get("/dictionary", {
    params: {page,limit,search},
  });
  return response.data;
};

export const getDictionarySignById = async (id) => {
  const response = await api.get(`/dictionary/${id}`);
  return response.data;
};