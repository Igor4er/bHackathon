// import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
// import Cookies from "js-cookie";
// import { ACCESS_TOKEN, AUTH_REFRESH_TOKEN } from "src/constants/cookiesKeys";
// import { UNAUTHORIZED_STATUS_CODE_401 } from "src/constants/httpStatuses";

// export const isTokenExpired = (token: string) => {


//   //temp
//   return false;
// };

// export const addAccessToken = (config: InternalAxiosRequestConfig) => {
//   const access = Cookies.get(ACCESS_TOKEN);
//   const refresh = Cookies.get(AUTH_REFRESH_TOKEN);

//   const isRefreshTokenExpired = isTokenExpired(refresh);

//   if (access && !isRefreshTokenExpired) {
//     config.headers.Authorization = access;
//   }

//   return config;
// };

// let accessTokenPromise: Promise<string>;

// export const updateAccessToken = async (error: AxiosError) => {
//   if (error.response?.status !== UNAUTHORIZED_STATUS_CODE_401) {
//     return Promise.reject(error);
//   }

//   if (!accessTokenPromise) {
//     accessTokenPromise = fetchAccessToken().then((token) => {
//       accessTokenPromise = null;
//       return token;
//     });
//   }

//   const token = await accessTokenPromise;
//   if (!token) return Promise.reject(error);

//   Cookies.set(ACCESS_TOKEN, token);

//   const config = addAccessToken(error.config);
//   return axios(config);
// };

// const fetchAccessToken = async () => {
//   const refresh = Cookies.get(AUTH_REFRESH_TOKEN);
//   const isRefreshTokenExpired = isTokenExpired(refresh);

//   if (!refresh || isRefreshTokenExpired) return null;

//   try {
//     const { data } = await axios.post<{ access: string }>(
//       "/token/refresh/",
//       { refresh },
//       { baseURL: "" } 
//     );
//     return data.access;
//   } catch (error) {
//     Cookies.remove(ACCESS_TOKEN);
//     Cookies.remove(AUTH_REFRESH_TOKEN);
//     return null;
//   }
// };
