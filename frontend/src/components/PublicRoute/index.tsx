import { Navigate, Outlet } from "react-router-dom";
import { PATHNAMES } from "@/constants/routes";

const PublicRoute = () => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  return isAuthenticated ? <Navigate to={PATHNAMES.HOME} replace /> : <Outlet />;
};

export default PublicRoute;
