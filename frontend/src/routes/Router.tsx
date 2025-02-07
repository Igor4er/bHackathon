import { PATHNAMES } from "@/constants/routes";
import Home from "@/page/Home";
import Login from "@/page/Login";
import { FC } from "react";
import { useRoutes } from 'react-router-dom';

const ROUTES = [
    {
        element: <Login />,
        path: PATHNAMES.LOGIN
    },
    {
        element: <Home />,
        path: PATHNAMES.HOME
    },
]

const AppRoutes: FC = () => {
    return useRoutes(ROUTES)
}

export default AppRoutes;