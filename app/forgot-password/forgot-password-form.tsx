"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email,setEmail]=useState("abrahimdukully@gmail.com");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setError(""); setBusy(true);
    try {
      const supabase=createClient();
      const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+"/auth/callback?next=/update-password"});
      if(error) throw error;
      setMessage("If the address is registered, a password setup link will be sent. Check your inbox and spam folder.");
    } catch(e) { setError(e instanceof Error ? e.message : "Unable to request a password link."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="inventory-form" style={{maxWidth:"480px",marginTop:"24px"}}>
    <label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
    {error && <p role="alert" style={{color:"#a45b32"}}>{error}</p>}
    {message && <p role="status">{message}</p>}
    <button type="submit" disabled={busy}>{busy ? "Sending…" : "Send password setup link"}</button>
  </form>;
}
