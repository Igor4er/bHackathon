import { Input } from "@/components/ui/input";
import { FC } from "react";
import GitHubIcon from "@/assets/icon/github.svg";
import GoogleIcon from "@/assets/icon/google.svg";

// TODO: refactor design 

export const Login: FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Login</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            placeholder="Enter your email"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition duration-150"
          >
            <img src={GitHubIcon} alt="GitHub" className="w-5 h-5" />
            Sign in with GitHub
          </button>

          <button
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg shadow hover:border-gray-400 hover:text-gray-900 transition duration-150"
          >
            <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

