import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { setupInterceptors } from "../api/axios";

import {
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const tokenRef = useRef(null);

  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  const getAccessToken = () => tokenRef.current;

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const cleanup = setupInterceptors(
      getAccessToken,
      setAccessToken,
      logout
    );

    const initializeAuth = async () => {
      try {
        const data = await refreshAccessToken();

        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return cleanup;
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    setAccessToken(data.accessToken);
    setUser(data.user);

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);