import { FC, ReactNode } from "react";
import { ONLY_FOR, OnlyFor } from "./types";

interface Props {
  children: ReactNode;
  onlyFor: OnlyFor;
}

export const Show: FC<Props> = ({ children, onlyFor }) => {
  // TODO: Отримати статус авторизації користувача після додавання запиту
  const isAuthorized = false; // Тимчасова заглушка

  if (onlyFor === ONLY_FOR.AUTHORIZED && isAuthorized) return <>{children}</>;

  if (onlyFor === ONLY_FOR.UNAUTHORIZED && !isAuthorized) return <>{children}</>;

  return null;
};
