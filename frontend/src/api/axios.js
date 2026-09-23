import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const setupInterceptors = (
  getAccessToken,
  setAccessToken,
  logout
) => {
  const requestInterceptor = api.interceptors.request.use(
    (config) => {
      const token = getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    }
  );

  const responseInterceptor = api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      // 1. IF BLOCKED: Log out immediately and redirect to /dashboard
      if (
        error.response?.status === 403 &&
        error.response?.data?.message?.includes("blocked")
      ) {
        await logout();
        alert("Your account has been restricted by a moderator. You are now browsing as a guest.");
        window.location.href = "/dashboard";
        return Promise.reject(error);
      }

      // 2. Token refresh logic for 401
      const isAuthEndpoint =
        originalRequest?.url?.includes("/auth/login") ||
        originalRequest?.url?.includes("/auth/register") ||
        originalRequest?.url?.includes("/auth/refresh");

      if (
        error.response?.status === 401 &&
        !originalRequest?._retry &&
        !isAuthEndpoint
      ) {
        originalRequest._retry = true;

        try {
          const { data } = await axios.post(
            "http://localhost:3000/api/auth/refresh",
            {},
            { withCredentials: true }
          );

          setAccessToken(data.accessToken);

          originalRequest.headers.Authorization =
            `Bearer ${data.accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          await logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return () => {
    api.interceptors.request.eject(requestInterceptor);
    api.interceptors.response.eject(responseInterceptor);
  };
};

export default api;