"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) throw signInError;
      const { data: role, error: roleError } = await supabase.rpc("current_role");
      if (roleError) throw new Error("Your account role could not be verified. Please contact ADICo support.");
      if (role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("This account is not authorised for administrator access.");
      }
      router.replace("/admin/inventory");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="inventory-form" style={{maxWidth: "480px", marginTop: "24px"}}>
    <label>Email address<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
    <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>
    {error && <p role="alert" style={{color:"#b45309"}}>{error}</p>}
    <button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in as administrator"}</button>
  </form>;
}
