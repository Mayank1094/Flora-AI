import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shell, PageHeader } from "@/components/Shell";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import api, { apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Save, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({
    scan_detail: user.preferences?.scan_detail || "standard",
    confidence_threshold: user.preferences?.confidence_threshold ?? 60,
    email_digest: user.preferences?.email_digest ?? true,
    theme: user.preferences?.theme || "light",
  });
  const [privacy, setPrivacy] = useState({
    public_profile: user.privacy?.public_profile ?? false,
    share_scans: user.privacy?.share_scans ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch("/users/me", { preferences: prefs, privacy });
      setUser(data.user);
      toast.success("Settings saved.");
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    try {
      const { data } = await api.get("/users/me/export");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "floraai-export.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported.");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/users/me");
      setUser(false);
      toast.success("Your account has been deleted.");
      navigate("/");
    } catch (e) {
      toast.error(apiError(e));
      setDeleting(false);
    }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader eyebrow="Preferences" title="Settings" description="Control how FLORAai analyzes your plants and handles your data." />

        <div className="mt-8 space-y-6">
          <Card className="border-primary/15">
            <CardHeader>
              <CardTitle className="font-serif">Scan preferences</CardTitle>
              <CardDescription>Fine-tune your AI diagnostics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <Label>Scan detail level</Label>
                <Select value={prefs.scan_detail} onValueChange={(v) => setPrefs({ ...prefs, scan_detail: v })}>
                  <SelectTrigger className="w-44" data-testid="scan-detail-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>AI confidence threshold</Label>
                  <span className="font-mono text-sm font-semibold text-primary dark:text-accent" data-testid="confidence-value">{prefs.confidence_threshold}%</span>
                </div>
                <Slider value={[prefs.confidence_threshold]} min={0} max={100} step={5} onValueChange={([v]) => setPrefs({ ...prefs, confidence_threshold: v })} data-testid="confidence-slider" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Theme preference</Label>
                  <p className="text-xs text-muted-foreground">Saved to your account.</p>
                </div>
                <Select value={prefs.theme} onValueChange={(v) => { setPrefs({ ...prefs, theme: v }); setTheme(v); setUser((u) => (u && typeof u === "object" ? { ...u, preferences: { ...u.preferences, theme: v } } : u)); }}>
                  <SelectTrigger className="w-44" data-testid="theme-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/15">
            <CardHeader>
              <CardTitle className="font-serif">Notifications & privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Row label="Email digest" desc="Weekly summary of your plants’ health." checked={prefs.email_digest} onChange={(v) => setPrefs({ ...prefs, email_digest: v })} testid="email-digest-switch" />
              <Row label="Public profile" desc="Allow others to view your grower profile." checked={privacy.public_profile} onChange={(v) => setPrivacy({ ...privacy, public_profile: v })} testid="public-profile-switch" />
              <Row label="Share anonymised scans" desc="Help improve regional outbreak detection." checked={privacy.share_scans} onChange={(v) => setPrivacy({ ...privacy, share_scans: v })} testid="share-scans-switch" />
            </CardContent>
          </Card>

          <Button onClick={save} disabled={saving} className="rounded-full bg-primary text-primary-foreground hover:bg-[hsl(103_51%_20%)]" data-testid="settings-save-button">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save settings
          </Button>

          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="font-serif text-destructive">Data & account</CardTitle>
              <CardDescription>Export your data or permanently delete your account.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" onClick={exportData} className="rounded-full" data-testid="settings-export-button">
                <Download className="mr-2 h-4 w-4" /> Export my data
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="rounded-full" data-testid="delete-account-button">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent data-testid="delete-account-dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes your profile and sign-in access. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="cancel-delete-button">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAccount} disabled={deleting} className="bg-destructive hover:bg-destructive/90" data-testid="confirm-delete-button">
                      {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function Row({ label, desc, checked, onChange, testid }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} data-testid={testid} />
    </div>
  );
}
