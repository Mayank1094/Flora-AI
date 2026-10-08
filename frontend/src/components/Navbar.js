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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Menu,
  LayoutDashboard,
  History,
  User,
  Settings,
  Shield,
  LogOut,
  Sun,
  Moon,
  Camera,
  Home as HomeIcon,
  Leaf,
  Compass,
} from "lucide-react";
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

export function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      data-testid="theme-toggle"
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-background/80 text-foreground/80 transition-all hover:bg-secondary hover:text-primary ${className}`}
    >
      {dark ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-primary" />}
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
  const pathname = location.pathname;

  const navLinks = [
    { to: "/", label: "Home", active: pathname === "/" },
    { to: "/#spices", label: "Indian Plants", active: pathname === "/" && location.hash === "#spices" },
    { to: "/history", label: "Scan History", active: pathname === "/history", requiresAuth: true },
  ];

  const handleBrandClick = (event) => {
    if (pathname !== "/") return;
    event.preventDefault();
    if (location.hash) navigate("/", { replace: true });
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/15 bg-background/90 backdrop-blur-md shadow-xs transition-colors">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Emblem */}
        <Link to="/" onClick={handleBrandClick} aria-label="FLORAai home" className="flex items-center gap-3 group" data-testid="nav-logo">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
            <img src="/logo.svg" alt="" className="h-full w-full object-contain drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-primary dark:text-accent leading-none">
              FLORA<span className="text-accent">ai</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground mt-0.5">
              Plant Doctor & Care
            </span>
          </div>
        </Link>

        {/* Central Primary Navigation Links */}
        <div className="hidden items-center gap-1 lg:gap-2 lg:flex">
          {navLinks.map((link) => {
            if (link.requiresAuth && !authed) return null;
            return (
              <Link
                key={link.label}
                to={link.to}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`relative px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-mono font-medium transition-all ${
                  link.active
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-foreground/75 hover:text-primary hover:bg-secondary/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Action Cluster */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          {/* Quick Scan CTA Button */}
          <Button
            size="sm"
            onClick={() => navigate(authed ? "/dashboard" : "/login")}
            className="rounded-full bg-primary/10 border border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground text-xs uppercase tracking-wider font-mono font-semibold transition-all px-4 shadow-2xs"
            data-testid="nav-scan-cta"
          >
            <Camera className="mr-1.5 h-3.5 w-3.5" />
            Scan Plant
          </Button>

          {!authed ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                data-testid="nav-login-btn"
                className="rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-secondary"
              >
                Log in
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/signup")}
                data-testid="nav-signup-btn"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold uppercase tracking-wider px-4"
              >
                Get Started
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/30 p-1 pr-3 transition-colors hover:bg-secondary"
                  data-testid="user-menu-trigger"
                >
                  <Avatar className="h-7 w-7 border border-primary/30">
                    <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[110px] truncate text-xs font-medium text-foreground">
                    {user.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-2xl p-1.5" data-testid="user-menu-content">
                <DropdownMenuLabel className="flex flex-col p-2.5">
                  <span className="truncate font-serif text-sm font-semibold">{user.name}</span>
                  <span className="truncate text-xs font-normal text-muted-foreground font-mono">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")} data-testid="menu-dashboard" className="rounded-xl py-2 cursor-pointer">
                  <Camera className="mr-2 h-4 w-4 text-primary" /> Scan a Plant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/history")} data-testid="menu-history" className="rounded-xl py-2 cursor-pointer">
                  <History className="mr-2 h-4 w-4 text-primary" /> My Scan History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")} data-testid="menu-profile" className="rounded-xl py-2 cursor-pointer">
                  <User className="mr-2 h-4 w-4 text-primary" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} data-testid="menu-settings" className="rounded-xl py-2 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4 text-primary" /> Settings
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} data-testid="menu-admin" className="rounded-xl py-2 cursor-pointer">
                    <Shield className="mr-2 h-4 w-4 text-accent" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-xl py-2 cursor-pointer text-destructive focus:text-destructive"
                  data-testid="menu-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 rounded-l-3xl p-6" data-testid="mobile-menu">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2 font-serif text-lg text-primary">
                  <Leaf className="h-5 w-5 text-accent" /> Menu
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-1.5">
                {authed && (
                  <div className="mb-4 flex items-center gap-3 rounded-2xl border border-primary/15 bg-secondary/50 p-3.5">
                    <Avatar className="h-10 w-10 border border-primary/30">
                      <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="truncate font-serif text-sm font-semibold">{user.name}</p>
                      <p className="truncate font-mono text-[11px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}

                <MobileItem
                  to="/"
                  setOpen={setOpen}
                  navigate={navigate}
                  icon={HomeIcon}
                  label="Home"
                />
                <MobileItem
                  to="/#spices"
                  setOpen={setOpen}
                  navigate={navigate}
                  icon={Compass}
                  label="Indian Plants"
                />

                {authed ? (
                  <>
                    <MobileItem
                      to="/dashboard"
                      setOpen={setOpen}
                      navigate={navigate}
                      icon={Camera}
                      label="Scan a Plant"
                    />
                    <MobileItem
                      to="/history"
                      setOpen={setOpen}
                      navigate={navigate}
                      icon={History}
                      label="My Scan History"
                    />
                    <MobileItem
                      to="/profile"
                      setOpen={setOpen}
                      navigate={navigate}
                      icon={User}
                      label="My Profile"
                    />
                    <MobileItem
                      to="/settings"
                      setOpen={setOpen}
                      navigate={navigate}
                      icon={Settings}
                      label="Settings"
                    />
                    {user.role === "admin" && (
                      <MobileItem
                        to="/admin"
                        setOpen={setOpen}
                        navigate={navigate}
                        icon={Shield}
                        label="Admin Panel"
                      />
                    )}
                    <Button
                      variant="outline"
                      className="mt-4 w-full rounded-full border-destructive/30 text-destructive text-xs uppercase tracking-wider font-mono"
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
                  <div className="mt-4 flex flex-col gap-2.5">
                    <Button
                      variant="outline"
                      className="w-full rounded-full uppercase text-xs font-mono tracking-wider"
                      onClick={() => {
                        setOpen(false);
                        navigate("/login");
                      }}
                    >
                      Log in
                    </Button>
                    <Button
                      className="w-full rounded-full bg-primary text-primary-foreground uppercase text-xs font-mono tracking-wider"
                      onClick={() => {
                        setOpen(false);
                        navigate("/signup");
                      }}
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
      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs uppercase tracking-wider font-mono font-medium text-foreground hover:bg-secondary/70 transition-colors"
    >
      <Icon className="h-4 w-4 text-primary" /> {label}
    </button>
  );
}

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleBrandClick = (event) => {
    if (location.pathname !== "/") return;
    event.preventDefault();
    if (location.hash) navigate("/", { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-primary/10 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Link to="/" onClick={handleBrandClick} aria-label="FLORAai home" className="group flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <img src="/logo.svg" alt="" className="h-10 w-10 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3" />
            <div>
              <span className="font-serif text-xl font-bold">
                FLORA<span>ai</span>
              </span>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary-foreground/65">
                Simple & Organic Plant Health Doctor
              </p>
            </div>
          </Link>
          <p className="max-w-md text-xs text-primary-foreground/80 leading-relaxed font-serif">
            Easy plant health checks and organic home remedies for Indian plants — coconut palms, mangoes,
            courtyard flowers, kitchen spices, and healing herbs.
          </p>
        </div>
        <div className="mt-8 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} FLORAai. Easy Plant Care for Indian Homes & Farms.</span>
          <span className="font-mono text-[10px]">100% Natural & Organic Remedies</span>
        </div>
      </div>
    </footer>
  );
}
