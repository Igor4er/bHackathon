import React from "react";
import { Navigate } from "react-router-dom";
import { PATHNAMES } from "src/constants/routes";
// import { ScreenLoader } from "../Loader/ScreenLoader";
import { ONLY_FOR, OnlyFor } from "./types";

interface Props {
  component: React.FC;
  onlyFor?: OnlyFor;
  redirectUrl?: string;
}

export const PrivateRoute = ({
  component: Component,
  onlyFor = ONLY_FOR.AUTHORIZED,
  redirectUrl = PATHNAMES.LOGIN,
}: Props) => {
  // TODO: Отримати статус авторизації користувача після додавання запиту
  const isAuthorized = false; //! Тимчасова заглушка
  const isLoading = false; //! Заглушка для майбутнього стану завантаження

  const { AUTHORIZED, UNAUTHORIZED } = ONLY_FOR;

  if (isLoading) return ; //<ScreenLoader /> //! додати лоадер

  if (onlyFor === AUTHORIZED && isAuthorized) {
    return <Component />;
  }

  if (onlyFor === UNAUTHORIZED && !isAuthorized) {
    return <Component />;
  }

  return <Navigate to={redirectUrl} replace />;
};
