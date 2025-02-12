export enum AuthStatus {
    AUTHORIZED = "authorized",
    UNAUTHORIZED = "unauthorized",
  }


export  interface AuthResponse {
    url?: string;
    status?: string;
    message?: string;
    from_email? : string;
  }
  
  export  interface TokenResponse {
    access_token: string;
  }
  
  export  interface UserData {
      name: string,
      email: string,
      avatar_url: string
  }