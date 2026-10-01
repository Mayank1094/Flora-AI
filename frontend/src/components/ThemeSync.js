import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

export function ThemeSync() {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const applied = useRef(false);
  useEffect(() => {
    if (user === false) {
      applied.current = false;
      return;
    }
    if (!applied.current && user && typeof user === "object" && user.preferences?.theme) {
      applied.current = true;
      setTheme(user.preferences.theme);
    }
  }, [user, setTheme]);
  return null;
}
