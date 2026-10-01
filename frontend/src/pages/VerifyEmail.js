import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import api, { apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, MailCheck } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [state, setState] = useState(token ? "verifying" : "idle"); // idle | verifying | success | error
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  const verify = useCallback(async () => {
    try {
      await api.post("/auth/verify-email", { token });
      await refreshUser();
      setState("success");
    } catch (err) {
      setError(apiError(err));
      setState("error");
    }
  }, [token, refreshUser]);

  useEffect(() => {
    if (token) verify();
  }, [token, verify]);

  const resend = async () => {
    setResending(true);
    try {
      await api.post("/auth/resend-verification");
      toast.success("Verification email sent. Check your inbox.");
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout testid="verify-email-page" title="Email verification">
      {state === "verifying" && (
        <div className="flex flex-col items-center gap-4 py-8" data-testid="verify-loading">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying your email…</p>
        </div>
      )}

      {state === "success" && (
        <div className="space-y-6 animate-fade-up" data-testid="verify-success">
          <Alert className="border-primary/30 bg-primary/5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              Your email is verified. Every FLORAai feature is now unlocked. 🌿
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate(user ? "/dashboard" : "/login")} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-[hsl(103_51%_20%)]" data-testid="verify-continue-button">
            {user ? "Go to dashboard" : "Log in"}
          </Button>
        </div>
      )}

      {state === "error" && (
        <div className="space-y-6 animate-fade-up" data-testid="verify-error">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          {user && typeof user === "object" && (
            <Button onClick={resend} disabled={resending} variant="outline" className="w-full" data-testid="verify-resend-button">
              {resending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Resend verification email
            </Button>
          )}
          <Link to="/login" className="block text-center text-sm font-semibold text-primary hover:underline dark:text-accent">
            Back to login
          </Link>
        </div>
      )}

      {state === "idle" && (
        <div className="space-y-6" data-testid="verify-idle">
          <Alert className="border-primary/20 bg-secondary/40">
            <MailCheck className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              {user && typeof user === "object" ? (
                <>We sent a verification link to <span className="font-semibold">{user.email}</span>. Click it to verify your account.</>
              ) : (
                <>Open the verification link from your email to confirm your account.</>
              )}
            </AlertDescription>
          </Alert>
          {user && typeof user === "object" && (
            <Button onClick={resend} disabled={resending} variant="outline" className="w-full" data-testid="verify-resend-button">
              {resending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Resend verification email
            </Button>
          )}
          <Button onClick={() => navigate(user ? "/dashboard" : "/login")} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-[hsl(103_51%_20%)]" data-testid="verify-skip-button">
            {user ? "Continue to dashboard" : "Back to login"}
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
