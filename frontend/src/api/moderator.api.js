import api from "./axios";

export const getModeratorContributions =
  async ({
    status,
    cursor = null,
  }) => {
    const params = {
      status,
    };

    if (cursor) {
      params.cursor = cursor;
    }

    const { data } = await api.get(
      "/moderator/contributions",
      { params }
    );

    return data;
  };

export const getModeratorContribution =
  async (contributionId) => {
    const { data } = await api.get(
      `/moderator/contributions/${contributionId}`
    );

    return data;
  };

export const reviewModeratorContribution =
  async (
    contributionId,
    data
  ) => {
    const response = await api.patch(
      `/moderator/contributions/${contributionId}`,
      data
    );

    return response.data;
  };

export const blockUser = async (
  mobileNo,
  blockedUntil
) => {
  const { data } = await api.patch(
    "/moderator/users/block",
    {
      mobileNo,
      blockedUntil,
    }
  );

  return data;
};

export const unblockUser = async (
  mobileNo
) => {
  const { data } = await api.patch(
    "/moderator/users/unblock",
    {
      mobileNo,
    }
  );

  return data;
};