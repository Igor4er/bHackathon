import { GalleryVerticalEnd } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GitHubIcon from "@/assets/icon/github.svg";
import GoogleIcon from "@/assets/icon/google.svg";
import {
  loginWithGitHub,
  loginWithGoogle,
  handleAuthRedirect,
  getAuthEmail
} from "@/services/api-login";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    console.log("code:", code, "state:", state);

    if (code && state) {
      const handleRedirect = async () => {
        try {
          const userData = await handleAuthRedirect(code, state, navigate);
          if (!userData) {
            // Handle login failure
            console.error("Authentication failed");
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }
      };
      handleRedirect();
    }
  }, [location.search, navigate]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    await getAuthEmail(email);
    // Handle email login logic here
    console.log("Email login:", email);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome back</h1>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" >
              Login
            </Button>
          </div>
          
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => loginWithGitHub()}
              type="button"
            >
              <img src={GitHubIcon} className="w-6 h-6" alt="GitHub" />
              Continue with GitHub
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => loginWithGoogle()}
              type="button"
            >
              <img src={GoogleIcon} className="w-6 h-6" alt="Google" />
              Continue with Google
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}