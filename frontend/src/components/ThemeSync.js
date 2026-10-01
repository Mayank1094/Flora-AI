import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

export function ThemeSync() {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  useEffect(() => {
    if (user && typeof user === "object" && user.preferences?.theme) {
      setTheme(user.preferences.theme);
    }
  }, [user, setTheme]);
  return null;
}
