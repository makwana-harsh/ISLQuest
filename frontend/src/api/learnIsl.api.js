import api from "./axios";

export const getLearnModules = async () => {
  const { data } = await api.get("/learn-isl/modules");

  return data;
};

export const getModuleSigns = async (moduleNumber) => {
  const { data } = await api.get(
    `/learn-isl/modules/${moduleNumber}/signs`
  );

  return data;
};

export const getLearnSign = async (signId) => {
  const { data } = await api.get(
    `/learn-isl/signs/${signId}`
  );

  return data;
};

export const generateModuleQuiz = async (
  moduleNumber
) => {
  const { data } = await api.post(
    `/learn-isl/modules/${moduleNumber}/quiz`
  );

  return data;
};

export const submitModuleQuiz = async (
  quizToken,
  answers
) => {
  const { data } = await api.post(
    "/learn-isl/quiz/submit",
    {
      quizToken,
      answers,
    }
  );

  return data;
};