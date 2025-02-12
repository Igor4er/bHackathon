import axios, { isAxiosError } from "axios";
import { AuthResponse, TokenResponse, UserData } from "@/@types/auth";
import { PATHNAMES } from "@/constants/routes";
import { NavigateFunction } from "react-router-dom";

export interface EditProfil {
  name: string;
  avatar_url: string;
}

const api = axios.create({
  baseURL: "https://bh-back.ihorcher.com/auth",
  headers: { Accept: "application/json" },
});

const getStoredAccessToken = (): string => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Access token is missing");
  return token;
};

export const getAuthEmail = async (email: string): Promise<AuthResponse> => {
  try {
    const { data } = await api.post("/em/send", null, { params: { email } });
    return data;
  } catch (error: unknown) {
    let message = "Failed to fetch email auth data";
    if (isAxiosError(error))
      message += `: ${error.response?.data?.detail || error.message}`;
    throw new Error(message);
  }
};

export const getAccessTokenEmail = async (
  code: string,
  state: string,
): Promise<TokenResponse> => {
  try {
    const { data } = await api.get("/em/token", { params: { code, state } });
    return data;
  } catch (error: unknown) {
    let message = "Failed to fetch email access token";
    if (isAxiosError(error))
      message += `: ${error.response?.data || error.message}`;
    throw new Error(message);
  }
};

export const handleAuthRedirectEmail = async (
  code: string,
  state: string,
  navigate: NavigateFunction,
): Promise<UserData | null> => {
  try {
    const { access_token } = await getAccessTokenEmail(code, state);
    localStorage.setItem("access_token", access_token);
    const userData = await getUserData(access_token);
    navigate(PATHNAMES.HOME);
    return userData;
  } catch (error: unknown) {
    console.error("Authentication failed:", error);
    return null;
  }
};

const getAuthData = async (
  provider: "gh" | "google",
): Promise<AuthResponse> => {
  try {
    const { data } = await api.get(`/${provider}/link`);
    return data;
  } catch (error: unknown) {
    let message = `Failed to fetch ${provider} auth data`;
    if (isAxiosError(error))
      message += `: ${error.response?.data || error.message}`;
    throw new Error(message);
  }
};

const getAccessToken = async (
  code: string,
  state: string,
  provider: "gh" | "google",
): Promise<TokenResponse> => {
  try {
    const { data } = await api.get(`/${provider}/token`, {
      params: { code, state },
    });
    return data;
  } catch (error: unknown) {
    let message = "Failed to fetch access token";
    if (isAxiosError(error))
      message += `: ${error.response?.data || error.message}`;
    throw new Error(message);
  }
};

export const getUserData = async (accessToken: string): Promise<UserData> => {
  try {
    const { data } = await api.get("/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  } catch (error: unknown) {
    let message = "Failed to fetch user data";
    if (isAxiosError(error))
      message += `: ${error.response?.data || error.message}`;
    throw new Error(message);
  }
};

export const loginWithProvider = async (
  provider: "gh" | "google",
): Promise<void> => {
  try {
    const state = `oauth:${Math.random().toString(36).substring(7)}`;
    localStorage.setItem("state", state);
    localStorage.setItem("provider", provider);
    const { url } = await getAuthData(provider);
    if (!url) throw new Error("Authentication URL is undefined");
    window.location.href = url;
  } catch (error: unknown) {
    let message = `${provider} login failed`;
    if (isAxiosError(error))
      message += `: ${error.response?.data || error.message}`;
    throw new Error(message);
  }
};

export const handleAuthRedirect = async (
  code: string,
  state: string,
  navigate: NavigateFunction,
): Promise<UserData | null> => {
  const provider = localStorage.getItem("provider") as "gh" | "google";
  if (!code || !state || !provider) return null;
  try {
    const { access_token } = await getAccessToken(code, state, provider);
    localStorage.setItem("access_token", access_token);
    localStorage.removeItem("provider");
    const userData = await getUserData(access_token);
    navigate(PATHNAMES.HOME);
    return userData;
  } catch (error: unknown) {
    console.error("Authentication failed:", error);
    return null;
  }
};

export const loginWithGitHub = () => loginWithProvider("gh");
export const loginWithGoogle = () => loginWithProvider("google");

export const updateUser = async (data: EditProfil): Promise<UserData> => {
  try {
    const accessToken = getStoredAccessToken();
    const { data: responseData } = await api.patch("/profile", data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return responseData;
  } catch (error: unknown) {
    let message = "Failed to update user data";
    if (isAxiosError(error))
      message += `: ${error.response?.data?.detail || error.message}`;
    throw new Error(message);
  }
};
