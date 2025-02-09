import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { PATHNAMES } from "@/constants/routes";

const BASE_URL = "http://localhost:8000/auth/gh";

export async function getGithubAuthData() {
  try {
    const response = await axios.get(`${BASE_URL}/link`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch GitHub auth data:", error);
    throw new Error("Failed to fetch GitHub auth data");
  }
}

export async function getAccessToken(code: string, state: string) {
  try {
    const response = await axios.get(`${BASE_URL}/token`, {
      params: { code, state },
      headers: { accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch access token:", error);
    throw new Error("Failed to fetch access token");
  }
}

export async function getUserData(accessToken: string) {
  try {
    const response = await axios.get("http://localhost:8000/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data");
  }
}

export async function loginWithGH() {
  try {
    const { url } = await getGithubAuthData();
    const redirectUrl = `${url}`;
    window.location.href = redirectUrl;
  } catch (error) {
    console.error("GitHub login failed:", error);
  }
}

export async function handleGitHubRedirect(navigate: NavigateFunction) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  console.log("Received state from URL:", state);

  if (code && state) {
    const storedState = localStorage.getItem("state");

    console.log("Stored state:", storedState);

    if (storedState !== state) {
      console.error("State mismatch");
      return null;
    }

    try {
      const { access_token } = await getAccessToken(code, state);
      localStorage.setItem("access_token", access_token);

      const userData = await getUserData(access_token);

      navigate(PATHNAMES.HOME);

      return userData;
    } catch (error) {
      console.error("GitHub login failed:", error);
      return null;
    }
  }

  return null;
}
