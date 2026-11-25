import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next");
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/update-password";
  const supabase = await createClient();

  let error: Error | null = null;
  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    error = result.error;
  } else if (tokenHash && (type === "recovery" || type === "invite" || type === "signup" || type === "email")) {
    const result = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    error = result.error;
  } else {
    return NextResponse.redirect(new URL("/sign-in?auth_error=missing_token", url.origin));
  }

  if (error) {
    return NextResponse.redirect(new URL("/sign-in?auth_error=link_invalid", url.origin));
  }
  return NextResponse.redirect(new URL(safeNext, url.origin));
}
