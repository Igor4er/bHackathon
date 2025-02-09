// import { Input } from "@/components/ui/input";
import { FC } from "react";
// import GoogleIcon from "@/assets/icon/google.svg";
import { LoginForm } from "../login-form";

// TODO: refactor design

export const Login: FC = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};
