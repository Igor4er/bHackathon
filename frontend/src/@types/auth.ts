export enum AuthStatus {
    AUTHORIZED = "authorized",
    UNAUTHORIZED = "unauthorized",
  }

export  interface AuthResponse {
    url: string;
  }
  
  export  interface TokenResponse {
    access_token: string;
  }
  
  export  interface UserData {
    id: string;
    email: string;
    name: string;
  }