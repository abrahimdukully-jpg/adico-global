"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage("");
    if (password.length < 10) { setError("Use at least 10 characters."); return; }
    if (password !== confirm) { setError("The passwords do not match."); return; }
    setBusy(true);
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Your secure setup link is missing or expired. Request a new password recovery email.");
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setMessage("Password saved. You can now sign in to ADICo Global.");
      setTimeout(() => { router.replace("/sign-in"); router.refresh(); }, 1400);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save password. Please try again.");
    } finally { setBusy(false); }
  }

  return <form onSubmit={submit} className="inventory-form" style={{maxWidth:"480px",marginTop:"24px"}}>
    <label>New password<input type="password" autoComplete="new-password" minLength={10} required value={password} onChange={e=>setPassword(e.target.value)} /></label>
    <label>Confirm new password<input type="password" autoComplete="new-password" minLength={10} required value={confirm} onChange={e=>setConfirm(e.target.value)} /></label>
    {error && <p role="alert" style={{color:"#a45b32"}}>{error}</p>}
    {message && <p role="status" style={{color:"#39734a"}}>{message}</p>}
    <button type="submit" disabled={busy}>{busy ? "Saving…" : "Save password"}</button>
  </form>;
}
