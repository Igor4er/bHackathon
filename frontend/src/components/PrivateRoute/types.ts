import { AuthStatus } from "@/@types/auth";

//! згодом катсомізувати 

export const ONLY_FOR = {
  ...AuthStatus,
} as const;

export type OnlyFor =  AuthStatus;
