import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import api, { apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, MailCheck, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      testid="forgot-password-page"
      title={sent ? "Check your inbox" : "Forgot password?"}
      subtitle={
        sent
          ? undefined
          : "Enter your email and we’ll send you a secure link to reset your password."
      }
      footer={
        <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline dark:text-accent" data-testid="back-to-login-link">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to login
        </Link>
      }
    >
      {sent ? (
        <Alert className="border-primary/30 bg-primary/5 animate-fade-up" data-testid="forgot-success">
          <MailCheck className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground">
            If an account exists for <span className="font-semibold">{email}</span>, a password reset
            link is on its way. The link expires in 1 hour.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          {error && (
            <Alert variant="destructive" data-testid="forgot-error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" data-testid="forgot-email-input" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-[hsl(103_51%_20%)]" data-testid="forgot-submit-button">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
