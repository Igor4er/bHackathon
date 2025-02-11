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
  getAuthEmail,
  handleAuthRedirectEmail
} from "@/services/api-login";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state) {
      const extractedAuthType = state.split(":")[0];

      const handleOAuthRedirect = async () => {
        try {
          if (extractedAuthType === "email") {
            await handleAuthRedirectEmail(code, state, navigate);
          } else {
            await handleAuthRedirect(code, state, navigate);
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }
      };

      handleOAuthRedirect();
    }
  }, [location.search, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await getAuthEmail(email);
    setShowDialog(true);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center">
          <GalleryVerticalEnd className="size-6 mx-auto" />
          <h1 className="text-xl font-bold">Welcome back</h1>
        </div>

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
        <Button type="submit" className="w-full">Login</Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button variant="outline" className="w-full" onClick={loginWithGitHub}>
            <img src={GitHubIcon} className="w-6 h-6" alt="GitHub" />
            Continue with GitHub
          </Button>
          <Button variant="outline" className="w-full" onClick={loginWithGoogle}>
            <img src={GoogleIcon} className="w-6 h-6" alt="Google" />
            Continue with Google
          </Button>
        </div>
      </form>

      {showDialog && (
        <AlertDialog open onOpenChange={(open) => setShowDialog(open)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Check Your Email</AlertDialogTitle>
              <AlertDialogDescription>
                We’ve sent you a link by email. Please check your inbox or spam folder.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDialog(false)}>
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
