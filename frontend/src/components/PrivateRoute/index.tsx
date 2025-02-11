import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { PATHNAMES } from "@/constants/routes";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("access_token")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("access_token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return isAuthenticated ? <Outlet /> : <Navigate to={PATHNAMES.LOGIN} replace />;
};

export default PrivateRoute;
