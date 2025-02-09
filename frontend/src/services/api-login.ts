import { AuthResponse, TokenResponse, UserData } from "@/@types/auth";
import { PATHNAMES } from "@/constants/routes";
import axios from "axios";
import { NavigateFunction } from "react-router-dom";

const BASE_URL = "http://localhost:8000/auth";

export const getAuthEmail = async(email: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/em/send?email=${email}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch email auth data:`, error);
    throw new Error(`Failed to fetch email auth data`);
  }
}

const getAuthData = async (provider: 'gh' | 'google'): Promise<AuthResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/${provider}/link`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${provider} auth data:`, error);
    throw new Error(`Failed to fetch ${provider} auth data`);
  }
};

const getAccessToken = async (
  code: string,
  state: string,
  provider: 'gh' | 'google'
): Promise<TokenResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/${provider}/token`, {
      params: { code, state },
      headers: { accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch access token:`, error);
    throw new Error(`Failed to fetch access token`);
  }
};

const getUserData = async (accessToken: string): Promise<UserData> => {
  try {
    const response = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data");
  }
};

export const loginWithProvider = async (provider: 'gh' | 'google'): Promise<void> => {
  try {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem("state", state);
    localStorage.setItem("provider", provider); 
    const { url } = await getAuthData(provider);
    if (!url) {
      throw new Error("Authentication URL is undefined");
    }
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
//   const storedState = localStorage.getItem("state");
  const provider = localStorage.getItem("provider") as 'gh' | 'google';
  
  if (!code || !state || !provider) {
    return null;
  }

 

  try {
    const { access_token } = await getAccessToken(code, state, provider);
    
    localStorage.removeItem("provider");
    
    localStorage.setItem("access_token", access_token);
    
    const userData = await getUserData(access_token);
    navigate(PATHNAMES.HOME);
    
    return userData;
  } catch (error) {
    console.error("Authentication failed:", error);
    return null;
  }
};

export const loginWithGitHub = () => loginWithProvider('gh');
export const loginWithGoogle = () => loginWithProvider('google');