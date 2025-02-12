import { Home as HomeComponent } from "@/components/Home";
import { FC } from "react";

import { PageWrapper } from "@/components/Layouts/PageWrapper";
import { Outlet } from "react-router-dom";

const Home: FC = () => {
  return (
    <PageWrapper className="flex flex-col gap-10">
      <HomeComponent />
      <Outlet />
    </PageWrapper>
  );
};
export default Home;
