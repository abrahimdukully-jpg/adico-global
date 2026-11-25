"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RecoveryLinkHandler() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function handleRecoveryHash() {
      const hash = window.location.hash;
      if (!hash || !/(?:^|[&#])type=recovery(?:&|$)/.test(hash.slice(1))) return;
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      if (!accessToken || !refreshToken) return;

      try {
        const supabase = createClient();
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) throw error;
        if (active) {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          router.replace("/update-password");
          router.refresh();
        }
      } catch {
        if (active) {
          window.history.replaceState({}, document.title, window.location.pathname);
          router.replace("/sign-in?auth_error=link_invalid");
        }
      }
    }
    void handleRecoveryHash();
    return () => { active = false; };
  }, [router]);

  return null;
}
