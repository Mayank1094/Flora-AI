import React, { useState } from "react";
import { Shell, PageHeader } from "@/components/Shell";
import { PasswordInput } from "@/components/PasswordInput";
import { PasswordStrength } from "@/components/PasswordStrength";
import { initials } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import api, { apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, ShieldCheck, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

const EXPERIENCE = ["Beginner", "Home Garden", "Spice Plantation Owner"];
const SPICES = ["Curry Leaf", "Cardamom", "Turmeric", "Black Pepper", "Clove", "Cinnamon", "Tulsi", "Neem", "Mango", "Aloe Vera", "Coconut", "Money Plant"];

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    location: user.location || "",
    experience: user.experience || "",
    spice_interest: user.spice_interest || "",
    bio: user.bio || "",
  });
  const [saving, setSaving] = useState(false);

  const [pw, setPw] = useState({ current_password: "", new_password: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch("/users/me", form);
      setUser(data.user);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await api.patch("/users/me/password", pw);
      toast.success("Password changed successfully.");
      setPw({ current_password: "", new_password: "" });
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader eyebrow="Account" title="Your profile" description="Manage your personal details and security." />

        <div className="mt-8 flex items-center gap-5 rounded-2xl border border-primary/15 bg-card p-6">
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-2xl font-bold text-accent">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-foreground" data-testid="profile-name">{user.name}</h2>
              {user.role === "admin" && (
                <Badge className="rounded-full bg-primary text-accent"><ShieldCheck className="mr-1 h-3 w-3" /> Admin</Badge>
              )}
            </div>
            <p className="text-muted-foreground" data-testid="profile-email">{user.email}</p>
            <Badge variant={user.email_verified ? "default" : "secondary"} className={`mt-2 rounded-full ${user.email_verified ? "bg-primary/10 text-primary" : ""}`} data-testid="profile-verified-badge">
              <BadgeCheck className="mr-1 h-3 w-3" /> {user.email_verified ? "Email verified" : "Email not verified"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="details" className="mt-8">
          <TabsList data-testid="profile-tabs">
            <TabsTrigger value="details" data-testid="tab-details">Personal details</TabsTrigger>
            <TabsTrigger value="security" data-testid="tab-security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle className="font-serif">Personal information</CardTitle>
                <CardDescription>Update your name, location and gardening preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveProfile} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={form.name} onChange={set("name")} data-testid="profile-name-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={form.location} onChange={set("location")} placeholder="e.g. Kerala, India" data-testid="profile-location-input" />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Gardening experience</Label>
                      <Select value={form.experience} onValueChange={set("experience")}>
                        <SelectTrigger data-testid="profile-experience-select"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{EXPERIENCE.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Primary spice interest</Label>
                      <Select value={form.spice_interest} onValueChange={set("spice_interest")}>
                        <SelectTrigger data-testid="profile-spice-select"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{SPICES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={form.bio} onChange={set("bio")} placeholder="Tell us about your garden…" rows={3} data-testid="profile-bio-input" />
                  </div>
                  <Button type="submit" disabled={saving} className="rounded-full bg-primary text-primary-foreground hover:bg-[hsl(103_51%_20%)]" data-testid="profile-save-button">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle className="font-serif">Change password</CardTitle>
                <CardDescription>Use a strong password you don’t use elsewhere.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={changePassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current password</Label>
                    <PasswordInput id="current" value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} autoComplete="current-password" testid="current-password-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">New password</Label>
                    <PasswordInput id="new" value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} autoComplete="new-password" testid="new-password-input" />
                    <PasswordStrength password={pw.new_password} />
                  </div>
                  <Button type="submit" disabled={pwSaving} className="rounded-full bg-primary text-primary-foreground hover:bg-[hsl(103_51%_20%)]" data-testid="change-password-button">
                    {pwSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Update password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
