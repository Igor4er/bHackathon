import axios from "axios";
import { AuthResponse, TokenResponse, UserData } from "@/@types/auth";
import { PATHNAMES } from "@/constants/routes";
import { NavigateFunction } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:8000/auth",
  headers: { Accept: "application/json" },
});

export const getAuthEmail = async (email: string): Promise<AuthResponse> => {
  try {
    const { data } = await api.post(`/em/send`, null, { params: { email } });
    return data;
  } catch (error) {
    console.error("Failed to fetch email auth data:", error);
    throw new Error("Failed to fetch email auth data");
  }
};

export const getAccessTokenEmail = async (
  code: string,
  state: string
): Promise<TokenResponse> => {
  try {
    const { data } = await api.get(`/em/token`, { params: { code, state } });
    return data;
  } catch (error) {
    console.error("Failed to fetch email access token:", error);
    throw new Error("Failed to fetch email access token");
  }
};

export const handleAuthRedirectEmail = async (
  code: string,
  state: string,
  navigate: NavigateFunction
): Promise<UserData | null> => {
  try {
    const { access_token } = await getAccessTokenEmail(code, state);
    localStorage.setItem("access_token", access_token);
    const userData = await getUserData(access_token);
    navigate(PATHNAMES.HOME);
    return userData;
  } catch (error) {
    console.error("Authentication failed:", error);
    return null;
  }
};

const getAuthData = async (provider: "gh" | "google"): Promise<AuthResponse> => {
  try {
    const { data } = await api.get(`/${provider}/link`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${provider} auth data:`, error);
    throw new Error(`Failed to fetch ${provider} auth data`);
  }
};

const getAccessToken = async (
  code: string,
  state: string,
  provider: "gh" | "google"
): Promise<TokenResponse> => {
  try {
    const { data } = await api.get(`/${provider}/token`, { params: { code, state } });
    return data;
  } catch (error) {
    console.error("Failed to fetch access token:", error);
    throw new Error("Failed to fetch access token");
  }
};

const getUserData = async (accessToken: string): Promise<UserData> => {
  try {
    const { data } = await api.get("/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data");
  }
};

export const loginWithProvider = async (provider: "gh" | "google"): Promise<void> => {
  try {
    const state = `oauth:${Math.random().toString(36).substring(7)}`;
    localStorage.setItem("state", state);
    localStorage.setItem("provider", provider);
    const { url } = await getAuthData(provider);
    if (!url) throw new Error("Authentication URL is undefined");
    window.location.href = url;
  } catch (error) {
    console.error(`${provider} login failed:`, error);
    throw error;
  }
};

export const handleAuthRedirect = async (
  code: string,
  state: string,
  navigate: NavigateFunction
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
  } catch (error) {
    console.error("Authentication failed:", error);
    return null;
  }
};

export const loginWithGitHub = () => loginWithProvider("gh");
export const loginWithGoogle = () => loginWithProvider("google");
