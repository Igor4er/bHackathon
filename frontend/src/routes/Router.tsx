import { PATHNAMES } from "@/constants/routes";
import Home from "@/page/Home";
import Login from "@/page/Login";
import AddQuest from "@/page/AddQuest";
import { Settings } from "@/components/Setting";
import { FC } from "react";
import { useRoutes } from "react-router-dom";

const ROUTES = [
  {
    element: <Login />,
    path: PATHNAMES.LOGIN,
  },
  {
    element: <Home />,
    path: PATHNAMES.HOME,
    children: [
      {
        element: <Settings />,
        path: PATHNAMES.SETTINGS,
      },
    ],
  },
  {
    element: <AddQuest />,
    path: PATHNAMES.ADDQUEST,
  },
];

const AppRoutes: FC = () => {
  return useRoutes(ROUTES);
};

export default AppRoutes;
