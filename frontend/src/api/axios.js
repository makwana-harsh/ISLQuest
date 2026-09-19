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

      if (
        error.response?.status === 401 &&
        !originalRequest?._retry &&
        !originalRequest?.url?.includes("/auth/refresh")
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