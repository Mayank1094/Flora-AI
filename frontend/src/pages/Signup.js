import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { PasswordInput } from "@/components/PasswordInput";
import { PasswordStrength } from "@/components/PasswordStrength";
import { useAuth } from "@/context/AuthContext";
import { apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const EXPERIENCE = ["Beginner", "Home Garden", "Spice Plantation Owner"];
const SPICES = ["Curry Leaf", "Cardamom", "Turmeric", "Black Pepper", "Clove", "Cinnamon"];

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    location: "",
    experience: "",
    spice_interest: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in your name, email and password.");
      return;
    }
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirm_password: form.confirm_password,
        location: form.location || null,
        experience: form.experience || null,
        spice_interest: form.spice_interest || null,
      });
      setDone(true);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout testid="signup-success-page" title="You’re all set! 🌿">
        <div className="space-y-6 animate-fade-up" data-testid="signup-success">
          <Alert className="border-primary/30 bg-primary/5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              Your FLORAai account is ready. We’ve sent a verification link to{" "}
              <span className="font-semibold">{form.email}</span>. Verify your email to unlock every
              feature — but you can start scanning right away.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-[hsl(103_51%_20%)]"
            data-testid="goto-dashboard-button"
          >
            Go to my dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/verify-email")} className="w-full" data-testid="goto-verify-button">
            I have a verification code
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      testid="signup-page"
      title="Create your account"
      subtitle="Join growers diagnosing spice-plant health with AI."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline dark:text-accent" data-testid="go-login-link">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <Alert variant="destructive" data-testid="signup-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={form.name} onChange={set("name")} placeholder="Asha Menon" autoComplete="name" data-testid="signup-name-input" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" data-testid="signup-email-input" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" value={form.password} onChange={set("password")} placeholder="Create a strong password" autoComplete="new-password" testid="signup-password-input" />
          <PasswordStrength password={form.password} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <PasswordInput id="confirm" value={form.confirm_password} onChange={set("confirm_password")} placeholder="Re-enter your password" autoComplete="new-password" testid="signup-confirm-input" />
          {form.confirm_password && form.password !== form.confirm_password && (
            <p className="text-xs text-destructive" data-testid="confirm-mismatch">Passwords do not match.</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Optional — tailor your experience
          </p>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs">Location</Label>
              <Input id="location" value={form.location} onChange={set("location")} placeholder="e.g. Kerala, India" data-testid="signup-location-input" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Experience</Label>
                <Select value={form.experience} onValueChange={set("experience")}>
                  <SelectTrigger data-testid="signup-experience-select"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Primary spice</Label>
                <Select value={form.spice_interest} onValueChange={set("spice_interest")}>
                  <SelectTrigger data-testid="signup-spice-select"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {SPICES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-[hsl(103_51%_20%)]" data-testid="signup-submit-button">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to care for your plants responsibly 🌱
        </p>
      </form>
    </AuthLayout>
  );
}
