import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, History, User, Settings, Shield, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/#spices", label: "Explore Spices" },
  { to: "/#how", label: "How It Works" },
];

export function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      data-testid="theme-toggle"
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 text-foreground/70 transition-colors hover:bg-secondary ${className}`}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully.");
    navigate("/");
  };

  const authed = user && typeof user === "object";

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
          <img src="/logo.png" alt="FLORAai logo" className="h-9 w-9 object-contain" />
          <span className="font-serif text-xl font-bold tracking-tight text-primary dark:text-accent">
            FLORA<span className="text-[hsl(14_63%_44%)]">ai</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {publicLinks.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary dark:hover:text-accent"
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.label}
            </a>
          ))}
          {authed && (
            <Link
              to="/dashboard"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary dark:hover:text-accent"
              data-testid="nav-link-dashboard"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {!authed ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                data-testid="nav-login-btn"
                className="hover:bg-secondary"
              >
                Log in
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                data-testid="nav-signup-btn"
                className="rounded-full bg-primary text-primary-foreground hover:bg-[hsl(103_51%_20%)]"
              >
                Get Started
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-secondary"
                  data-testid="user-menu-trigger"
                >
                  <Avatar className="h-8 w-8 border border-primary/20">
                    <AvatarFallback className="bg-primary text-xs font-semibold text-accent">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[120px] truncate text-sm font-medium">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60" data-testid="user-menu-content">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")} data-testid="menu-dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/history")} data-testid="menu-history">
                  <History className="mr-2 h-4 w-4" /> Scan History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")} data-testid="menu-profile">
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} data-testid="menu-settings">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} data-testid="menu-admin">
                    <Shield className="mr-2 h-4 w-4" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                  data-testid="menu-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72" data-testid="mobile-menu">
              <div className="mt-8 flex flex-col gap-1">
                {authed && (
                  <div className="mb-4 flex items-center gap-3 rounded-xl bg-secondary p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-accent">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}
                {publicLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium">
                  <span>Appearance</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium">
                  <span>Appearance</span>
                  <ThemeToggle />
                </div>
                {authed ? (
                  <>
                    <MobileItem to="/dashboard" setOpen={setOpen} navigate={navigate} icon={LayoutDashboard} label="Dashboard" />
                    <MobileItem to="/history" setOpen={setOpen} navigate={navigate} icon={History} label="Scan History" />
                    <MobileItem to="/profile" setOpen={setOpen} navigate={navigate} icon={User} label="Profile" />
                    <MobileItem to="/settings" setOpen={setOpen} navigate={navigate} icon={Settings} label="Settings" />
                    {user.role === "admin" && (
                      <MobileItem to="/admin" setOpen={setOpen} navigate={navigate} icon={Shield} label="Admin Panel" />
                    )}
                    <Button
                      variant="outline"
                      className="mt-3 w-full"
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      data-testid="mobile-logout-btn"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign out
                    </Button>
                  </>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                        navigate("/login");
                      }}
                    >
                      Log in
                    </Button>
                    <Button
                      onClick={() => {
                        setOpen(false);
                        navigate("/signup");
                      }}
                      className="bg-primary text-primary-foreground"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

function MobileItem({ to, setOpen, navigate, icon: Icon, label }) {
  return (
    <button
      onClick={() => {
        setOpen(false);
        navigate(to);
      }}
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-secondary"
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-primary text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
              <img src="/logo.png" alt="FLORAai logo" className="h-7 w-7 object-contain" />
            </span>
            <span className="font-serif text-xl font-bold text-accent">
              FLORA<span className="text-[hsl(38_78%_66%)]">ai</span>
            </span>
          </div>
          <p className="max-w-md text-sm text-accent/70">
            AI-powered plant-health diagnostics for Indian subcontinent spice growers — curry leaf,
            cardamom, turmeric, pepper, clove & cinnamon.
          </p>
        </div>
        <div className="mt-8 border-t border-accent/10 pt-6 text-xs text-accent/50">
          © {new Date().getFullYear()} FLORAai. All rights reserved by amrutachari.
        </div>
      </div>
    </footer>
  );
}
