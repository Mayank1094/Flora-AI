import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { PasswordInput } from "@/components/PasswordInput";
import { PasswordStrength } from "@/components/PasswordStrength";
import api, { apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("This reset link is missing its token. Please request a new one.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      testid="reset-password-page"
      title={done ? "Password updated" : "Set a new password"}
      subtitle={done ? undefined : "Choose a strong password you haven’t used before."}
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline dark:text-accent" data-testid="reset-login-link">
          Back to login
        </Link>
      }
    >
      {done ? (
        <div className="space-y-6 animate-fade-up" data-testid="reset-success">
          <Alert className="border-primary/30 bg-primary/5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              Your password has been reset. You can now log in with your new password.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/login")} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90" data-testid="reset-goto-login">
            Log in now
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          {error && (
            <Alert variant="destructive" data-testid="reset-error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" autoComplete="new-password" testid="reset-password-input" />
            <PasswordStrength password={password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm new password</Label>
            <PasswordInput id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter new password" autoComplete="new-password" testid="reset-confirm-input" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90" data-testid="reset-submit-button">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Updating…" : "Reset password"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
