import { Home as HomeComponent } from "@/components/Home";
import { FC } from "react";

import { PageWrapper } from "@/components/Layouts/PageWrapper";

const Home: FC = () => {
  return (
    <PageWrapper className="flex flex-col gap-10">
      <HomeComponent />
    </PageWrapper>
  );
};
export default Home;
